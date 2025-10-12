import { supabase, dbLog } from '../config/database.js';
import { QuestionsService } from './questions.service.js';

export class BattleService {
  
  // Create a new battle record in waiting state
  static async createBattle(roomId, adminUserId, participants = [], options = {}) {
    const { scheduledStartTime, durationMinutes = 60 } = options;
    
    dbLog.info('Creating new battle', { 
      roomId, 
      adminUserId, 
      participantCount: participants.length,
      scheduledStartTime,
      durationMinutes
    });
    
    try {
      const battleData = {
        room_id: roomId,
        status: 'waiting',
        admin_user_id: adminUserId,
        participants: participants,
        duration_minutes: durationMinutes
      };

      // Add scheduled start time if provided
      if (scheduledStartTime) {
        battleData.scheduled_start_time = scheduledStartTime;
      }

      const { data, error } = await supabase
        .from('battles')
        .insert(battleData)
        .select()
        .single();

      if (error) {
        dbLog.error('Supabase error creating battle:', error);
        throw error;
      }
      
      // Create question pool for the battle (10 random questions)
      try {
        await QuestionsService.createBattleQuestionPool(data.id);
        dbLog.info('Question pool created for battle', { battleId: data.id });
      } catch (questionError) {
        dbLog.error('Failed to create question pool, but battle was created', questionError);
        // Don't fail the battle creation if question pool fails
      }

      dbLog.info('Battle created successfully', { 
        battleId: data.id, 
        status: data.status,
        scheduledStartTime: data.scheduled_start_time,
        durationMinutes: data.duration_minutes
      });
      return data;
    } catch (error) {
      dbLog.error('Error creating battle:', error);
      throw error;
    }
  }

  // Start a battle (change from waiting to active)
  static async startBattle(roomId, adminUserId) {
    dbLog.info('Starting battle', { roomId, adminUserId });
    
    try {
      // First get the battle to check duration
      const { data: battle, error: fetchError } = await supabase
        .from('battles')
        .select('id, duration_minutes')
        .eq('room_id', roomId)
        .eq('status', 'waiting')
        .eq('admin_user_id', adminUserId)
        .single();

      if (fetchError || !battle) {
        dbLog.error('Battle not found or user not authorized:', fetchError);
        throw fetchError || new Error('Battle not found');
      }

      const startTime = new Date();
      const autoEndTime = new Date(startTime.getTime() + (battle.duration_minutes * 60 * 1000));

      const { data, error } = await supabase
        .from('battles')
        .update({
          status: 'active',
          started_at: startTime.toISOString(),
          auto_end_time: autoEndTime.toISOString()
        })
        .eq('id', battle.id)
        .select()
        .single();

      if (error) {
        dbLog.error('Supabase error starting battle:', error);
        throw error;
      }
      
      if (data) {
        // Select a random question from the battle's question pool
        try {
          const selectedQuestion = await QuestionsService.selectBattleQuestion(data.id);
          dbLog.info('Question selected for battle', { 
            battleId: data.id, 
            questionTitle: selectedQuestion.title,
            questionId: selectedQuestion.id
          });
        } catch (questionError) {
          dbLog.error('Failed to select battle question', questionError);
          // Don't fail the battle start if question selection fails
        }

        dbLog.info('Battle started successfully', { 
          battleId: data.id, 
          startedAt: data.started_at,
          autoEndTime: data.auto_end_time,
          durationMinutes: data.duration_minutes,
          status: data.status 
        });
      } else {
        dbLog.error('No battle data returned - battle may not exist or user not authorized');
      }
      
      return data;
    } catch (error) {
      dbLog.error('Error starting battle:', error);
      throw error;
    }
  }

  // Update battle with results
  static async completeBattle(roomId, results, endedBy = 'admin') {
    dbLog.info('Completing battle', { roomId, resultsCount: results?.length, endedBy });
    
    try {
      const { data, error } = await supabase
        .from('battles')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          results: results,
          ended_by: endedBy
        })
        .eq('room_id', roomId)
        .eq('status', 'active')
        .select()
        .single();

      if (error) {
        dbLog.error('Supabase error completing battle:', error);
        throw error;
      }

      // Create individual battle participation records
      if (results && results.length > 0) {
        await this.createBattleParticipations(data.id, results);
      }

      dbLog.info('Battle completed successfully', { 
        battleId: data.id, 
        completedAt: data.completed_at,
        endedBy: data.ended_by
      });
      
      return data;
    } catch (error) {
      dbLog.error('Error completing battle:', error);
      throw error;
    }
  }

  // Create battle participation records for each user
  static async createBattleParticipations(battleId, results) {
    try {
      const participations = results.map((result, index) => ({
        battle_id: battleId,
        user_id: result.userId,
        placement: index + 1, // 1st place, 2nd place, etc.
        tests_passed: result.testsPassed,
        total_tests: result.totalTests,
        score: result.testsPassed,
        completion_time: result.completionTime || null
      }));

      const { data, error } = await supabase
        .from('battle_participations')
        .insert(participations)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating battle participations:', error);
      throw error;
    }
  }

  // Get user's battle history
  static async getUserBattleHistory(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('battle_participations')
        .select(`
          *,
          battles (
            room_id,
            started_at,
            completed_at,
            status
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user battle history:', error);
      throw error;
    }
  }

  // Get user statistics
  static async getUserStats(userId) {
    try {
      const { data, error } = await supabase
        .from('battle_participations')
        .select('placement, tests_passed, total_tests')
        .eq('user_id', userId);

      if (error) throw error;

      const stats = {
        totalBattles: data.length,
        wins: data.filter(b => b.placement === 1).length,
        secondPlace: data.filter(b => b.placement === 2).length,
        thirdPlace: data.filter(b => b.placement === 3).length,
        averageTestsPassed: data.length > 0 ? 
          data.reduce((sum, b) => sum + b.tests_passed, 0) / data.length : 0,
        averagePlacement: data.length > 0 ? 
          data.reduce((sum, b) => sum + b.placement, 0) / data.length : 0
      };

      return stats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  // Get active battle for a room
  static async getActiveBattle(roomId) {
    try {
      const { data, error } = await supabase
        .from('battles')
        .select('*')
        .eq('room_id', roomId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      return data;
    } catch (error) {
      console.error('Error fetching active battle:', error);
      throw error;
    }
  }

  // Get any battle (waiting or active) for a room
  static async getBattle(roomId) {
    try {
      const { data, error } = await supabase
        .from('battles')
        .select('*')
        .eq('room_id', roomId)
        .in('status', ['waiting', 'active'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      return data;
    } catch (error) {
      console.error('Error fetching battle:', error);
      throw error;
    }
  }

  // Check if user is admin for a battle
  static async isAdminForBattle(roomId, userId) {
    try {
      const { data, error } = await supabase
        .from('battles')
        .select('admin_user_id')
        .eq('room_id', roomId)
        .in('status', ['waiting', 'active'])
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.admin_user_id === userId;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  // Update participant in active battle
  static async updateBattleParticipant(roomId, userId, testsPassed, totalTests) {
    try {
      const battle = await this.getActiveBattle(roomId);
      if (!battle) return null;

      // Update the participants array in the battle record
      const participants = battle.participants || [];
      const existingParticipantIndex = participants.findIndex(p => p.userId === userId);
      
      const participantData = {
        userId,
        testsPassed,
        totalTests,
        updatedAt: new Date().toISOString()
      };

      if (existingParticipantIndex >= 0) {
        participants[existingParticipantIndex] = participantData;
      } else {
        participants.push(participantData);
      }

      const { data, error } = await supabase
        .from('battles')
        .update({ participants })
        .eq('id', battle.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating battle participant:', error);
      throw error;
    }
  }

  // Add participant to waiting battle
  static async addParticipantToBattle(roomId, userId) {
    try {
      const battle = await this.getBattle(roomId);
      if (!battle) return null;

      const participants = battle.participants || [];
      const existingParticipantIndex = participants.findIndex(p => p.userId === userId);
      
      if (existingParticipantIndex === -1) {
        participants.push({
          userId,
          joinedAt: new Date().toISOString(),
          testsPassed: 0,
          totalTests: 0
        });

        const { data, error } = await supabase
          .from('battles')
          .update({ participants })
          .eq('id', battle.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      return battle;
    } catch (error) {
      console.error('Error adding participant to battle:', error);
      throw error;
    }
  }

  // Get battles that should auto-start based on scheduled time
  static async getBattlesToAutoStart() {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('battles')
        .select('*')
        .eq('status', 'waiting')
        .not('scheduled_start_time', 'is', null)
        .lte('scheduled_start_time', now);

      if (error) {
        dbLog.error('Error fetching battles to auto-start:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      dbLog.error('Error getting battles to auto-start:', error);
      throw error;
    }
  }

  // Get battles that should auto-end based on duration
  static async getBattlesToAutoEnd() {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('battles')
        .select('*')
        .eq('status', 'active')
        .not('auto_end_time', 'is', null)
        .lte('auto_end_time', now);

      if (error) {
        dbLog.error('Error fetching battles to auto-end:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      dbLog.error('Error getting battles to auto-end:', error);
      throw error;
    }
  }

  // Auto-start a scheduled battle
  static async autoStartBattle(battleId) {
    dbLog.info('Auto-starting scheduled battle', { battleId });
    
    try {
      // Get battle info first
      const { data: battle, error: fetchError } = await supabase
        .from('battles')
        .select('*')
        .eq('id', battleId)
        .eq('status', 'waiting')
        .single();

      if (fetchError || !battle) {
        dbLog.error('Battle not found for auto-start:', fetchError);
        return null;
      }

      const startTime = new Date();
      const autoEndTime = new Date(startTime.getTime() + (battle.duration_minutes * 60 * 1000));

      const { data, error } = await supabase
        .from('battles')
        .update({
          status: 'active',
          started_at: startTime.toISOString(),
          auto_end_time: autoEndTime.toISOString()
        })
        .eq('id', battleId)
        .select()
        .single();

      if (error) {
        dbLog.error('Supabase error auto-starting battle:', error);
        throw error;
      }

      dbLog.info('Battle auto-started successfully', { 
        battleId: data.id, 
        roomId: data.room_id,
        startedAt: data.started_at,
        autoEndTime: data.auto_end_time
      });

      return data;
    } catch (error) {
      dbLog.error('Error auto-starting battle:', error);
      throw error;
    }
  }

  // Auto-end a battle that has reached its duration
  static async autoEndBattle(battleId, finalResults = []) {
    dbLog.info('Auto-ending battle due to timeout', { battleId });
    
    try {
      const { data, error } = await supabase
        .from('battles')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          results: finalResults,
          ended_by: 'timeout'
        })
        .eq('id', battleId)
        .eq('status', 'active')
        .select()
        .single();

      if (error) {
        dbLog.error('Supabase error auto-ending battle:', error);
        throw error;
      }

      // Create individual battle participation records
      if (finalResults && finalResults.length > 0) {
        await this.createBattleParticipations(data.id, finalResults);
      }

      dbLog.info('Battle auto-ended successfully', { 
        battleId: data.id, 
        roomId: data.room_id,
        completedAt: data.completed_at,
        endedBy: data.ended_by
      });

      return data;
    } catch (error) {
      dbLog.error('Error auto-ending battle:', error);
      throw error;
    }
  }

  // Update battle timing settings
  static async updateBattleTiming(battleId, scheduledStartTime, durationMinutes) {
    dbLog.info('Updating battle timing', { battleId, scheduledStartTime, durationMinutes });
    
    try {
      const updateData = {};
      
      if (scheduledStartTime !== undefined) {
        updateData.scheduled_start_time = scheduledStartTime;
      }
      
      if (durationMinutes !== undefined) {
        updateData.duration_minutes = durationMinutes;
      }

      const { data, error } = await supabase
        .from('battles')
        .update(updateData)
        .eq('id', battleId)
        .eq('status', 'waiting') // Only allow timing updates for waiting battles
        .select()
        .single();

      if (error) {
        dbLog.error('Supabase error updating battle timing:', error);
        throw error;
      }

      dbLog.info('Battle timing updated successfully', { 
        battleId: data.id,
        scheduledStartTime: data.scheduled_start_time,
        durationMinutes: data.duration_minutes
      });

      return data;
    } catch (error) {
      dbLog.error('Error updating battle timing:', error);
      throw error;
    }
  }

  // Get the current question for a battle
  static async getCurrentBattleQuestion(battleId) {
    dbLog.info('Getting current battle question', { battleId });
    
    try {
      const question = await QuestionsService.getCurrentBattleQuestion(battleId);
      return question;
    } catch (error) {
      dbLog.error('Error getting current battle question:', error);
      throw error;
    }
  }

  // Get the question pool for a battle
  static async getBattleQuestionPool(battleId) {
    dbLog.info('Getting battle question pool', { battleId });
    
    try {
      const questions = await QuestionsService.getBattleQuestionPool(battleId);
      return questions;
    } catch (error) {
      dbLog.error('Error getting battle question pool:', error);
      throw error;
    }
  }

  // Get question by ID (for displaying question details)
  static async getQuestionById(questionId) {
    dbLog.info('Getting question by ID', { questionId });
    
    try {
      const question = await QuestionsService.getQuestionById(questionId);
      return question;
    } catch (error) {
      dbLog.error('Error getting question by ID:', error);
      throw error;
    }
  }
}