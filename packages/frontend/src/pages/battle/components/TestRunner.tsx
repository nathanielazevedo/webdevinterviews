import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Stack,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from "@mui/material";
import {
  PlayArrow,
  CheckCircle,
  Error as ErrorIcon,
} from "@mui/icons-material";
import CodeRunner, { TEST_CASES } from "../utils/CodeRunner";
import { useBattleContext } from "../../../contexts/BattleContext";

interface TestRunnerProps {
  code: string;
  problemId: string;
  onTestComplete?: (results: TestResult) => void;
  battleId?: string;
  playerId?: string;
  testCases?: Array<{
    input?: { [key: string]: unknown };
    expected?: unknown;
  }>;
}

interface TestCase {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  description: string;
  executionTime?: number;
  error?: string;
}

interface TestResult {
  passed: boolean;
  message: string;
  testCases: TestCase[];
  totalExecutionTime: number;
}

const TestRunner: React.FC<TestRunnerProps> = ({
  code,
  problemId,
  onTestComplete,
  battleId,
  playerId,
  testCases,
}) => {
  const theme = useTheme();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult | null>(null);

  // Battle context for real-time battle communication (only when in battle mode)
  const battleContext = battleId ? useBattleContext() : null;
  const { isConnected, handleTestResults: sendTestResults } = battleContext || {
    isConnected: false,
    handleTestResults: undefined,
  };

  // Connect to WebSocket when component mounts with battleId
  useEffect(() => {
    if (battleId && playerId) {
      // TestRunner connected to battle
    }
  }, [battleId, playerId, isConnected]);

  const runTests = useCallback(async () => {
    if (!code.trim()) {
      const errorResult = {
        passed: false,
        message: "No code provided",
        testCases: [],
        totalExecutionTime: 0,
      };
      setResults(errorResult);
      return;
    }

    setIsRunning(true);
    setResults(null);

    try {
      const codeRunner = new CodeRunner(5000); // 5 second timeout

      // Use provided test cases or fall back to hardcoded ones
      let testCasesToRun: Array<{
        input: any[];
        expected: any;
        description: string;
      }> = [];

      if (testCases && testCases.length > 0) {
        // Transform question test cases to CodeRunner format
        testCasesToRun = testCases
          .filter((tc) => tc.input && tc.expected !== undefined)
          .map((tc, index) => ({
            input: Object.values(tc.input!) as any[],
            expected: tc.expected as any,
            description: `Test Case ${index + 1}: ${Object.keys(tc.input!).join(
              ", "
            )} = ${Object.values(tc.input!)
              .map((v) => JSON.stringify(v))
              .join(", ")}`,
          }));
      } else {
        // Fall back to hardcoded test cases
        testCasesToRun = TEST_CASES[problemId as keyof typeof TEST_CASES] || [];
      }

      if (testCasesToRun.length === 0) {
        const noTestsResult = {
          passed: false,
          message: "No test cases found for this problem",
          testCases: [],
          totalExecutionTime: 0,
        };
        setResults(noTestsResult);
        return;
      }

      const testResults = await codeRunner.runTests(code, testCasesToRun);
      setResults(testResults);
      onTestComplete?.(testResults);

      // Send test results to opponent via WebSocket
      if (battleId && playerId && sendTestResults) {
        sendTestResults({
          passed: testResults.passed,
          message: testResults.message,
          testCases: testResults.testCases,
          totalExecutionTime: testResults.totalExecutionTime,
        });
      }
    } catch (error) {
      const errorResult = {
        passed: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        testCases: [],
        totalExecutionTime: 0,
      };
      setResults(errorResult);
    } finally {
      setIsRunning(false);
    }
  }, [code, problemId, onTestComplete, battleId, playerId, sendTestResults]);

  const getStatusIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle color="success" />
    ) : (
      <ErrorIcon color="error" />
    );
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Test Cases
          </Typography>
          <IconButton
            onClick={runTests}
            disabled={isRunning}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: "white",
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
              "&:disabled": {
                bgcolor: theme.palette.action.disabled,
              },
            }}
          >
            <PlayArrow />
          </IconButton>
        </Stack>
      </Box>

      {/* Progress Indicator */}
      {isRunning && (
        <Box sx={{ p: 2 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
            Running tests...
          </Typography>
        </Box>
      )}

      {/* Results */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {results && (
          <Stack spacing={2}>
            {/* Detailed Results */}
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Test Case</TableCell>
                    <TableCell>Input</TableCell>
                    <TableCell>Expected</TableCell>
                    <TableCell>Actual</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.testCases.map((testCase, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        bgcolor: testCase.passed
                          ? `${theme.palette.success.main}05`
                          : `${theme.palette.error.main}05`,
                      }}
                    >
                      <TableCell>{getStatusIcon(testCase.passed)}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {testCase.description}
                        </Typography>
                        {testCase.error && (
                          <Alert severity="error" sx={{ mt: 1 }}>
                            {testCase.error}
                          </Alert>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "monospace" }}
                        >
                          {testCase.input}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "monospace" }}
                        >
                          {testCase.expected}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            color: testCase.passed
                              ? "inherit"
                              : theme.palette.error.main,
                          }}
                        >
                          {testCase.actual}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {testCase.executionTime?.toFixed(2)}ms
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* No Results Message */}
            {results.testCases.length === 0 && (
              <Alert severity="info">
                No test cases available for this problem. Add test cases to the
                CodeRunner utility.
              </Alert>
            )}
          </Stack>
        )}

        {/* Initial State */}
        {!results && !isRunning && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              opacity: 0.6,
            }}
          >
            <PlayArrow sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Ready to Test
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Click the play button to run your code against the test cases
              {battleId && (
                <>
                  <br />
                  <br />
                  Your results will be shared with your opponent in real-time
                </>
              )}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TestRunner;
