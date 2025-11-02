import type { Question } from '@webdevinterviews/shared';

// HashMap/Set questions from LeetCode 75
export const HASHMAP_SET_QUESTIONS: Omit<Question, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    title: "Find the Difference of Two Arrays",
    slug: "find-the-difference-of-two-arrays",
    difficulty: "Easy",
    leetcode_number: 2215,
    problem_statement: `Given two 0-indexed integer arrays nums1 and nums2, return a list answer of size 2 where:

- answer[0] is a list of all distinct integers in nums1 which are not present in nums2.
- answer[1] is a list of all distinct integers in nums2 which are not present in nums1.

Note that the integers in the lists may be returned in any order.`,
    function_signature: `function findDifference(nums1, nums2) {
    // Your code here
}`,
    test_cases: [
      { input: { nums1: [1, 2, 3], nums2: [2, 4, 6] }, expected: [[1, 3], [4, 6]] },
      { input: { nums1: [1, 2, 3, 3], nums2: [1, 1, 2, 2] }, expected: [[3], []] },
      { input: { nums1: [1, 2, 3], nums2: [4, 5, 6] }, expected: [[1, 2, 3], [4, 5, 6]] }
    ],
    examples: [
      {
        input: "nums1 = [1,2,3], nums2 = [2,4,6]",
        output: "[[1,3],[4,6]]",
        explanation: "For nums1, nums1[1] = 2 is present at index 0 of nums2, whereas nums1[0] = 1 and nums1[2] = 3 are not present in nums2. Therefore, answer[0] = [1,3].\nFor nums2, nums2[0] = 2 is present at index 1 of nums1, whereas nums2[1] = 4 and nums2[2] = 6 are not present in nums2. Therefore, answer[1] = [4,6]."
      },
      {
        input: "nums1 = [1,2,3,3], nums2 = [1,1,2,2]",
        output: "[[3],[]]",
        explanation: "For nums1, nums1[2] and nums1[3] are not present in nums2. Since nums1[2] == nums1[3], their value is only included once and answer[0] = [3].\nEvery integer in nums2 is present in nums1. Therefore, answer[1] = []."
      }
    ],
    constraints: "1 <= nums1.length, nums2.length <= 1000\n-1000 <= nums1[i], nums2[i] <= 1000",
    tags: ["Array", "Hash Table"],
    hints: ["Use sets to store unique elements from both arrays", "Find elements in set1 that are not in set2, and vice versa", "Convert sets to arrays for the final result"]
  },
  {
    title: "Unique Number of Occurrences",
    slug: "unique-number-of-occurrences",
    difficulty: "Easy",
    leetcode_number: 1207,
    problem_statement: `Given an array of integers arr, return true if the number of occurrences of each value in the array is unique or false otherwise.`,
    function_signature: `function uniqueOccurrences(arr) {
    // Your code here
}`,
    test_cases: [
      { input: { arr: [1, 2, 2, 1, 1, 3] }, expected: true },
      { input: { arr: [1, 2] }, expected: false },
      { input: { arr: [-3, 0, 1, -3, 1, 1, 1, -3, 10, 0] }, expected: true }
    ],
    examples: [
      {
        input: "arr = [1,2,2,1,1,3]",
        output: "true",
        explanation: "The value 1 has 3 occurrences, 2 has 2 and 3 has 1. No two values have the same number of occurrences."
      },
      {
        input: "arr = [1,2]",
        output: "false",
        explanation: "Both 1 and 2 have 1 occurrence, so the answer is false."
      },
      {
        input: "arr = [-3,0,1,-3,1,1,1,-3,10,0]",
        output: "true",
        explanation: "The value -3 has 3 occurrences, 0 has 2, 1 has 4, and 10 has 1. No two values have the same number of occurrences."
      }
    ],
    constraints: "1 <= arr.length <= 1000\n-1000 <= arr[i] <= 1000",
    tags: ["Array", "Hash Table"],
    hints: ["Count the frequency of each number using a hash map", "Store all frequency counts in a set", "If the size of the frequency set equals the number of unique elements, all frequencies are unique"]
  },
  {
    title: "Determine if Two Strings Are Close",
    slug: "determine-if-two-strings-are-close",
    difficulty: "Medium",
    leetcode_number: 1657,
    problem_statement: `Two strings are considered close if you can attain one from the other using the following operations:

- Operation 1: Swap any two existing characters.
  - For example, abcde -> aecdb
- Operation 2: Transform every occurrence of one existing character into another existing character, and do the same with the other character.
  - For example, aacabb -> bbcbaa (all a's turn into b's, and all b's turn into a's)

You can use the operations on either string as many times as necessary.

Given two strings, word1 and word2, return true if word1 and word2 are close, and false otherwise.`,
    function_signature: `function closeStrings(word1, word2) {
    // Your code here
}`,
    test_cases: [
      { input: { word1: "abc", word2: "bca" }, expected: true },
      { input: { word1: "a", word2: "aa" }, expected: false },
      { input: { word1: "cabbba", word2: "abbccc" }, expected: true }
    ],
    examples: [
      {
        input: 'word1 = "abc", word2 = "bca"',
        output: "true",
        explanation: "You can attain word2 from word1 in 2 operations.\nApply Operation 1: \"abc\" -> \"acb\"\nApply Operation 1: \"acb\" -> \"bca\""
      },
      {
        input: 'word1 = "a", word2 = "aa"',
        output: "false",
        explanation: "It is impossible to attain word2 from word1, or vice versa, in any number of operations."
      },
      {
        input: 'word1 = "cabbba", word2 = "abbccc"',
        output: "true",
        explanation: "You can attain word2 from word1 in 3 operations.\nApply Operation 1: \"cabbba\" -> \"caabbb\"\nApply Operation 2: \"caabbb\" -> \"baaccc\"\nApply Operation 2: \"baaccc\" -> \"abbccc\""
      }
    ],
    constraints: "1 <= word1.length, word2.length <= 10^5\nword1 and word2 contain only lowercase English letters.",
    tags: ["Hash Table", "String", "Sorting"],
    hints: ["Two strings are close if they have the same set of characters", "The frequency counts of characters should be transformable into each other", "Check if both strings have the same character set and the same multiset of frequencies"]
  },
  {
    title: "Equal Row and Column Pairs",
    slug: "equal-row-and-column-pairs",
    difficulty: "Medium",
    leetcode_number: 2352,
    problem_statement: `Given a 0-indexed n x n integer matrix grid, return the number of pairs (ri, cj) such that row ri and column cj are equal.

A row and column pair is considered equal if they contain the same elements in the same order (i.e., an equal array).`,
    function_signature: `function equalPairs(grid) {
    // Your code here
}`,
    test_cases: [
      { input: { grid: [[3, 2, 1], [1, 7, 6], [2, 7, 7]] }, expected: 1 },
      { input: { grid: [[3, 1, 2, 2], [1, 4, 4, 5], [2, 4, 2, 2], [2, 4, 2, 2]] }, expected: 3 },
      { input: { grid: [[1, 2], [3, 4]] }, expected: 0 }
    ],
    examples: [
      {
        input: "grid = [[3,2,1],[1,7,6],[2,7,7]]",
        output: "1",
        explanation: "There is 1 equal row and column pair:\n- (Row 2, Column 1): [2,7,7]"
      },
      {
        input: "grid = [[3,1,2,2],[1,4,4,5],[2,4,2,2],[2,4,2,2]]",
        output: "3",
        explanation: "There are 3 equal row and column pairs:\n- (Row 0, Column 0): [3,1,2,2]\n- (Row 2, Column 2): [2,4,2,2]\n- (Row 3, Column 2): [2,4,2,2]"
      }
    ],
    constraints: "n == grid.length == grid[i].length\n1 <= n <= 200\n1 <= grid[i][j] <= 10^5",
    tags: ["Array", "Hash Table", "Matrix", "Simulation"],
    hints: ["Use a hash map to count the frequency of each row", "For each column, check if it exists as a row in the hash map", "Convert rows and columns to strings or use them as keys for comparison"]
  }
];