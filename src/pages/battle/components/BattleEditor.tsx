import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  useTheme,
} from "@mui/material";
import { PlayArrow, Send, Code, BugReport } from "@mui/icons-material";
import { motion } from "framer-motion";

interface BattleEditorProps {
  isActive: boolean;
  problemTitle: string;
  onSubmit: (code: string) => void;
  onTest: (code: string) => void;
}

interface TestResult {
  passed: boolean;
  message: string;
  testCases: {
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
  }[];
}

const BattleEditor: React.FC<BattleEditorProps> = ({
  isActive,
  problemTitle,
  onSubmit,
  onTest,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [code, setCode] = useState(`function twoSum(nums, target) {
    // Write your solution here
    
}`);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const problemDescription = `
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]
  `;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleTestCode = () => {
    // Mock test execution
    const mockResult: TestResult = {
      passed: Math.random() > 0.5,
      message: Math.random() > 0.5 ? "All tests passed!" : "Some tests failed",
      testCases: [
        {
          input: "nums = [2,7,11,15], target = 9",
          expected: "[0,1]",
          actual: "[0,1]",
          passed: true,
        },
        {
          input: "nums = [3,2,4], target = 6",
          expected: "[1,2]",
          actual: "[1,2]",
          passed: true,
        },
        {
          input: "nums = [3,3], target = 6",
          expected: "[0,1]",
          actual: "[0,1]",
          passed: Math.random() > 0.3,
        },
      ],
    };
    setTestResult(mockResult);
    onTest(code);
  };

  const handleSubmitSolution = () => {
    onSubmit(code);
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={3} sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Problem" icon={<BugReport />} />
            <Tab label="Code Editor" icon={<Code />} />
            <Tab label="Test Results" icon={<PlayArrow />} />
          </Tabs>
        </Box>

        {/* Problem Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              {problemTitle}
            </Typography>
            <Typography
              variant="body1"
              component="pre"
              sx={{
                fontFamily: "monospace",
                fontSize: "0.875rem",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                color: theme.palette.text.primary,
              }}
            >
              {problemDescription}
            </Typography>
          </Box>
        )}

        {/* Code Editor Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              JavaScript Solution
            </Typography>
            <TextField
              multiline
              fullWidth
              rows={20}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  fontSize: "14px",
                  lineHeight: 1.5,
                },
                "& .MuiOutlinedInput-root": {
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#1e1e1e" : "#f8f9fa",
                },
              }}
              placeholder="Write your solution here..."
            />

            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<PlayArrow />}
                onClick={handleTestCode}
                color="primary"
              >
                Run Tests
              </Button>
              <Button
                variant="contained"
                startIcon={<Send />}
                onClick={handleSubmitSolution}
                color="success"
              >
                Submit Solution
              </Button>
            </Box>
          </Box>
        )}

        {/* Test Results Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Test Results
            </Typography>

            {testResult ? (
              <Box>
                <Alert
                  severity={testResult.passed ? "success" : "error"}
                  sx={{ mb: 2 }}
                >
                  {testResult.message}
                </Alert>

                {testResult.testCases.map((testCase, index) => (
                  <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Test Case {index + 1}
                      </Typography>
                      <Box
                        sx={{
                          ml: "auto",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor: testCase.passed
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                          color: "white",
                          fontSize: "0.75rem",
                        }}
                      >
                        {testCase.passed ? "PASSED" : "FAILED"}
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Input: {testCase.input}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Expected: {testCase.expected}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Actual: {testCase.actual}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">
                Run tests to see results here
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </motion.div>
  );
};

export default BattleEditor;
