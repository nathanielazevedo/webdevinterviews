import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Stack,
  Alert,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Divider,
} from "@mui/material";
import {
  PlayArrow,
  CheckCircle,
  Error as ErrorIcon,
  ExpandMore,
  ExpandLess,
  Timer,
  Person,
  PersonOutline,
} from "@mui/icons-material";
import CodeRunner, { TEST_CASES } from "../utils/CodeRunner";
import { useWebSocket } from "./Websocket";

interface TestRunnerProps {
  code: string;
  problemId: string;
  onTestComplete?: (results: TestResult) => void;
  battleId?: string;
  playerId?: string;
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

interface OpponentResults {
  passed: number;
  total: number;
}

const TestRunner: React.FC<TestRunnerProps> = ({
  code,
  problemId,
  onTestComplete,
  battleId,
  playerId,
}) => {
  const theme = useTheme();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // WebSocket integration for real-time battle communication
  const { isConnected, opponentResults, sendTestResults } = useWebSocket(
    "wss://portfoliobackend-production-5f6f.up.railway.app", // WebSocket server URL
    battleId || "", // roomId
    playerId || "" // userId
  );

  // Connect to WebSocket when component mounts with battleId
  useEffect(() => {
    if (battleId && playerId) {
      console.log("TestRunner: Connecting to battle", {
        battleId,
        playerId,
        isConnected,
      });
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
      const testCases = TEST_CASES[problemId as keyof typeof TEST_CASES] || [];

      if (testCases.length === 0) {
        const noTestsResult = {
          passed: false,
          message: "No test cases found for this problem",
          testCases: [],
          totalExecutionTime: 0,
        };
        setResults(noTestsResult);
        return;
      }

      const testResults = await codeRunner.runTests(code, testCases);
      setResults(testResults);
      onTestComplete?.(testResults);

      // Send test results to opponent via WebSocket
      if (battleId && playerId && sendTestResults) {
        const passedTests = testResults.testCases.filter(
          (tc) => tc.passed
        ).length;
        sendTestResults(passedTests, testResults.testCases.length);
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

  const getStatusColor = (passed: boolean) => {
    return passed ? theme.palette.success.main : theme.palette.error.main;
  };

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
            {/* Summary Card */}
            <Card
              sx={{
                border: `2px solid ${getStatusColor(results.passed)}`,
                bgcolor: results.passed
                  ? `${theme.palette.success.main}10`
                  : `${theme.palette.error.main}10`,
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  {getStatusIcon(results.passed)}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {results.message}
                    </Typography>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      sx={{ mt: 1 }}
                    >
                      <Chip
                        size="small"
                        label={`${
                          results.testCases.filter((tc) => tc.passed).length
                        }/${results.testCases.length} passed`}
                        color={results.passed ? "success" : "error"}
                      />
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Timer fontSize="small" />
                        <Typography variant="body2">
                          {results.totalExecutionTime.toFixed(2)}ms
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                  <IconButton onClick={() => setShowDetails(!showDetails)}>
                    {showDetails ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <Collapse in={showDetails}>
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
            </Collapse>

            {/* No Results Message */}
            {results.testCases.length === 0 && (
              <Alert severity="info">
                No test cases available for this problem. Add test cases to the
                CodeRunner utility.
              </Alert>
            )}
          </Stack>
        )}

        {/* Opponent Results Section */}
        {battleId && opponentResults && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }}>
              <Chip
                icon={<PersonOutline />}
                label="Opponent Results"
                variant="outlined"
                size="small"
              />
            </Divider>

            <Card
              sx={{
                border: `2px solid ${getStatusColor(
                  (opponentResults as OpponentResults).passed ===
                    (opponentResults as OpponentResults).total
                )}`,
                bgcolor:
                  (opponentResults as OpponentResults).passed ===
                  (opponentResults as OpponentResults).total
                    ? `${theme.palette.success.main}08`
                    : `${theme.palette.error.main}08`,
                opacity: 0.8,
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  {getStatusIcon(
                    (opponentResults as OpponentResults).passed ===
                      (opponentResults as OpponentResults).total
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Opponent Test Progress
                    </Typography>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      sx={{ mt: 1 }}
                    >
                      <Chip
                        size="small"
                        label={`${
                          (opponentResults as OpponentResults).passed
                        }/${(opponentResults as OpponentResults).total} passed`}
                        color={
                          (opponentResults as OpponentResults).passed ===
                          (opponentResults as OpponentResults).total
                            ? "success"
                            : "error"
                        }
                        variant="outlined"
                      />
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* WebSocket Connection Status */}
        {battleId && (
          <Box sx={{ mt: 2 }}>
            <Chip
              icon={<Person />}
              label={isConnected ? "Connected to Battle" : "Connecting..."}
              color={isConnected ? "success" : "warning"}
              variant="outlined"
              size="small"
            />
          </Box>
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
