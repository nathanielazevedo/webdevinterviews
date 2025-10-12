import { supabase, dbLog } from '../config/database.js';
import { QuestionsService } from './questions.service.js';

// Type definitions
interface BattleParticipant {
  userId: string;
  joinedAt: string;
  testsPassed?: number;
  totalTests?: number;
}

interface BattleCreateOptions {
  scheduledStartTime?: string;
  durationMinutes?: number;
}

interface BattleResult {
  userId: string;
  testsPassed: number;
  totalTests: number;
  completionTime?: number | null;
  placement?: number;
}

interface Battle {
  id: string;
  room_id: string;
  status: 'waiting' | 'active' | 'completed';
  admin_user_id: string;
  participants: BattleParticipant[];
  duration_minutes: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  scheduled_start_time?: string;
  auto_end_time?: string;
  ended_by?: string;
  results?: BattleResult[];
}

interface UserStats {
  total_battles: number;
  wins: number;
  win_rate: number;
  avg_tests_passed: number;
  total_tests_passed: number;
  best_placement: number;
  recent_battles: number;
}

export class BattleService {
  
  // Create a new battle record in waiting state
  static async createBattle(
    roomId: string, 
    adminUserId: string, 
    participants: BattleParticipant[] = [], 
    options: BattleCreateOptions = {}
  ): Promise<Battle> {
    const { scheduledStartTime, durationMinutes = 60 } = options;
    
    dbLog.info('Creating new battle', { 
      roomId, 
      adminUserId, 
      participantCount: participants.length,
      scheduledStartTime,
      durationMinutes
    });
    
    try {
      const battleData: any = {
        room_id: roomId,
        status: 'waiting' as const,
        admin_user_id: adminUserId,
        participants,
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
      return data as Battle;
    } catch (error) {
      dbLog.error('Error creating battle:', error);
      throw error;
    }
  }

  // Start a battle (change from waiting to active)
  static async startBattle(roomId: string, adminUserId: string): Promise<Battle> {
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
      
      return data as Battle;
    } catch (error) {
      dbLog.error('Error starting battle:', error);
      throw error;
    }
  }

  // Update battle with results
  static async completeBattle(roomId: string, results: BattleResult[], endedBy: string = 'admin'): Promise<Battle> {
    dbLog.info('Completing battle', { roomId, resultsCount: results?.length, endedBy });
    
    try {
      const { data, error } = await supabase
        .from('battles')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          results,
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
      
      if (data) {
        // Create battle participation records for analytics
        try {
          await this.createBattleParticipations(data.id, results);
          dbLog.info('Battle participation records created', { battleId: data.id });
        } catch (participationError) {
          dbLog.error('Failed to create participation records, but battle was completed', participationError);
          // Don't fail the battle completion if participation creation fails
        }

        dbLog.info('Battle completed successfully', { 
          battleId: data.id, 
          completedAt: data.completed_at,
          resultsCount: results?.length,
          endedBy: data.ended_by
        });
      }

      return data as Battle;
    } catch (error) {
      dbLog.error('Error completing battle:', error);
      throw error;
    }
  }

  // Create battle participation records for analytics
  static async createBattleParticipations(battleId: string, results: BattleResult[]): Promise<void> {
    dbLog.info('Creating battle participation records', { battleId, resultsCount: results.length });
    
    try {
      const participations = results.map(result => ({
        battle_id: battleId,
        user_id: result.userId,
        tests_passed: result.testsPassed,
        total_tests: result.totalTests,
        completion_time: result.completionTime,
        placement: result.placement || null
      }));

      const { error } = await supabase
        .from('battle_participations')
        .insert(participations);

      if (error) {
        dbLog.error('Supabase error creating participation records:', error);
        throw error;
      }

      dbLog.info('Battle participation records created successfully');
    } catch (error) {
      dbLog.error('Error creating battle participation records:', error);
      throw error;
    }
  }

  // Get user's battle history
  static async getUserBattleHistory(userId: string, limit: number = 50): Promise<Battle[]> {
    dbLog.info('Fetching user battle history', { userId, limit });
    
    try {
      const { data, error } = await supabase
        .from('battles')
        .select('*')
        .contains('participants', [{ userId }])
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        dbLog.error('Supabase error fetching user battles:', error);
        throw error;
      }

      dbLog.info('User battle history fetched successfully', { 
        userId, 
        battlesCount: data?.length || 0 
      });

      return (data || []) as Battle[];
    } catch (error) {
      dbLog.error('Error fetching user battle history:', error);
      throw error;
    }
  }

  // Get user statistics
  static async getUserStats(userId: string): Promise<UserStats> {
    dbLog.info('Fetching user stats', { userId });
    
    try {
      const { data, error } = await supabase
        .rpc('get_user_battle_stats', { user_id: userId });

      if (error) {
        dbLog.error('Supabase error fetching user stats:', error);
        throw error;
      }

      const stats = data?.[0] || {
        total_battles: 0,
        wins: 0,
        win_rate: 0,
        avg_tests_passed: 0,
        total_tests_passed: 0,
        best_placement: null,
        recent_battles: 0
      };

      dbLog.info('User stats fetched successfully', { userId, stats });
      return stats as UserStats;
    } catch (error) {
      dbLog.error('Error fetching user stats:', error);
      throw error;
    }
  }

  // Get active battle for a room
  static async getActiveBattle(roomId: string): Promise<Battle | null> {
    dbLog.debug('Fetching active battle', { roomId });
    
    try {
      const { data, error } = await supabase
        .from('battles')
        .select('*')
        .eq('room_id', roomId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        dbLog.error('Supabase error fetching active battle:', error);
        throw error;
      }

      return data as Battle || null;
    } catch (error) {
      dbLog.error('Error fetching active battle:', error);
      throw error;
    }
  }

  // Get any battle for a room (latest)
  static async getBattle(roomId: string): Promise<Battle | null> {
    dbLog.debug('Fetching battle', { roomId });
    
    try {
      const { data, error } = await supabase
        .from('battles')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        dbLog.error('Supabase error fetching battle:', error);
        throw error;
      }

      return data as Battle || null;
    } catch (error) {
      dbLog.error('Error fetching battle:', error);
      throw error;  
    }
  }

  // Check if user is admin for a battle
  static async isAdminForBattle(roomId: string, userId: string): Promise<boolean> {
    dbLog.debug('Checking admin status', { roomId, userId });
    
    try {
      const { data, error } = await supabase
        .from('battles')
        .select('admin_user_id')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        dbLog.error('Supabase error checking admin status:', error);
        throw error;
      }

      const isAdmin = data?.admin_user_id === userId;
      dbLog.debug('Admin status checked', { roomId, userId, isAdmin });
      return isAdmin;
    } catch (error) {
      dbLog.error('Error checking admin status:', error);
      throw error;
    }
  }

  // Update battle participant data
  static async updateBattleParticipant(
    roomId: string, 
    userId: string, 
    testsPassed: number, 
    totalTests: number
  ): Promise<void> {
    dbLog.debug('Updating battle participant', { roomId, userId, testsPassed, totalTests });
    
    try {
      // Get the current battle
      const { data: battle, error: fetchError } = await supabase
        .from('battles')
        .select('id, participants')
        .eq('room_id', roomId)
        .eq('status', 'active')
        .single();

      if (fetchError || !battle) {
        dbLog.error('Active battle not found for participant update:', fetchError);
        throw fetchError || new Error('Active battle not found');
      }

      // Update participant data
      const participants = battle.participants || [];
      const participantIndex = participants.findIndex((p: BattleParticipant) => p.userId === userId);
      
      if (participantIndex >= 0) {
        participants[participantIndex] = {
          ...participants[participantIndex],
          testsPassed,
          totalTests
        };
      } else {
        // Add new participant if not found
        participants.push({
          userId,
          joinedAt: new Date().toISOString(),
          testsPassed,
          totalTests
        });
      }

      const { error: updateError } = await supabase
        .from('battles')
        .update({ participants })
        .eq('id', battle.id);

      if (updateError) {
        dbLog.error('Supabase error updating participant:', updateError);
        throw updateError;
      }

      dbLog.debug('Battle participant updated successfully', { 
        battleId: battle.id, 
        userId, 
        testsPassed, 
        totalTests 
      });
    } catch (error) {
      dbLog.error('Error updating battle participant:', error);
      throw error;
    }
  }

  // Add participant to battle
  static async addParticipantToBattle(roomId: string, userId: string): Promise<void> {
    dbLog.debug('Adding participant to battle', { roomId, userId });
    
    try {
      // Get the current battle
      const { data: battle, error: fetchError } = await supabase
        .from('battles')
        .select('id, participants')
        .eq('room_id', roomId)
        .neq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !battle) {
        dbLog.error('Battle not found for participant addition:', fetchError);
        throw fetchError || new Error('Battle not found');
      }

      // Check if participant already exists
      const participants = battle.participants || [];
      const existingParticipant = participants.find((p: BattleParticipant) => p.userId === userId);
      
      if (existingParticipant) {
        dbLog.debug('Participant already exists in battle', { battleId: battle.id, userId });
        return;
      }

      // Add new participant
      participants.push({
        userId,
        joinedAt: new Date().toISOString(),
        testsPassed: 0,
        totalTests: 0
      });

      const { error: updateError } = await supabase
        .from('battles')
        .update({ participants })
        .eq('id', battle.id);

      if (updateError) {
        dbLog.error('Supabase error adding participant:', updateError);
        throw updateError;
      }

      dbLog.info('Participant added to battle successfully', { 
        battleId: battle.id, 
        userId,
        totalParticipants: participants.length
      });
    } catch (error) {
      dbLog.error('Error adding participant to battle:', error);
      throw error;
    }
  }

  // Get battles scheduled to auto-start
  static async getBattlesToAutoStart(): Promise<Battle[]> {
    dbLog.debug('Fetching battles to auto-start');
    
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('battles')
        .select('*')
        .eq('status', 'waiting')
        .not('scheduled_start_time', 'is', null)
        .lte('scheduled_start_time', now);

      if (error) {
        dbLog.error('Supabase error fetching battles to auto-start:', error);
        throw error;
      }

      dbLog.debug('Battles to auto-start fetched', { count: data?.length || 0 });
      return (data || []) as Battle[];
    } catch (error) {
      dbLog.error('Error fetching battles to auto-start:', error);
      throw error;
    }
  }

  // Get battles that should auto-end
  static async getBattlesToAutoEnd(): Promise<Battle[]> {
    dbLog.debug('Fetching battles to auto-end');
    
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('battles')
        .select('*')
        .eq('status', 'active')
        .not('auto_end_time', 'is', null)
        .lte('auto_end_time', now);

      if (error) {
        dbLog.error('Supabase error fetching battles to auto-end:', error);
        throw error;
      }

      dbLog.debug('Battles to auto-end fetched', { count: data?.length || 0 });
      return (data || []) as Battle[];
    } catch (error) {
      dbLog.error('Error fetching battles to auto-end:', error);
      throw error;
    }
  }

  // Auto-start a scheduled battle
  static async autoStartBattle(battleId: string): Promise<Battle> {
    dbLog.info('Auto-starting scheduled battle', { battleId });
    
    try {
      // First get the battle to check duration
      const { data: battle, error: fetchError } = await supabase
        .from('battles')
        .select('id, duration_minutes, scheduled_start_time')
        .eq('id', battleId)
        .eq('status', 'waiting')
        .single();

      if (fetchError || !battle) {
        dbLog.error('Scheduled battle not found:', fetchError);
        throw fetchError || new Error('Scheduled battle not found');
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

      if (data) {
        // Select a random question from the battle's question pool
        try {
          const selectedQuestion = await QuestionsService.selectBattleQuestion(data.id);
          dbLog.info('Question selected for auto-started battle', { 
            battleId: data.id, 
            questionTitle: selectedQuestion.title,
            questionId: selectedQuestion.id
          });
        } catch (questionError) {
          dbLog.error('Failed to select battle question for auto-start', questionError);
        }

        dbLog.info('Battle auto-started successfully', { 
          battleId: data.id, 
          startedAt: data.started_at,
          autoEndTime: data.auto_end_time,
          scheduledStartTime: battle.scheduled_start_time
        });
      }

      return data as Battle;
    } catch (error) {
      dbLog.error('Error auto-starting battle:', error);
      throw error;
    }
  }

  // Auto-end an expired battle
  static async autoEndBattle(battleId: string, finalResults: BattleResult[] = []): Promise<Battle> {
    dbLog.info('Auto-ending expired battle', { battleId, resultsCount: finalResults.length });
    
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

      if (data && finalResults.length > 0) {
        // Create battle participation records for analytics
        try {
          await this.createBattleParticipations(data.id, finalResults);
          dbLog.info('Battle participation records created for auto-ended battle', { battleId: data.id });
        } catch (participationError) {
          dbLog.error('Failed to create participation records for auto-ended battle', participationError);
        }
      }

      dbLog.info('Battle auto-ended successfully', { 
        battleId: data.id, 
        completedAt: data.completed_at,
        resultsCount: finalResults.length
      });

      return data as Battle;
    } catch (error) {
      dbLog.error('Error auto-ending battle:', error);
      throw error;
    }
  }

  // Update battle timing (scheduled start and duration)
  static async updateBattleTiming(
    battleId: string, 
    scheduledStartTime?: string, 
    durationMinutes?: number
  ): Promise<Battle> {
    dbLog.info('Updating battle timing', { battleId, scheduledStartTime, durationMinutes });
    
    try {
      const updates: any = {};
      
      if (scheduledStartTime !== undefined) {
        updates.scheduled_start_time = scheduledStartTime;
      }
      
      if (durationMinutes !== undefined) {
        updates.duration_minutes = durationMinutes;
      }

      if (Object.keys(updates).length === 0) {
        throw new Error('No timing updates provided');
      }

      const { data, error } = await supabase
        .from('battles')
        .update(updates)
        .eq('id', battleId)
        .eq('status', 'waiting')
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

      return data as Battle;
    } catch (error) {
      dbLog.error('Error updating battle timing:', error);
      throw error;
    }
  }

  // Get current question for a battle
  static async getCurrentBattleQuestion(battleId: string): Promise<any> {
    dbLog.debug('Fetching current battle question', { battleId });
    
    try {
      return await QuestionsService.getCurrentBattleQuestion(battleId);
    } catch (error) {
      dbLog.error('Error fetching current battle question:', error);
      throw error;
    }
  }

  // Get question pool for a battle
  static async getBattleQuestionPool(battleId: string): Promise<any[]> {
    dbLog.debug('Fetching battle question pool', { battleId });
    
    try {
      return await QuestionsService.getBattleQuestionPool(battleId);
    } catch (error) {
      dbLog.error('Error fetching battle question pool:', error);
      throw error;
    }
  }

  // Get a specific question by ID
  static async getQuestionById(questionId: string): Promise<any> {
    dbLog.debug('Fetching question by ID', { questionId });
    
    try {
      return await QuestionsService.getQuestionById(questionId);
    } catch (error) {
      dbLog.error('Error fetching question by ID:', error);
      throw error;
    }
  }
}