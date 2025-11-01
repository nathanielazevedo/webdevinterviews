type TestInput = string | number | boolean | null | undefined | TestInput[] | { [key: string]: TestInput };

interface TestCase {
  input: TestInput[];
  expected: TestInput;
  description: string;
}

interface TestResult {
  passed: boolean;
  testsPassed: number;
  message: string;
  testCases: {
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    description: string;
    executionTime?: number;
    error?: string;
  }[];
  totalExecutionTime: number;
}

class CodeRunner {
  private timeout: number;

  constructor(timeout: number = 5000) {
    this.timeout = timeout;
  }

async runTests(code: string, testCases: TestCase[]): Promise<TestResult> {
  const startTime = performance.now();
  const results: TestResult['testCases'] = [];
  let totalPassed = 0;

  for (const testCase of testCases) {
    const testStartTime = performance.now();
    try {
      // ✅ Clone the input AGAIN here, because testCase.input is being reused
      const clonedInput = JSON.parse(JSON.stringify(testCase.input));
      
      const result = await this.executeCode(code, clonedInput);
      const testEndTime = performance.now();
      const executionTime = testEndTime - testStartTime;

      const passed = this.deepEqual(result, testCase.expected);
      if (passed) totalPassed++;

      results.push({
        input: this.formatInput(testCase.input), // Use original for display
        expected: this.formatValue(testCase.expected),
        actual: this.formatValue(result),
        passed,
        description: testCase.description,
        executionTime,
      });
    } catch (error) {
      const testEndTime = performance.now();
      const executionTime = testEndTime - testStartTime;

      results.push({
        input: this.formatInput(testCase.input),
        expected: this.formatValue(testCase.expected),
        actual: 'Error',
        passed: false,
        description: testCase.description,
        executionTime,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const totalExecutionTime = performance.now() - startTime;

  return {
    passed: totalPassed === testCases.length,
    testsPassed: totalPassed,
    message: `${totalPassed}/${testCases.length} tests passed`,
    testCases: results,
    totalExecutionTime,
  };
}

private async executeCode(code: string, inputs: TestInput[]): Promise<TestInput> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Execution timeout (${this.timeout}ms)`));
    }, this.timeout);

    try {
      const clonedInputs = JSON.parse(JSON.stringify(inputs));
      
      // ✅ Extract function name first
      const funcNameMatch = code.match(/function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/);
      if (!funcNameMatch) {
        throw new Error('No function declaration found');
      }
      
      const funcName = funcNameMatch[1];
      
      // ✅ Wrap code to return the function
      const wrappedCode = `
        ${code}
        return ${funcName};
      `;
      
      const func = new Function(wrappedCode)();
      
      if (typeof func !== 'function') {
        throw new Error(`${funcName} is not a function`);
      }

      const result = func(...clonedInputs);
      
      clearTimeout(timer);
      resolve(result);
    } catch (error) {
      clearTimeout(timer);
      reject(error);
    }
  });
}

  private deepEqual(a: TestInput, b: TestInput): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!this.deepEqual(a[i], b[i])) return false;
      }
      return true;
    }
    if (typeof a === 'object' && typeof b === 'object') {
      const keysA = Object.keys(a as Record<string, TestInput>);
      const keysB = Object.keys(b as Record<string, TestInput>);
      if (keysA.length !== keysB.length) return false;
      for (const key of keysA) {
        if (!keysB.includes(key) || !this.deepEqual((a as Record<string, TestInput>)[key], (b as Record<string, TestInput>)[key])) return false;
      }
      return true;
    }
    return false;
  }

  private formatInput(inputs: TestInput[]): string {
    return inputs.map(input => this.formatValue(input)).join(', ');
  }

  private formatValue(value: TestInput): string {
    if (Array.isArray(value)) {
      return `[${value.map(v => this.formatValue(v)).join(', ')}]`;
    }
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    return String(value);
  }
}

// Predefined test cases for common problems
export const TEST_CASES = {
  twoSum: [
    {
      input: [[2, 7, 11, 15], 9],
      expected: [0, 1],
      description: 'Basic case: [2,7,11,15], target 9'
    },
    {
      input: [[3, 2, 4], 6],
      expected: [1, 2],
      description: 'Different indices: [3,2,4], target 6'
    },
    {
      input: [[3, 3], 6],
      expected: [0, 1],
      description: 'Duplicate numbers: [3,3], target 6'
    },
    {
      input: [[-1, -2, -3, -4, -5], -8],
      expected: [2, 4],
      description: 'Negative numbers: [-1,-2,-3,-4,-5], target -8'
    }
  ],
  reverseString: [
    {
      input: [['h', 'e', 'l', 'l', 'o']],
      expected: ['o', 'l', 'l', 'e', 'h'],
      description: 'Basic string reversal'
    },
    {
      input: [['H', 'a', 'n', 'n', 'a', 'h']],
      expected: ['h', 'a', 'n', 'n', 'a', 'H'],
      description: 'Palindrome-like string'
    }
  ],
  isPalindrome: [
    {
      input: [121],
      expected: true,
      description: 'Positive palindrome'
    },
    {
      input: [-121],
      expected: false,
      description: 'Negative number'
    },
    {
      input: [10],
      expected: false,
      description: 'Non-palindrome'
    }
  ]
};

export default CodeRunner;