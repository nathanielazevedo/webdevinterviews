import React, { useState, useRef, useCallback } from "react";
import { Box, Paper, Typography, Button, useTheme } from "@mui/material";
import { Send, BugReport } from "@mui/icons-material";
import MonacoCodeEditor from "./MonacoCodeEditor";
import TestRunner from "./TestRunner";

interface ResizableCodingPanelsProps {
  problemTitle: string;
  problemId: string;
  onSubmit: (code: string) => void;
  onTest: (results: any) => void;
  battleId?: string;
  playerId?: string;
}

const ResizableCodingPanels: React.FC<ResizableCodingPanelsProps> = ({
  problemTitle,
  problemId,
  onSubmit,
  onTest,
  battleId,
  playerId,
}) => {
  const theme = useTheme();
  const [code, setCode] = useState(`function twoSum(nums, target) {
    // Write your solution here
    
}`);
  const [leftWidth, setLeftWidth] = useState(40); // Percentage
  const [rightTopHeight, setRightTopHeight] = useState(60); // Percentage

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingVertical = useRef(false);
  const isDraggingHorizontal = useRef(false);

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

Constraints:
• 2 ≤ nums.length ≤ 10⁴
• -10⁹ ≤ nums[i] ≤ 10⁹
• -10⁹ ≤ target ≤ 10⁹
• Only one valid answer exists.
  `;

  const handleSubmitSolution = () => {
    onSubmit(code);
  };

  // Handle vertical resizer (between left and right panels)
  const handleVerticalMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingVertical.current = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingVertical.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Constrain between 20% and 70%
      const constrainedWidth = Math.min(Math.max(newLeftWidth, 20), 70);
      setLeftWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      isDraggingVertical.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  // Handle horizontal resizer (between right top and bottom panels)
  const handleHorizontalMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingHorizontal.current = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingHorizontal.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const rightPanelTop = containerRect.top;
      const rightPanelHeight = containerRect.height;
      const newTopHeight =
        ((e.clientY - rightPanelTop) / rightPanelHeight) * 100;

      // Constrain between 30% and 80%
      const constrainedHeight = Math.min(Math.max(newTopHeight, 30), 80);
      setRightTopHeight(constrainedHeight);
    };

    const handleMouseUp = () => {
      isDraggingHorizontal.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        height: "80vh",
        display: "flex",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Left Panel - Problem Description */}
      <Paper
        elevation={0}
        sx={{
          width: `${leftWidth}%`,
          display: "flex",
          flexDirection: "column",
          borderRadius: 0,
          borderRight: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <BugReport color="primary" />
            <Typography variant="h6" fontWeight="bold">
              {problemTitle}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            p: 3,
            overflow: "auto",
          }}
        >
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
      </Paper>

      {/* Vertical Resizer */}
      <Box
        onMouseDown={handleVerticalMouseDown}
        sx={{
          width: "4px",
          cursor: "col-resize",
          backgroundColor: theme.palette.divider,
          "&:hover": {
            backgroundColor: theme.palette.primary.main,
          },
          transition: "background-color 0.2s",
        }}
      />

      {/* Right Panel Container */}
      <Box
        sx={{
          width: `${100 - leftWidth}%`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Right Top Panel - Code Editor */}
        <Paper
          elevation={0}
          sx={{
            height: `${rightTopHeight}%`,
            display: "flex",
            flexDirection: "column",
            borderRadius: 0,
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.default,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              JavaScript Solution
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                size="small"
                startIcon={<Send />}
                onClick={handleSubmitSolution}
                color="success"
              >
                Submit
              </Button>
            </Box>
          </Box>

          <Box sx={{ flex: 1, p: 2, position: "relative" }}>
            <MonacoCodeEditor
              key={`editor-${leftWidth}-${rightTopHeight}`}
              value={code}
              onChange={setCode}
              language="javascript"
              placeholder="Write your solution here..."
            />
          </Box>
        </Paper>

        {/* Horizontal Resizer */}
        <Box
          onMouseDown={handleHorizontalMouseDown}
          sx={{
            height: "4px",
            cursor: "row-resize",
            backgroundColor: theme.palette.divider,
            "&:hover": {
              backgroundColor: theme.palette.primary.main,
            },
            transition: "background-color 0.2s",
          }}
        />

        {/* Right Bottom Panel - Test Results */}
        <Paper
          elevation={0}
          sx={{
            height: `${100 - rightTopHeight}%`,
            display: "flex",
            flexDirection: "column",
            borderRadius: 0,
            overflow: "hidden",
          }}
        >
          <TestRunner
            code={code}
            problemId={problemId}
            onTestComplete={onTest}
            battleId={battleId}
            playerId={playerId}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default ResizableCodingPanels;
