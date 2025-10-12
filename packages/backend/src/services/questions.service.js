import { supabase } from '../config/database.js';

// LeetCode 75 questions data (sample - you can add all 75)
const LEETCODE_75_QUESTIONS = [
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
    hints: ["Keep track of the minimum price seen so far", "Calculate profit at each step"]
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
        explanation: "Element 1 appears at indices 0 and 3."
      }
    ],
    constraints: "1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9",
    tags: ["Array", "Hash Table", "Sorting"],
    hints: ["Use a Set to track seen elements", "Sort the array and check adjacent elements"]
  },
  {
    title: "Product of Array Except Self",
    slug: "product-of-array-except-self",
    difficulty: "Medium",
    leetcode_number: 238,
    problem_statement: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].

The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.

You must write an algorithm that runs in O(n) time and without using the division operation.`,
    function_signature: `function productExceptSelf(nums) {
    // Your code here
}`,
    test_cases: [
      { input: { nums: [1, 2, 3, 4] }, expected: [24, 12, 8, 6] },
      { input: { nums: [-1, 1, 0, -3, 3] }, expected: [0, 0, 9, 0, 0] }
    ],
    examples: [
      {
        input: "nums = [1,2,3,4]",
        output: "[24,12,8,6]",
        explanation: "answer[0] = 2*3*4 = 24, answer[1] = 1*3*4 = 12, etc."
      }
    ],
    constraints: "2 <= nums.length <= 10^5\n-30 <= nums[i] <= 30",
    tags: ["Array", "Prefix Sum"],
    hints: ["Calculate left products first", "Then calculate right products in second pass"]
  },
  {
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    difficulty: "Medium",
    leetcode_number: 53,
    problem_statement: `Given an integer array nums, find the subarray with the largest sum, and return its sum.`,
    function_signature: `function maxSubArray(nums) {
    // Your code here
}`,
    test_cases: [
      { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expected: 6 },
      { input: { nums: [1] }, expected: 1 },
      { input: { nums: [5, 4, -1, 7, 8] }, expected: 23 }
    ],
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6."
      }
    ],
    constraints: "1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4",
    tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
    hints: ["Use Kadane's algorithm", "Keep track of current sum and maximum sum"]
  },
  {
    title: "3Sum",
    slug: "3sum",
    difficulty: "Medium",
    leetcode_number: 15,
    problem_statement: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.`,
    function_signature: `function threeSum(nums) {
    // Your code here
}`,
    test_cases: [
      { input: { nums: [-1, 0, 1, 2, -1, -4] }, expected: [[-1, -1, 2], [-1, 0, 1]] },
      { input: { nums: [0, 1, 1] }, expected: [] },
      { input: { nums: [0, 0, 0] }, expected: [[0, 0, 0]] }
    ],
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
        explanation: "nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0, etc."
      }
    ],
    constraints: "3 <= nums.length <= 3000\n-10^5 <= nums[i] <= 10^5",
    tags: ["Array", "Two Pointers", "Sorting"],
    hints: ["Sort the array first", "Use two pointers technique", "Skip duplicates"]
  },
  {
    title: "Merge Intervals",
    slug: "merge-intervals",
    difficulty: "Medium",
    leetcode_number: 56,
    problem_statement: `Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    function_signature: `function merge(intervals) {
    // Your code here
}`,
    test_cases: [
      { input: { intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] }, expected: [[1, 6], [8, 10], [15, 18]] },
      { input: { intervals: [[1, 4], [4, 5]] }, expected: [[1, 5]] }
    ],
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
      }
    ],
    constraints: "1 <= intervals.length <= 10^4\nintervals[i].length == 2",
    tags: ["Array", "Sorting"],
    hints: ["Sort intervals by start time", "Merge overlapping intervals"]
  },
  {
    title: "Group Anagrams",
    slug: "group-anagrams",
    difficulty: "Medium",
    leetcode_number: 49,
    problem_statement: `Given an array of strings strs, group the anagrams together. You can return the answer in any order.`,
    function_signature: `function groupAnagrams(strs) {
    // Your code here
}`,
    test_cases: [
      { input: { strs: ["eat", "tea", "tan", "ate", "nat", "bat"] }, expected: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]] },
      { input: { strs: [""] }, expected: [[""]] },
      { input: { strs: ["a"] }, expected: [["a"]] }
    ],
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation: "Group strings that are anagrams of each other."
      }
    ],
    constraints: "1 <= strs.length <= 10^4\n0 <= strs[i].length <= 100",
    tags: ["Array", "Hash Table", "String", "Sorting"],
    hints: ["Use sorted string as key", "Group strings with same sorted key"]
  },
  {
    title: "Valid Anagram",
    slug: "valid-anagram",
    difficulty: "Easy",
    leetcode_number: 242,
    problem_statement: `Given two strings s and t, return true if t is an anagram of s, and false otherwise.`,
    function_signature: `function isAnagram(s, t) {
    // Your code here
}`,
    test_cases: [
      { input: { s: "anagram", t: "nagaram" }, expected: true },
      { input: { s: "rat", t: "car" }, expected: false }
    ],
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: "true",
        explanation: "Both strings contain the same characters with the same frequency."
      }
    ],
    constraints: "1 <= s.length, t.length <= 5 * 10^4\ns and t consist of lowercase English letters.",
    tags: ["Hash Table", "String", "Sorting"],
    hints: ["Sort both strings and compare", "Use character frequency count"]
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Easy",
    leetcode_number: 20,
    problem_statement: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.`,
    function_signature: `function isValid(s) {
    // Your code here
}`,
    test_cases: [
      { input: { s: "()" }, expected: true },
      { input: { s: "()[]{}" }, expected: true },
      { input: { s: "(]" }, expected: false },
      { input: { s: "([)]" }, expected: false }
    ],
    examples: [
      {
        input: 's = "()"',
        output: "true",
        explanation: "The parentheses are properly matched."
      }
    ],
    constraints: "1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'.",
    tags: ["String", "Stack"],
    hints: ["Use a stack to track opening brackets", "Match closing brackets with most recent opening bracket"]
  }
];

export class QuestionsService {
  // Initialize the database with LeetCode 75 questions
  static async seedQuestions() {
    const dbLog = {
      info: (message, data = null) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] QUESTIONS-INFO: ${message}`, data ? JSON.stringify(data, null, 2) : '');
      },
      error: (message, error = null) => {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] QUESTIONS-ERROR: ${message}`, error || '');
      }
    };

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
        return;
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
      return data;
    } catch (error) {
      dbLog.error('Failed to seed questions', error);
      throw error;
    }
  }

  // Get 10 random questions for a battle pool
  static async getRandomQuestions(count = 10) {
    const dbLog = {
      info: (message, data = null) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] QUESTIONS-INFO: ${message}`, data ? JSON.stringify(data, null, 2) : '');
      },
      error: (message, error = null) => {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] QUESTIONS-ERROR: ${message}`, error || '');
      }
    };

    try {
      // Get random questions using PostgreSQL's TABLESAMPLE or ORDER BY RANDOM()
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('id', { ascending: false }) // Use a more predictable ordering
        .limit(count);

      if (error) {
        dbLog.error('Error getting random questions', error);
        throw error;
      }

      // Shuffle the results to make them more random
      const shuffled = data.sort(() => Math.random() - 0.5).slice(0, count);
      
      dbLog.info('Retrieved random questions', { count: shuffled.length });
      return shuffled;
    } catch (error) {
      dbLog.error('Failed to get random questions', error);
      throw error;
    }
  }

  // Create question pool for a battle
  static async createBattleQuestionPool(battleId) {
    const dbLog = {
      info: (message, data = null) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] QUESTIONS-INFO: ${message}`, data ? JSON.stringify(data, null, 2) : '');
      },
      error: (message, error = null) => {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] QUESTIONS-ERROR: ${message}`, error || '');
      }
    };

    try {
      // Get 10 random questions
      const questions = await this.getRandomQuestions(10);
      
      // Create pool entries
      const poolEntries = questions.map(question => ({
        battle_id: battleId,
        question_id: question.id
      }));

      const { data, error } = await supabase
        .from('battle_question_pools')
        .insert(poolEntries)
        .select();

      if (error) {
        dbLog.error('Error creating battle question pool', error);
        throw error;
      }

      dbLog.info('Created battle question pool', { battleId, questionCount: data.length });
      return data;
    } catch (error) {
      dbLog.error('Failed to create battle question pool', error);
      throw error;
    }
  }

  // Get question pool for a battle
  static async getBattleQuestionPool(battleId) {
    const dbLog = {
      info: (message, data = null) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] QUESTIONS-INFO: ${message}`, data ? JSON.stringify(data, null, 2) : '');
      },
      error: (message, error = null) => {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] QUESTIONS-ERROR: ${message}`, error || '');
      }
    };

    try {
      const { data, error } = await supabase
        .from('battle_question_pools')
        .select(`
          *,
          questions (*)
        `)
        .eq('battle_id', battleId);

      if (error) {
        dbLog.error('Error getting battle question pool', error);
        throw error;
      }

      const questions = data.map(pool => pool.questions);
      dbLog.info('Retrieved battle question pool', { battleId, questionCount: questions.length });
      return questions;
    } catch (error) {
      dbLog.error('Failed to get battle question pool', error);
      throw error;
    }
  }

  // Select random question from battle pool and set as current question
  static async selectBattleQuestion(battleId) {
    const dbLog = {
      info: (message, data = null) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] QUESTIONS-INFO: ${message}`, data ? JSON.stringify(data, null, 2) : '');
      },
      error: (message, error = null) => {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] QUESTIONS-ERROR: ${message}`, error || '');
      }
    };

    try {
      // Get the question pool for this battle
      const questions = await this.getBattleQuestionPool(battleId);
      
      if (!questions || questions.length === 0) {
        throw new Error('No questions in battle pool');
      }

      // Select a random question from the pool
      const randomIndex = Math.floor(Math.random() * questions.length);
      const selectedQuestion = questions[randomIndex];

      // Update the battle with the current question
      const { data, error } = await supabase
        .from('battles')
        .update({ current_question_id: selectedQuestion.id })
        .eq('id', battleId)
        .select();

      if (error) {
        dbLog.error('Error setting battle question', error);
        throw error;
      }

      dbLog.info('Selected battle question', { 
        battleId, 
        questionId: selectedQuestion.id,
        questionTitle: selectedQuestion.title 
      });
      
      return selectedQuestion;
    } catch (error) {
      dbLog.error('Failed to select battle question', error);
      throw error;
    }
  }

  // Get current battle question
  static async getCurrentBattleQuestion(battleId) {
    const dbLog = {
      info: (message, data = null) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] QUESTIONS-INFO: ${message}`, data ? JSON.stringify(data, null, 2) : '');
      },
      error: (message, error = null) => {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] QUESTIONS-ERROR: ${message}`, error || '');
      }
    };

    try {
      const { data, error } = await supabase
        .from('battles')
        .select(`
          current_question_id,
          questions (*)
        `)
        .eq('id', battleId)
        .single();

      if (error) {
        dbLog.error('Error getting current battle question', error);
        throw error;
      }

      const question = data.questions;
      dbLog.info('Retrieved current battle question', { 
        battleId, 
        questionId: question?.id,
        questionTitle: question?.title 
      });
      
      return question;
    } catch (error) {
      dbLog.error('Failed to get current battle question', error);
      throw error;
    }
  }

  // Get question by ID
  static async getQuestionById(questionId) {
    const dbLog = {
      info: (message, data = null) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] QUESTIONS-INFO: ${message}`, data ? JSON.stringify(data, null, 2) : '');
      },
      error: (message, error = null) => {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] QUESTIONS-ERROR: ${message}`, error || '');
      }
    };

    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single();

      if (error) {
        dbLog.error('Error getting question by ID', error);
        throw error;
      }

      dbLog.info('Retrieved question by ID', { questionId, title: data.title });
      return data;
    } catch (error) {
      dbLog.error('Failed to get question by ID', error);
      throw error;
    }
  }
}