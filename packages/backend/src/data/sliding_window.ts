import type { Question } from '@webdevinterviews/shared';

// Sliding Window questions from LeetCode 75
export const SLIDING_WINDOW_QUESTIONS: Omit<Question, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    title: "Maximum Average Subarray I",
    slug: "maximum-average-subarray-i",
    difficulty: "Easy",
    leetcode_number: 643,
    problem_statement: `You are given an integer array nums consisting of n elements, and an integer k.

Find a contiguous subarray whose length is equal to k that has the maximum average value and return this value. Any answer with a calculation error less than 10^-5 will be accepted.`,
    function_signature: `function findMaxAverage(nums, k) {
    // Your code here
}`,
    test_cases: [
      { input: { nums: [1, 12, -5, -6, 50, 3], k: 4 }, expected: 12.75 },
      { input: { nums: [5], k: 1 }, expected: 5.0 },
      { input: { nums: [0, 1, 1, 3, 3], k: 4 }, expected: 2.0 }
    ],
    examples: [
      {
        input: "nums = [1,12,-5,-6,50,3], k = 4",
        output: "12.75000",
        explanation: "Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75"
      }
    ],
    constraints: "n == nums.length\n1 <= k <= n <= 10^5\n-10^4 <= nums[i] <= 10^4",
    tags: ["Array", "Sliding Window"],
    hints: ["Use sliding window technique to maintain a window of size k", "Calculate the sum of the first k elements, then slide the window by removing the leftmost element and adding the new rightmost element"]
  },
  {
    title: "Maximum Number of Vowels in a Substring of Given Length",
    slug: "maximum-number-of-vowels-in-a-substring-of-given-length",
    difficulty: "Medium",
    leetcode_number: 1456,
    problem_statement: `Given a string s and an integer k, return the maximum number of vowel letters in any substring of s with length k.

Vowel letters in English are 'a', 'e', 'i', 'o', and 'u'.`,
    function_signature: `function maxVowels(s, k) {
    // Your code here
}`,
    test_cases: [
      { input: { s: "abciiidef", k: 3 }, expected: 3 },
      { input: { s: "aeiou", k: 2 }, expected: 2 },
      { input: { s: "leetcode", k: 3 }, expected: 2 }
    ],
    examples: [
      {
        input: 's = "abciiidef", k = 3',
        output: "3",
        explanation: 'The substring "iii" contains 3 vowel letters.'
      },
      {
        input: 's = "aeiou", k = 2',
        output: "2",
        explanation: 'Any substring of length 2 contains 2 vowels.'
      },
      {
        input: 's = "leetcode", k = 3',
        output: "2",
        explanation: 'The substrings "lee", "eet" and "ode" contain 2 vowels.'
      }
    ],
    constraints: "1 <= s.length <= 10^5\ns consists of lowercase English letters.\n1 <= k <= s.length",
    tags: ["String", "Sliding Window"],
    hints: ["Use sliding window technique to maintain a window of size k", "Count vowels in the first k characters, then slide the window by removing the leftmost character and adding the new rightmost character", "Keep track of the maximum vowel count seen so far"]
  },
  {
    title: "Max Consecutive Ones III",
    slug: "max-consecutive-ones-iii",
    difficulty: "Medium",
    leetcode_number: 1004,
    problem_statement: `Given a binary array nums and an integer k, return the maximum number of consecutive 1's in the array if you can flip at most k 0's.`,
    function_signature: `function longestOnes(nums, k) {
    // Your code here
}`,
    test_cases: [
      { input: { nums: [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], k: 2 }, expected: 6 },
      { input: { nums: [0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], k: 3 }, expected: 10 },
      { input: { nums: [1, 1, 1, 1], k: 0 }, expected: 4 }
    ],
    examples: [
      {
        input: "nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2",
        output: "6",
        explanation: "[1,1,1,0,0,1,1,1,1,1,1]\nBolded numbers were flipped from 0 to 1. The longest subarray is underlined."
      },
      {
        input: "nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3",
        output: "10",
        explanation: "[0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1]\nBolded numbers were flipped from 0 to 1. The longest subarray is underlined."
      }
    ],
    constraints: "1 <= nums.length <= 10^5\nnums[i] is either 0 or 1.\n0 <= k <= nums.length",
    tags: ["Array", "Binary Search", "Sliding Window", "Prefix Sum"],
    hints: ["Use sliding window with two pointers", "Expand the window by moving the right pointer and count zeros", "When zeros exceed k, shrink the window from the left", "Keep track of the maximum window size"]
  },
  {
    title: "Longest Subarray of 1's After Deleting One Element",
    slug: "longest-subarray-of-1s-after-deleting-one-element",
    difficulty: "Medium",
    leetcode_number: 1493,
    problem_statement: `Given a binary array nums, you should delete one element from it.

Return the size of the longest non-empty subarray containing only 1's in the resulting array. Return 0 if there is no such subarray.`,
    function_signature: `function longestSubarray(nums) {
    // Your code here
}`,
    test_cases: [
      { input: { nums: [1, 1, 0, 1] }, expected: 3 },
      { input: { nums: [0, 1, 1, 1, 0, 1, 1, 0, 1] }, expected: 5 },
      { input: { nums: [1, 1, 1] }, expected: 2 }
    ],
    examples: [
      {
        input: "nums = [1,1,0,1]",
        output: "3",
        explanation: "After deleting the number in position 2, [1,1,1] contains 3 numbers with value of 1's."
      },
      {
        input: "nums = [0,1,1,1,0,1,1,0,1]",
        output: "5",
        explanation: "After deleting the number in position 4, [0,1,1,1,1,1,0,1] longest subarray with value of 1's is [1,1,1,1,1]."
      },
      {
        input: "nums = [1,1,1]",
        output: "2",
        explanation: "You must delete one element."
      }
    ],
    constraints: "1 <= nums.length <= 10^5\nnums[i] is either 0 or 1.",
    tags: ["Array", "Dynamic Programming", "Sliding Window"],
    hints: ["Use sliding window technique where you can have at most one 0 in the window", "The window represents the subarray after deleting one element", "When you have more than one 0, shrink the window from the left", "The answer is the maximum window size minus 1 (since we must delete one element)"]
  }
];