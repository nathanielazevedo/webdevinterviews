import React, { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "@mui/material";
import { Box } from "@mui/material";

interface MonacoCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
}

const MonacoCodeEditor: React.FC<MonacoCodeEditorProps> = ({
  value,
  onChange,
  language = "javascript",
  placeholder = "Write your solution here...",
}) => {
  const theme = useTheme();
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || "");
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  // Handle container resize
  useEffect(() => {
    if (!containerRef.current || !editorRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      // Trigger Monaco's layout recalculation
      if (editorRef.current) {
        setTimeout(() => {
          editorRef.current.layout();
        }, 0);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Also trigger layout on theme changes
  useEffect(() => {
    if (editorRef.current) {
      setTimeout(() => {
        editorRef.current.layout();
      }, 100);
    }
  }, [theme.palette.mode]);

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: "on" as const,
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: "on" as const,
    folding: false,
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 3,
    renderLineHighlight: "line" as const,
    scrollbar: {
      vertical: "visible" as const,
      horizontal: "visible" as const,
      verticalScrollbarSize: 12,
      horizontalScrollbarSize: 12,
    },
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true,
    },
    parameterHints: {
      enabled: true,
    },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: "on" as const,
    tabCompletion: "on" as const,
    bracketPairColorization: {
      enabled: true,
    },
  };

  return (
    <Box ref={containerRef} sx={{ height: "100%", width: "100%" }}>
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={theme.palette.mode === "dark" ? "vs-dark" : "light"}
        options={editorOptions}
        loading={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: theme.palette.text.secondary,
            }}
          >
            Loading editor...
          </Box>
        }
      />

      {/* Show placeholder when editor is empty */}
      {!value && (
        <Box
          sx={{
            position: "absolute",
            top: "22px", // Adjust for line numbers
            left: "50px", // Adjust for line numbers width
            color: theme.palette.text.disabled,
            fontSize: "14px",
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          {placeholder}
        </Box>
      )}
    </Box>
  );
};

export default MonacoCodeEditor;
