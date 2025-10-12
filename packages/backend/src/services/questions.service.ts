import { supabase } from '../config/database.js';

// Type definitions
interface Question {
  id?: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  leetcode_number?: number;
  problem_statement: string;
  function_signature: string;
  test_cases: TestCase[];
  examples: Example[];
  constraints: string;
  tags: string[];
  hints: string[];
  created_at?: string;
  updated_at?: string;
}

interface TestCase {
  input: Record<string, any>;
  expected: any;
}

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface BattleQuestion {
  id: string;
  battle_id: string;
  question_id: string;
  selected_at?: string;
  is_current?: boolean;
  question?: Question;
}

// Logger for questions service
const dbLog = {
  info: (message: string, data: any = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] QUESTIONS-INFO: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message: string, error: any = null) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] QUESTIONS-ERROR: ${message}`, error || '');
  }
};

// LeetCode 75 questions data (sample - you can add all 75)
const LEETCODE_75_QUESTIONS: Omit<Question, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    leetcode_number: 1,
    problem_statement: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    function_signature: `function twoSum(nums, target) {
    // Your code here
}`,
    test_cases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
      { input: { nums: [3, 3], target: 6 }, expected: [0, 1] }
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "nums[0] + nums[1] = 2 + 7 = 9, return [0, 1]."
      }
    ],
    constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
    tags: ["Array", "Hash Table"],
    hints: ["Use a hash map to store the complement of each number", "For each number, check if its complement exists in the map"]
  },
  {
    title: "Best Time to Buy and Sell Stock",
    slug: "best-time-to-buy-and-sell-stock",
    difficulty: "Easy",
    leetcode_number: 121,
    problem_statement: `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
    function_signature: `function maxProfit(prices) {
    // Your code here
}`,
    test_cases: [
      { input: { prices: [7, 1, 5, 3, 6, 4] }, expected: 5 },
      { input: { prices: [7, 6, 4, 3, 1] }, expected: 0 },
      { input: { prices: [1, 2] }, expected: 1 }
    ],
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5."
      }
    ],
    constraints: "1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4",
    tags: ["Array", "Dynamic Programming"],
    hints: ["Track the minimum price seen so far", "Calculate the maximum profit at each step"]
  },
  {
    title: "Contains Duplicate",
    slug: "contains-duplicate",
    difficulty: "Easy",
    leetcode_number: 217,
    problem_statement: `Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.`,
    function_signature: `function containsDuplicate(nums) {
    // Your code here
}`,
    test_cases: [
      { input: { nums: [1, 2, 3, 1] }, expected: true },
      { input: { nums: [1, 2, 3, 4] }, expected: false },
      { input: { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] }, expected: true }
    ],
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "true",
        explanation: "The element 1 occurs at the indices 0 and 3."
      }
    ],
    constraints: "1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9",
    tags: ["Array", "Hash Table", "Sorting"],
    hints: ["Use a hash set to track seen numbers", "Sort the array and check adjacent elements"]
  }
];

export class QuestionsService {
  
  // Initialize the database with LeetCode 75 questions
  static async seedQuestions(): Promise<Question[]> {
    try {
      // Check if questions already exist
      const { data: existingQuestions, error: checkError } = await supabase
        .from('questions')
        .select('id')
        .limit(1);

      if (checkError) {
        dbLog.error('Error checking existing questions', checkError);
        throw checkError;
      }

      if (existingQuestions && existingQuestions.length > 0) {
        dbLog.info('Questions already seeded, skipping seed');
        return existingQuestions as Question[];
      }

      // Insert all questions
      const { data, error } = await supabase
        .from('questions')
        .insert(LEETCODE_75_QUESTIONS)
        .select();

      if (error) {
        dbLog.error('Error seeding questions', error);
        throw error;
      }

      dbLog.info('Successfully seeded questions', { count: data.length });
      return data as Question[];
    } catch (error) {
      dbLog.error('Failed to seed questions', error);
      throw error;
    }
  }

  // Get random questions for a battle pool
  static async getRandomQuestions(count: number = 10): Promise<Question[]> {
    try {
      // Get random questions using PostgreSQL's TABLESAMPLE or ORDER BY RANDOM()
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('id', { ascending: false }) // Use a more predictable ordering
        .limit(count * 2); // Get more than needed for better randomization

      if (error) {
        dbLog.error('Error getting random questions', error);
        throw error;
      }

      // Shuffle the results to make them more random
      const shuffled = data.sort(() => Math.random() - 0.5).slice(0, count);
      
      dbLog.info('Retrieved random questions', { count: shuffled.length });
      return shuffled as Question[];
    } catch (error) {
      dbLog.error('Failed to get random questions', error);
      throw error;
    }
  }

  // Create a question pool for a specific battle
  static async createBattleQuestionPool(battleId: string, questionCount: number = 10): Promise<void> {
    dbLog.info('Creating battle question pool', { battleId, questionCount });
    
    try {
      // Check if pool already exists
      const { data: existingPool, error: checkError } = await supabase
        .from('battle_questions')
        .select('id')
        .eq('battle_id', battleId)
        .limit(1);

      if (checkError) {
        dbLog.error('Error checking existing battle question pool', checkError);
        throw checkError;
      }

      if (existingPool && existingPool.length > 0) {
        dbLog.info('Battle question pool already exists', { battleId });
        return;
      }

      // Get random questions
      const questions = await this.getRandomQuestions(questionCount);
      
      if (questions.length === 0) {
        throw new Error('No questions available to create battle pool');
      }

      // Create battle question pool entries
      const battleQuestions = questions.map(question => ({
        battle_id: battleId,
        question_id: question.id,
        is_current: false
      }));

      const { error: insertError } = await supabase
        .from('battle_questions')
        .insert(battleQuestions);

      if (insertError) {
        dbLog.error('Error creating battle question pool', insertError);
        throw insertError;
      }

      dbLog.info('Battle question pool created successfully', { 
        battleId, 
        questionsCount: battleQuestions.length 
      });
    } catch (error) {
      dbLog.error('Failed to create battle question pool', error);
      throw error;
    }
  }

  // Get all questions in a battle's pool
  static async getBattleQuestionPool(battleId: string): Promise<Question[]> {
    dbLog.info('Getting battle question pool', { battleId });
    
    try {
      const { data, error } = await supabase
        .from('battle_questions')
        .select(`
          id,
          question_id,
          is_current,
          questions (*)
        `)
        .eq('battle_id', battleId)
        .order('created_at', { ascending: true });

      if (error) {
        dbLog.error('Error getting battle question pool', error);
        throw error;
      }

      const questions = (data || [])
        .map((bq: any) => bq.questions)
        .filter((q: any) => q !== null) as Question[];

      dbLog.info('Battle question pool retrieved', { 
        battleId, 
        questionsCount: questions.length 
      });

      return questions;
    } catch (error) {
      dbLog.error('Failed to get battle question pool', error);
      throw error;
    }
  }

  // Select a random question from the battle's pool to be the current question
  static async selectBattleQuestion(battleId: string): Promise<Question> {
    dbLog.info('Selecting battle question', { battleId });
    
    try {
      // First, unset any current question
      await supabase
        .from('battle_questions')
        .update({ is_current: false })
        .eq('battle_id', battleId);

      // Get all questions in the pool that haven't been selected
      const { data: poolQuestions, error: poolError } = await supabase
        .from('battle_questions')
        .select(`
          id,
          question_id,
          selected_at,
          questions (*)
        `)
        .eq('battle_id', battleId)
        .is('selected_at', null)
        .order('created_at', { ascending: true });

      if (poolError) {
        dbLog.error('Error getting battle question pool for selection', poolError);
        throw poolError;
      }

      if (!poolQuestions || poolQuestions.length === 0) {
        // If all questions have been used, reset and start over
        dbLog.info('All questions used, resetting selection for battle', { battleId });
        
        const { data: allPoolQuestions, error: allPoolError } = await supabase
          .from('battle_questions')
          .select(`
            id,
            question_id,
            questions (*)
          `)
          .eq('battle_id', battleId)
          .order('created_at', { ascending: true });

        if (allPoolError || !allPoolQuestions || allPoolQuestions.length === 0) {
          throw new Error('No questions found in battle pool');
        }

        // Reset all questions
        await supabase
          .from('battle_questions')
          .update({ selected_at: null })
          .eq('battle_id', battleId);

        // Select the first question
        const selectedBattleQuestion = allPoolQuestions[0];
        
        const { error: updateError } = await supabase
          .from('battle_questions')
          .update({ 
            is_current: true, 
            selected_at: new Date().toISOString() 
          })
          .eq('id', selectedBattleQuestion.id);

        if (updateError) {
          dbLog.error('Error updating selected battle question', updateError);
          throw updateError;
        }

        const question = selectedBattleQuestion.questions as unknown as Question;
        dbLog.info('Battle question selected (after reset)', { 
          battleId, 
          questionId: question.id,
          questionTitle: question.title 
        });

        return question;
      }

      // Select a random question from available ones
      const selectedIndex = Math.floor(Math.random() * poolQuestions.length);
      const selectedBattleQuestion = poolQuestions[selectedIndex];

      // Mark it as current and selected
      const { error: updateError } = await supabase
        .from('battle_questions')
        .update({ 
          is_current: true, 
          selected_at: new Date().toISOString() 
        })
        .eq('id', selectedBattleQuestion.id);

      if (updateError) {
        dbLog.error('Error updating selected battle question', updateError);
        throw updateError;
      }

      const question = selectedBattleQuestion.questions as unknown as Question;
      dbLog.info('Battle question selected', { 
        battleId, 
        questionId: question.id,
        questionTitle: question.title 
      });

      return question;
    } catch (error) {
      dbLog.error('Failed to select battle question', error);
      throw error;
    }
  }

  // Get the current question for a battle
  static async getCurrentBattleQuestion(battleId: string): Promise<Question | null> {
    dbLog.info('Getting current battle question', { battleId });
    
    try {
      const { data, error } = await supabase
        .from('battle_questions')
        .select(`
          id,
          question_id,
          questions (*)
        `)
        .eq('battle_id', battleId)
        .eq('is_current', true)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        dbLog.error('Error getting current battle question', error);
        throw error;
      }

      if (!data || !data.questions) {
        dbLog.info('No current question found for battle', { battleId });
        return null;
      }

      const question = data.questions as unknown as Question;
      dbLog.info('Current battle question retrieved', { 
        battleId, 
        questionId: question.id,
        questionTitle: question.title 
      });

      return question;
    } catch (error) {
      dbLog.error('Failed to get current battle question', error);
      throw error;
    }
  }

  // Get a question by ID
  static async getQuestionById(questionId: string): Promise<Question | null> {
    dbLog.info('Getting question by ID', { questionId });
    
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        dbLog.error('Error getting question by ID', error);
        throw error;
      }

      if (!data) {
        dbLog.info('Question not found', { questionId });
        return null;
      }

      dbLog.info('Question retrieved by ID', { 
        questionId, 
        questionTitle: data.title 
      });

      return data as Question;
    } catch (error) {
      dbLog.error('Failed to get question by ID', error);
      throw error;
    }
  }

  // Get all questions
  static async getAllQuestions(): Promise<Question[]> {
    dbLog.info('Getting all questions');
    
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        dbLog.error('Error getting all questions', error);
        throw error;
      }

      dbLog.info('All questions retrieved', { count: data?.length || 0 });
      return (data || []) as Question[];
    } catch (error) {
      dbLog.error('Failed to get all questions', error);
      throw error;
    }
  }

  // Create a new question
  static async createQuestion(questionData: Omit<Question, 'id' | 'created_at' | 'updated_at'>): Promise<Question> {
    dbLog.info('Creating new question', { title: questionData.title });
    
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert(questionData)
        .select()
        .single();

      if (error) {
        dbLog.error('Error creating question', error);
        throw error;
      }

      dbLog.info('Question created successfully', { 
        questionId: data.id,
        title: data.title 
      });

      return data as Question;
    } catch (error) {
      dbLog.error('Failed to create question', error);
      throw error;
    }
  }

  // Update a question
  static async updateQuestion(
    questionId: string, 
    updates: Partial<Omit<Question, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Question> {
    dbLog.info('Updating question', { questionId, updates: Object.keys(updates) });
    
    try {
      const { data, error } = await supabase
        .from('questions')
        .update(updates)
        .eq('id', questionId)
        .select()
        .single();

      if (error) {
        dbLog.error('Error updating question', error);
        throw error;
      }

      dbLog.info('Question updated successfully', { 
        questionId: data.id,
        title: data.title 
      });

      return data as Question;
    } catch (error) {
      dbLog.error('Failed to update question', error);
      throw error;
    }
  }

  // Delete a question
  static async deleteQuestion(questionId: string): Promise<void> {
    dbLog.info('Deleting question', { questionId });
    
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) {
        dbLog.error('Error deleting question', error);
        throw error;
      }

      dbLog.info('Question deleted successfully', { questionId });
    } catch (error) {
      dbLog.error('Failed to delete question', error);
      throw error;
    }
  }
}