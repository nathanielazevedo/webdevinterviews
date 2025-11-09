import express from "express";

const router = express.Router();

// Ensure fetch is available (Node 18+)
declare const fetch: typeof globalThis.fetch;

const PISTON_API_URL = "https://emkc.org/api/v2/piston";

/**
 * Execute code using Piston API
 * POST /api/drills/execute
 */
router.post("/execute", async (req, res) => {
  try {
    const { language, code, expectedOutput } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        success: false,
        error: "Language and code are required",
      });
    }

    // Execute code using Piston API
    const response = await fetch(`${PISTON_API_URL}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language,
        version: "*", // Use latest version
        files: [
          {
            name: "main",
            content: code,
          },
        ],
        stdin: "",
        args: [],
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      }),
    });

    const result = (await response.json()) as {
      run?: { stdout?: string; stderr?: string; output?: string; code: number };
    };

    // Check if execution was successful
    if (result.run && result.run.code !== 0) {
      return res.json({
        success: false,
        error: result.run.stderr || result.run.output || "Execution failed",
        output: result.run.stdout || "",
      });
    }

    const output = (result.run?.stdout || "").trim();
    const stderr = (result.run?.stderr || "").trim();

    // If there's stderr, it might be a runtime error
    if (stderr) {
      return res.json({
        success: false,
        error: stderr,
        output,
      });
    }

    // Check if output matches expected (if provided)
    let isCorrect = true;
    if (expectedOutput !== undefined && expectedOutput !== null) {
      isCorrect = output === String(expectedOutput).trim();
    }

    return res.json({
      success: true,
      output,
      isCorrect,
      expectedOutput,
    });
  } catch (error) {
    console.error("Error executing code:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to execute code",
    });
  }
});

/**
 * Get available languages from Piston
 * GET /api/drills/languages
 */
router.get("/languages", async (req, res) => {
  try {
    const response = await fetch(`${PISTON_API_URL}/runtimes`);
    const runtimes = await response.json();

    return res.json({
      success: true,
      languages: runtimes,
    });
  } catch (error) {
    console.error("Error fetching languages:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch available languages",
    });
  }
});

export default router;
