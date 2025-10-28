const regexQuiz = [
  {
    question: "What does the caret symbol (^) do in a regex?",
    options: [
      "Matches the start of a line",
      "Matches the end of a line",
      "Matches any character",
      "Escapes special characters"
    ],
    correctAnswer: "Matches the start of a line"
  },
  {
    question: "What does the dollar sign ($) do in a regex?",
    options: [
      "Matches the start of a line",
      "Matches the end of a line",
      "Matches a literal dollar sign",
      "Matches whitespace"
    ],
    correctAnswer: "Matches the end of a line"
  },
  {
    question: "What does the dot (.) mean in regex?",
    options: [
      "Matches any character except newline",
      "Matches only digits",
      "Matches whitespace",
      "Matches the literal period character"
    ],
    correctAnswer: "Matches any character except newline"
  },
  {
    question: "What does the plus sign (+) mean in regex?",
    options: [
      "Matches zero or more of the previous token",
      "Matches exactly one occurrence",
      "Matches one or more of the previous token",
      "Matches an optional token"
    ],
    correctAnswer: "Matches one or more of the previous token"
  },
  {
    question: "What do square brackets [] mean in regex?",
    options: [
      "They define a character set",
      "They capture groups of characters",
      "They make a pattern optional",
      "They match a literal bracket"
    ],
    correctAnswer: "They define a character set"
  },
  {
    question: "What does a caret (^) inside square brackets [^ ] mean?",
    options: [
      "It matches the start of the line",
      "It negates the character set",
      "It escapes the next character",
      "It repeats the previous character"
    ],
    correctAnswer: "It negates the character set"
  },
  {
    question: "What do parentheses ( ) do in regex?",
    options: [
      "Define a capturing group",
      "Define a character class",
      "Escape special characters",
      "Represent optional whitespace"
    ],
    correctAnswer: "Define a capturing group"
  },
  {
    question: "What does a non-capturing group look like in regex?",
    options: [
      "(?: ... )",
      "(?!)",
      "[]",
      "{}"
    ],
    correctAnswer: "(?: ... )"
  },
  {
    question: "What does the pipe symbol (|) do in regex?",
    options: [
      "Acts as an OR operator between patterns",
      "Escapes special characters",
      "Represents optional whitespace",
      "Matches a literal vertical bar"
    ],
    correctAnswer: "Acts as an OR operator between patterns"
  },
  {
    question: "What does \\d represent in regex?",
    options: [
      "Matches a digit (0–9)",
      "Matches any character",
      "Matches whitespace",
      "Matches a word character"
    ],
    correctAnswer: "Matches a digit (0–9)"
  }
];

export { regexQuiz };
