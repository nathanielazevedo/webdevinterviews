import type { Question } from '@webdevinterviews/shared';

// Two Pointers questions from LeetCode 75
export const TWO_POINTERS_QUESTIONS: Omit<Question, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    title: "Move Zeroes",
    slug: "move-zeroes",
    difficulty: "Easy",
    leetcode_number: 283,
    problem_statement: `Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements.

Note that you must do this in-place without making a copy of the array.`,
    function_signature: `function moveZeroes(nums) {
    // Your code here
}`,
    test_cases: [
      { input: { nums: [0, 1, 0, 3, 12] }, expected: [1, 3, 12, 0, 0] },
      { input: { nums: [0] }, expected: [0] },
      { input: { nums: [1, 0, 1] }, expected: [1, 1, 0] }
    ],
    examples: [
      {
        input: "nums = [0,1,0,3,12]",
        output: "[1,3,12,0,0]",
        explanation: "After moving all 0's to the end, the array becomes [1,3,12,0,0]."
      }
    ],
    constraints: "1 <= nums.length <= 10^4\n-2^31 <= nums[i] <= 2^31 - 1",
    tags: ["Array", "Two Pointers"],
    hints: ["Use two pointers: one to track the position to place non-zero elements, another to iterate through the array", "Move all non-zero elements to the front, then fill the rest with zeros"]
  },
  {
    title: "Is Subsequence",
    slug: "is-subsequence",
    difficulty: "Easy",
    leetcode_number: 392,
    problem_statement: `Given two strings s and t, return true if s is a subsequence of t, or false otherwise.

A subsequence of a string is a new string that is formed from the original string by deleting some (can be none) of the characters without disturbing the relative positions of the remaining characters. (i.e., "ace" is a subsequence of "abcde" while "aec" is not).`,
    function_signature: `function isSubsequence(s, t) {
    // Your code here
}`,
    test_cases: [
      { input: { s: "abc", t: "ahbgdc" }, expected: true },
      { input: { s: "axc", t: "ahbgdc" }, expected: false },
      { input: { s: "", t: "ahbgdc" }, expected: true }
    ],
    examples: [
      {
        input: 's = "abc", t = "ahbgdc"',
        output: "true",
        explanation: "The characters 'a', 'b', and 'c' appear in t in the same order they appear in s."
      },
      {
        input: 's = "axc", t = "ahbgdc"',
        output: "false",
        explanation: "The character 'x' does not appear in t, so s is not a subsequence of t."
      }
    ],
    constraints: "0 <= s.length <= 100\n0 <= t.length <= 10^4\ns and t consist only of lowercase English letters.",
    tags: ["String", "Two Pointers", "Dynamic Programming"],
    hints: ["Use two pointers to iterate through both strings", "Move the pointer for s only when characters match", "If you reach the end of s, it's a subsequence"]
  },
  {
    title: "Container With Most Water",
    slug: "container-with-most-water",
    difficulty: "Medium",
    leetcode_number: 11,
    problem_statement: `You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

Notice that you may not slant the container.`,
    function_signature: `function maxArea(height) {
    // Your code here
}`,
    test_cases: [
      { input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, expected: 49 },
      { input: { height: [1, 1] }, expected: 1 },
      { input: { height: [4, 3, 2, 1, 4] }, expected: 16 }
    ],
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation: "The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49."
      }
    ],
    constraints: "n == height.length\n2 <= n <= 10^5\n0 <= height[i] <= 10^4",
    tags: ["Array", "Two Pointers", "Greedy"],
    hints: ["Use two pointers starting from both ends", "The area is determined by the shorter line", "Move the pointer with the shorter height inward to potentially find a taller line"]
  },
  {
    title: "Max Number of K-Sum Pairs",
    slug: "max-number-of-k-sum-pairs",
    difficulty: "Medium",
    leetcode_number: 1679,
    problem_statement: `You are given an integer array nums and an integer k.

In one operation, you can pick two numbers from the array whose sum equals k and remove them from the array.

Return the maximum number of operations you can perform on the array.`,
    function_signature: `function maxOperations(nums, k) {
    // Your code here
}`,
    test_cases: [
      { input: { nums: [1, 2, 3, 4], k: 5 }, expected: 2 },
      { input: { nums: [3, 1, 3, 4, 3], k: 6 }, expected: 1 },
      { input: { nums: [2, 2, 2, 3, 1, 1, 4, 1], k: 4 }, expected: 2 }
    ],
    examples: [
      {
        input: "nums = [1,2,3,4], k = 5",
        output: "2",
        explanation: "Starting with nums = [1,2,3,4]:\n- Remove numbers 1 and 4, then nums = [2,3]\n- Remove numbers 2 and 3, then nums = []\nThere are no more pairs that sum up to 5, hence a total of 2 operations."
      },
      {
        input: "nums = [3,1,3,4,3], k = 6",
        output: "1",
        explanation: "Starting with nums = [3,1,3,4,3]:\n- Remove the first two 3's since 3 + 3 = 6, then nums = [1,4,3]\nThere are no more pairs that sum up to 6, hence a total of 1 operation."
      }
    ],
    constraints: "1 <= nums.length <= 10^5\n1 <= nums[i] <= 10^9\n1 <= k <= 10^9",
    tags: ["Array", "Hash Table", "Two Pointers", "Sorting", "Greedy"],
    hints: ["Sort the array and use two pointers", "Use a hash map to count frequencies", "For each number, look for k - num in the remaining elements"]
  }
];