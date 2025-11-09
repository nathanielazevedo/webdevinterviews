import { Box, TextField } from "@mui/material";
import { useState } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  language?: string;
  placeholder?: string;
  minHeight?: string;
}

const CodeEditor = ({
  value,
  onChange,
  onSubmit,
  language = "python",
  placeholder = "// Write your code here...",
  minHeight = "200px",
}: CodeEditorProps) => {
  const [focused, setFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Enter without Shift runs the code
    if (e.key === "Enter" && !e.shiftKey && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
    // Shift + Enter adds a new line (default behavior)
  };

  return (
    <Box
      sx={{
        position: "relative",
        border: "1px solid",
        borderColor: focused ? "primary.main" : "divider",
        borderRadius: 1,
        transition: "border-color 0.2s",
        backgroundColor: "#1e1e1e",
        fontFamily: "'Fira Code', 'Monaco', 'Courier New', monospace",
      }}
    >
      <TextField
        multiline
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          style: {
            fontFamily: "'Fira Code', 'Monaco', 'Courier New', monospace",
            fontSize: "14px",
            lineHeight: "1.6",
            color: "#d4d4d4",
            padding: "16px",
          },
        }}
        sx={{
          minHeight,
          "& .MuiInputBase-root": {
            minHeight,
          },
          "& textarea": {
            minHeight: `calc(${minHeight} - 32px) !important`,
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#666",
            opacity: 1,
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 12,
          fontSize: "11px",
          color: "#666",
          textTransform: "uppercase",
          fontWeight: 600,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {language}
      </Box>
    </Box>
  );
};

export default CodeEditor;
