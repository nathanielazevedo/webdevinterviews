import type { Question } from '@webdevinterviews/shared';

// Prefix Sum questions from LeetCode 75
export const PREFIX_SUM_QUESTIONS: Omit<Question, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    title: "Find the Highest Altitude",
    slug: "find-the-highest-altitude",
    difficulty: "Easy",
    leetcode_number: 1732,
    problem_statement: `There is a biker going on a road trip. The road trip consists of n + 1 points at different altitudes. The biker starts at point 0 with altitude equal 0.

You are given an integer array gain of length n where gain[i] is the net gain in altitude between point i and point i + 1 for all (0 <= i < n). Return the highest altitude reached.`,
    function_signature: `function largestAltitude(gain) {
    // Your code here
}`,
    test_cases: [
      { input: { gain: [-5, 1, 5, 0, -7] }, expected: 1 },
      { input: { gain: [-4, -3, -2, -1, 4, 3, 2] }, expected: 0 },
      { input: { gain: [5, -2, 3] }, expected: 6 }
    ],
    examples: [
      {
        input: "gain = [-5,1,5,0,-7]",
        output: "1",
        explanation: "The altitudes are [0,-5,-4,1,1,-6]. The highest is 1."
      },
      {
        input: "gain = [-4,-3,-2,-1,4,3,2]",
        output: "0",
        explanation: "The altitudes are [0,-4,-7,-9,-10,-6,-3,-1]. The highest is 0."
      }
    ],
    constraints: "n == gain.length\n1 <= n <= 100\n-100 <= gain[i] <= 100",
    tags: ["Array", "Prefix Sum"],
    hints: ["Start with altitude 0 and keep track of current altitude as you process each gain", "Use prefix sum technique to calculate running altitude", "Keep track of the maximum altitude seen so far"]
  },
  {
    title: "Find Pivot Index",
    slug: "find-pivot-index",
    difficulty: "Easy",
    leetcode_number: 724,
    problem_statement: `Given an array of integers nums, calculate the pivot index of this array.

The pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the right of the index.

If the index is on the left edge of the array, then the left sum is 0 because there are no elements to the left. This also applies to the right edge of the array.

Return the leftmost pivot index. If no such index exists, return -1.`,
    function_signature: `function pivotIndex(nums) {
    // Your code here
}`,
    test_cases: [
      { input: { nums: [1, 7, 3, 6, 5, 6] }, expected: 3 },
      { input: { nums: [1, 2, 3] }, expected: -1 },
      { input: { nums: [2, 1, -1] }, expected: 0 }
    ],
    examples: [
      {
        input: "nums = [1,7,3,6,5,6]",
        output: "3",
        explanation: "The pivot index is 3.\nLeft sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11\nRight sum = nums[4] + nums[5] = 5 + 6 = 11"
      },
      {
        input: "nums = [1,2,3]",
        output: "-1",
        explanation: "There is no index that satisfies the conditions in the problem statement."
      },
      {
        input: "nums = [2,1,-1]",
        output: "0",
        explanation: "The pivot index is 0.\nLeft sum = 0 (no elements to the left of index 0)\nRight sum = nums[1] + nums[2] = 1 + -1 = 0"
      }
    ],
    constraints: "1 <= nums.length <= 10^4\n-1000 <= nums[i] <= 1000",
    tags: ["Array", "Prefix Sum"],
    hints: ["Calculate the total sum first", "For each index, calculate left sum using prefix sum", "Right sum = total sum - left sum - current element", "Return the first index where left sum equals right sum"]
  }
];