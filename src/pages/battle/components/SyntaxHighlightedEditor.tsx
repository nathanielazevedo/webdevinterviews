import React, { useRef, useEffect } from "react";
import { Box, useTheme } from "@mui/material";

interface SyntaxHighlightedEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SyntaxHighlightedEditor: React.FC<SyntaxHighlightedEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your solution here...",
}) => {
  const theme = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // JavaScript keywords and tokens for syntax highlighting
  const jsKeywords = [
    "function",
    "return",
    "if",
    "else",
    "for",
    "while",
    "do",
    "break",
    "continue",
    "var",
    "let",
    "const",
    "true",
    "false",
    "null",
    "undefined",
    "this",
    "new",
    "try",
    "catch",
    "finally",
    "throw",
    "typeof",
    "instanceof",
    "in",
    "of",
    "class",
    "extends",
    "constructor",
    "static",
    "async",
    "await",
    "import",
    "export",
  ];

  const syntaxHighlight = (code: string): string => {
    let highlighted = code;

    // Escape HTML
    highlighted = highlighted
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Comments (single line)
    highlighted = highlighted.replace(
      /\/\/.*$/gm,
      `<span style="color: ${
        theme.palette.mode === "dark" ? "#6A9955" : "#008000"
      }; font-style: italic;">$&</span>`
    );

    // Comments (multi line)
    highlighted = highlighted.replace(
      /\/\*[\s\S]*?\*\//g,
      `<span style="color: ${
        theme.palette.mode === "dark" ? "#6A9955" : "#008000"
      }; font-style: italic;">$&</span>`
    );

    // Strings (double quotes)
    highlighted = highlighted.replace(
      /"(?:[^"\\]|\\.)*"/g,
      `<span style="color: ${
        theme.palette.mode === "dark" ? "#CE9178" : "#A31515"
      };">$&</span>`
    );

    // Strings (single quotes)
    highlighted = highlighted.replace(
      /'(?:[^'\\]|\\.)*'/g,
      `<span style="color: ${
        theme.palette.mode === "dark" ? "#CE9178" : "#A31515"
      };">$&</span>`
    );

    // Template literals
    highlighted = highlighted.replace(
      /`(?:[^`\\]|\\.)*`/g,
      `<span style="color: ${
        theme.palette.mode === "dark" ? "#CE9178" : "#A31515"
      };">$&</span>`
    );

    // Numbers
    highlighted = highlighted.replace(
      /\b\d+\.?\d*\b/g,
      `<span style="color: ${
        theme.palette.mode === "dark" ? "#B5CEA8" : "#098658"
      };">$&</span>`
    );

    // Keywords
    jsKeywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "g");
      highlighted = highlighted.replace(
        regex,
        `<span style="color: ${
          theme.palette.mode === "dark" ? "#569CD6" : "#0000FF"
        }; font-weight: bold;">$&</span>`
      );
    });

    // Operators
    highlighted = highlighted.replace(
      /[+\-*/%=!<>&|^~?:]+/g,
      `<span style="color: ${
        theme.palette.mode === "dark" ? "#D4D4D4" : "#000000"
      };">$&</span>`
    );

    // Brackets and parentheses
    highlighted = highlighted.replace(
      /[(){}[\]]/g,
      `<span style="color: ${
        theme.palette.mode === "dark" ? "#FFD700" : "#800080"
      }; font-weight: bold;">$&</span>`
    );

    return highlighted;
  };

  const updateHighlighting = () => {
    if (highlightRef.current) {
      highlightRef.current.innerHTML = syntaxHighlight(value);
    }
  };

  useEffect(() => {
    updateHighlighting();
  }, [value, theme.palette.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab key for indentation
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);

      // Set cursor position after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        width: "100%",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      {/* Syntax highlighting layer */}
      <Box
        ref={highlightRef}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: "12px",
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          fontSize: "14px",
          lineHeight: 1.5,
          color: "transparent",
          backgroundColor: "transparent",
          overflow: "auto",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          pointerEvents: "none",
          zIndex: 1,
          "& span": {
            backgroundColor: "transparent",
          },
        }}
        dangerouslySetInnerHTML={{ __html: syntaxHighlight(value) }}
      />

      {/* Actual textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: "12px",
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          fontSize: "14px",
          lineHeight: 1.5,
          color: "transparent",
          backgroundColor:
            theme.palette.mode === "dark" ? "#1e1e1e" : "#f8f9fa",
          border: "none",
          outline: "none",
          resize: "none",
          overflow: "auto",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          caretColor: theme.palette.text.primary,
          zIndex: 2,
        }}
      />

      {/* Placeholder when empty */}
      {!value && (
        <Box
          sx={{
            position: "absolute",
            top: "12px",
            left: "12px",
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: "14px",
            lineHeight: 1.5,
            color: theme.palette.text.disabled,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {placeholder}
        </Box>
      )}
    </Box>
  );
};

export default SyntaxHighlightedEditor;
