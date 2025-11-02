import type { Question } from '@webdevinterviews/shared';

// Array and String questions from LeetCode 75
export const ARRAYS_STRINGS_QUESTIONS: Omit<Question, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    title: "Merge Strings Alternately",
    slug: "merge-strings-alternately",
    difficulty: "Easy",
    leetcode_number: 1768,
    problem_statement: `You are given two strings word1 and word2. Merge the strings by adding letters in alternating order, starting with word1. If a string is longer than the other, append the additional letters onto the end of the merged string.

Return the merged string.`,
    function_signature: `function mergeAlternately(word1, word2) {
    // Your code here
}`,
    test_cases: [
      { input: { word1: "abc", word2: "pqr" }, expected: "apbqcr" },
      { input: { word1: "ab", word2: "pqrs" }, expected: "apbqrs" },
      { input: { word1: "abcd", word2: "pq" }, expected: "apbqcd" }
    ],
    examples: [
      {
        input: 'word1 = "abc", word2 = "pqr"',
        output: '"apbqcr"',
        explanation: "The merged string will be merged as so:\nword1:  a   b   c\nword2:    p   q   r\nmerged: a p b q c r"
      },
      {
        input: 'word1 = "ab", word2 = "pqrs"',
        output: '"apbqrs"',
        explanation: "Notice that as word1 is shorter, \"rs\" is appended to the end.\nword1:  a   b \nword2:    p   q   r   s\nmerged: a p b q r s"
      }
    ],
    constraints: "1 <= word1.length, word2.length <= 100\nword1 and word2 consist of lowercase English letters.",
    tags: ["String", "Two Pointers"],
    hints: ["Use two pointers to iterate through both strings simultaneously", "Append remaining characters from the longer string at the end"]
  },
  {
    title: "Greatest Common Divisor of Strings",
    slug: "greatest-common-divisor-of-strings",
    difficulty: "Easy",
    leetcode_number: 1071,
    problem_statement: `For two strings s and t, we say "t divides s" if and only if s = t + ... + t (i.e., t is concatenated with itself one or more times).

Given two strings str1 and str2, return the largest string x such that x divides both str1 and str2.`,
    function_signature: `function gcdOfStrings(str1, str2) {
    // Your code here
}`,
    test_cases: [
      { input: { str1: "ABCABC", str2: "ABC" }, expected: "ABC" },
      { input: { str1: "ABABAB", str2: "ABAB" }, expected: "AB" },
      { input: { str1: "LEET", str2: "CODE" }, expected: "" }
    ],
    examples: [
      {
        input: 'str1 = "ABCABC", str2 = "ABC"',
        output: '"ABC"',
        explanation: "ABC can be repeated 2 times in str1 and 1 time in str2."
      },
      {
        input: 'str1 = "ABABAB", str2 = "ABAB"',
        output: '"AB"',
        explanation: "AB can be repeated 3 times in str1 and 2 times in str2."
      },
      {
        input: 'str1 = "LEET", str2 = "CODE"',
        output: '""',
        explanation: "There is no string that can be repeated to form both str1 and str2."
      }
    ],
    constraints: "1 <= str1.length, str2.length <= 1000\nstr1 and str2 consist of uppercase English letters.",
    tags: ["String", "Math"],
    hints: ["The GCD string must be a prefix of both strings", "Check if str1 + str2 equals str2 + str1"]
  },
  {
    title: "Kids With the Greatest Number of Candies",
    slug: "kids-with-the-greatest-number-of-candies",
    difficulty: "Easy",
    leetcode_number: 1431,
    problem_statement: `There are n kids with candies. You are given an integer array candies, where each candies[i] represents the number of candies the ith kid has, and an integer extraCandies, denoting the number of extra candies that you have.

Return a boolean array result of length n, where result[i] is true if, after giving the ith kid all the extraCandies, they will have the greatest number of candies among all the kids, or false otherwise.

Note that multiple kids can have the greatest number of candies.`,
    function_signature: `function kidsWithCandies(candies, extraCandies) {
    // Your code here
}`,
    test_cases: [
      { input: { candies: [2, 3, 5, 1, 3], extraCandies: 3 }, expected: [true, true, true, false, true] },
      { input: { candies: [4, 2, 1, 1, 2], extraCandies: 1 }, expected: [true, false, false, false, false] },
      { input: { candies: [12, 1, 12], extraCandies: 10 }, expected: [true, false, true] }
    ],
    examples: [
      {
        input: "candies = [2,3,5,1,3], extraCandies = 3",
        output: "[true,true,true,false,true]",
        explanation: "If you give all extraCandies to:\n- Kid 0, they will have 2 + 3 = 5 candies, which is the greatest among the kids.\n- Kid 1, they will have 3 + 3 = 6 candies, which is the greatest among the kids.\n- Kid 2, they will have 5 + 3 = 8 candies, which is the greatest among the kids.\n- Kid 3, they will have 1 + 3 = 4 candies, which is not the greatest among the kids.\n- Kid 4, they will have 3 + 3 = 6 candies, which is the greatest among the kids."
      }
    ],
    constraints: "2 <= candies.length <= 100\n1 <= candies[i] <= 100\n1 <= extraCandies <= 50",
    tags: ["Array"],
    hints: ["Find the maximum number of candies any kid currently has", "For each kid, check if candies[i] + extraCandies >= maxCandies"]
  },
  {
    title: "Can Place Flowers",
    slug: "can-place-flowers",
    difficulty: "Easy",
    leetcode_number: 605,
    problem_statement: `You have a long flowerbed in which some of the plots are planted, and some are not. However, flowers cannot be planted in adjacent plots.

Given an integer array flowerbed containing 0's and 1's, where 0 means empty and 1 means not empty, and an integer n, return true if n new flowers can be planted in the flowerbed without violating the no-adjacent-flowers rule and false otherwise.`,
    function_signature: `function canPlaceFlowers(flowerbed, n) {
    // Your code here
}`,
    test_cases: [
      { input: { flowerbed: [1, 0, 0, 0, 1], n: 1 }, expected: true },
      { input: { flowerbed: [1, 0, 0, 0, 1], n: 2 }, expected: false },
      { input: { flowerbed: [0, 0, 1, 0, 0], n: 2 }, expected: true }
    ],
    examples: [
      {
        input: "flowerbed = [1,0,0,0,1], n = 1",
        output: "true",
        explanation: "There are 3 empty plots in the middle, plant one flower there."
      },
      {
        input: "flowerbed = [1,0,0,0,1], n = 2",
        output: "false",
        explanation: "There are only 3 empty plots in the middle, cannot plant 2 flowers."
      }
    ],
    constraints: "1 <= flowerbed.length <= 2 * 10^4\nflowerbed[i] is 0 or 1.\nThere are no two adjacent flowers in flowerbed.\n0 <= n <= flowerbed.length",
    tags: ["Array", "Greedy"],
    hints: ["Iterate through the flowerbed and count consecutive empty plots", "You can plant a flower if there are at least 2 empty plots between existing flowers"]
  },
  {
    title: "Reverse Vowels of a String",
    slug: "reverse-vowels-of-a-string",
    difficulty: "Easy",
    leetcode_number: 345,
    problem_statement: `Given a string s, reverse only all the vowels in the string and return it.

The vowels are 'a', 'e', 'i', 'o', and 'u', and they can appear in both lower and upper cases, more than once.`,
    function_signature: `function reverseVowels(s) {
    // Your code here
}`,
    test_cases: [
      { input: { s: "hello" }, expected: "holle" },
      { input: { s: "leetcode" }, expected: "leotcede" },
      { input: { s: "aA" }, expected: "Aa" }
    ],
    examples: [
      {
        input: 's = "hello"',
        output: '"holle"',
        explanation: "The vowels are 'e' and 'o', reverse them to get 'holle'."
      },
      {
        input: 's = "leetcode"',
        output: '"leotcede"',
        explanation: "The vowels are 'e', 'e', 'o', reverse them to get 'leotcede'."
      }
    ],
    constraints: "1 <= s.length <= 3 * 10^5\ns consist of printable ASCII characters.",
    tags: ["String", "Two Pointers"],
    hints: ["Use two pointers, one from start and one from end", "Swap vowels when both pointers point to vowels", "Move pointers inward after swapping or when encountering non-vowels"]
  },
  {
    title: "Reverse Words in a String",
    slug: "reverse-words-in-a-string",
    difficulty: "Medium",
    leetcode_number: 151,
    problem_statement: `Given an input string s, reverse the order of the words.

A word is defined as a sequence of non-space characters. The words in s will be separated by at least one space.

Return a string of the words in reverse order concatenated by a single space.

Note that s may contain leading or trailing spaces or multiple spaces between two words. The returned string should only have a single space separating the words. Do not include any extra spaces.`,
    function_signature: `function reverseWords(s) {
    // Your code here
}`,
    test_cases: [
      { input: { s: "the sky is blue" }, expected: "blue is sky the" },
      { input: { s: "  hello world  " }, expected: "world hello" },
      { input: { s: "a good   example" }, expected: "example good a" }
    ],
    examples: [
      {
        input: 's = "the sky is blue"',
        output: '"blue is sky the"',
        explanation: "Reversing the order of words in the string."
      },
      {
        input: 's = "  hello world  "',
        output: '"world hello"',
        explanation: "Removing leading/trailing spaces and reversing the order of words."
      }
    ],
    constraints: "1 <= s.length <= 10^4\ns contains English letters (upper-case and lower-case), digits, and spaces ' '.\nThere is at least one word in s.",
    tags: ["String", "Two Pointers"],
    hints: ["Split the string by spaces, filter out empty strings, then reverse the array", "Use two pointers to reverse words in-place"]
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
      { input: { nums: [-1, 1, 0, -3, 3] }, expected: [0, 0, 9, 0, 0] },
      { input: { nums: [2, 3] }, expected: [3, 2] }
    ],
    examples: [
      {
        input: "nums = [1,2,3,4]",
        output: "[24,12,8,6]",
        explanation: "answer[0] = 2*3*4 = 24, answer[1] = 1*3*4 = 12, answer[2] = 1*2*4 = 8, answer[3] = 1*2*3 = 6"
      },
      {
        input: "nums = [-1,1,0,-3,3]",
        output: "[0,0,9,0,0]",
        explanation: "The product of any prefix or suffix is 0 if there's a 0 in the array."
      }
    ],
    constraints: "2 <= nums.length <= 10^5\n-30 <= nums[i] <= 30\nThe product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.",
    tags: ["Array", "Prefix Sum"],
    hints: ["Calculate prefix products and suffix products separately", "Use two passes: one for prefix products, one for suffix products"]
  },
  {
    title: "Increasing Triplet Subsequence",
    slug: "increasing-triplet-subsequence",
    difficulty: "Medium",
    leetcode_number: 334,
    problem_statement: `Given an integer array nums, return true if there exists a triple of indices (i, j, k) such that i < j < k and nums[i] < nums[j] < nums[k]. If no such indices exists, return false.`,
    function_signature: `function increasingTriplet(nums) {
    // Your code here
}`,
    test_cases: [
      { input: { nums: [1, 2, 3, 4, 5] }, expected: true },
      { input: { nums: [5, 4, 3, 2, 1] }, expected: false },
      { input: { nums: [2, 1, 5, 0, 4, 6] }, expected: true }
    ],
    examples: [
      {
        input: "nums = [1,2,3,4,5]",
        output: "true",
        explanation: "Any triplet where i < j < k is valid."
      },
      {
        input: "nums = [5,4,3,2,1]",
        output: "false",
        explanation: "No triplet exists."
      },
      {
        input: "nums = [2,1,5,0,4,6]",
        output: "true",
        explanation: "The triplet (3, 4, 5) -> nums[3] = 0 < nums[4] = 4 < nums[5] = 6."
      }
    ],
    constraints: "1 <= nums.length <= 5 * 10^5\n-2^31 <= nums[i] <= 2^31 - 1",
    tags: ["Array", "Greedy"],
    hints: ["Keep track of the smallest and second smallest numbers seen so far", "Use two variables to track potential triplet candidates"]
  },
  {
    title: "String Compression",
    slug: "string-compression",
    difficulty: "Medium",
    leetcode_number: 443,
    problem_statement: `Given an array of characters chars, compress it using the following algorithm:

Begin with an empty string s. For each group of consecutive repeating characters in chars:

- If the group's length is 1, append the character to s.
- Otherwise, append the character followed by the group's length.

The compressed string s should not be returned, but instead, you should modify the input array chars in-place and return the new length of the array.

You must write an algorithm that uses only constant extra space.`,
    function_signature: `function compress(chars) {
    // Your code here
}`,
    test_cases: [
      { input: { chars: ["a", "a", "b", "b", "c", "c", "c"] }, expected: 6 },
      { input: { chars: ["a"] }, expected: 1 },
      { input: { chars: ["a", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"] }, expected: 4 }
    ],
    examples: [
      {
        input: 'chars = ["a","a","b","b","c","c","c"]',
        output: "Return 6, and the first 6 characters of the input array should be: [\"a\",\"2\",\"b\",\"2\",\"c\",\"3\"]",
        explanation: "The groups are \"aa\", \"bb\", and \"ccc\". This compresses to \"a2b2c3\"."
      },
      {
        input: 'chars = ["a"]',
        output: "Return 1, and the first 1 character of the input array should be: [\"a\"]",
        explanation: "The only group is \"a\", which remains uncompressed since it's a single character."
      },
      {
        input: 'chars = ["a","b","b","b","b","b","b","b","b","b","b","b","b"]',
        output: "Return 4, and the first 4 characters of the input array should be: [\"a\",\"b\",\"1\",\"2\"]",
        explanation: "The groups are \"a\" and \"bbbbbbbbbbbb\". This compresses to \"ab12\"."
      }
    ],
    constraints: "1 <= chars.length <= 2000\nchars[i] is a lowercase English letter, uppercase English letter, digit, or symbol.",
    tags: ["String", "Two Pointers"],
    hints: ["Use two pointers to track the current group", "Write the character and count directly to the input array", "Keep track of the write position separately from the read position"]
  }
];