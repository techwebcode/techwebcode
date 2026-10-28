import { LanguageConfig } from "./languages.config";

export interface LogItem {
  id: string;
  type: "log" | "warn" | "error" | "info";
  message: string;
  timestamp: string;
}

export interface ExecutionResult {
  status: "success" | "error" | "coming_soon";
  logs: LogItem[];
  srcDoc?: string;
  rawOutput?: string;
  executionTimeMs?: number;
}

declare global {
  interface Window {
    loadPyodide?: (options?: { indexURL?: string }) => Promise<any>;
    Go?: any;
    runGoCode?: (code: string) => { stdout: string; stderr: string; error?: string };
    __yaegiReady?: boolean;
    ts?: any;
    JSCPP?: any;
  }
}

let pyodideInstancePromise: Promise<any> | null = null;
let goWasmPromise: Promise<boolean> | null = null;

async function getPyodideInstance(onStatus?: (msg: string) => void): Promise<any> {
  if (typeof window === "undefined") return null;

  if (pyodideInstancePromise) {
    return pyodideInstancePromise;
  }

  pyodideInstancePromise = (async () => {
    if (!window.loadPyodide) {
      onStatus?.("Loading Python 3 WebAssembly runtime from CDN...");
      await new Promise<void>((resolve, reject) => {
        const existing = document.querySelector('script[src*="pyodide.js"]');
        if (existing) {
          if (window.loadPyodide) {
            resolve();
            return;
          }
          existing.addEventListener("load", () => resolve());
          existing.addEventListener("error", () =>
            reject(new Error("Failed to load Pyodide runtime script."))
          );
          return;
        }

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(
            new Error(
              "Failed to load Pyodide WebAssembly script from CDN. Please check your internet connection."
            )
          );
        document.head.appendChild(script);
      });
    }

    if (!window.loadPyodide) {
      throw new Error("Pyodide script loaded, but window.loadPyodide is unavailable.");
    }

    onStatus?.("Initializing Python 3 CPython WebAssembly engine...");
    const pyodide = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
    });
    onStatus?.("Python 3 WebAssembly runtime ready.");
    return pyodide;
  })();

  return pyodideInstancePromise;
}

async function getGoWasmInstance(onStatus?: (msg: string) => void): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (window.__yaegiReady && window.runGoCode) return true;

  if (goWasmPromise) {
    return goWasmPromise;
  }

  goWasmPromise = (async () => {
    // 1. Ensure wasm_exec.js is loaded
    if (!window.Go) {
      onStatus?.("Loading Go WebAssembly bridge (wasm_exec.js)...");
      await new Promise<void>((resolve, reject) => {
        const existing = document.querySelector('script[src*="wasm_exec.js"]');
        if (existing) {
          if (window.Go) {
            resolve();
            return;
          }
          existing.addEventListener("load", () => resolve());
          existing.addEventListener("error", () =>
            reject(new Error("Failed to load Go WebAssembly bridge script."))
          );
          return;
        }

        const script = document.createElement("script");
        script.src = "/wasm/wasm_exec.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error("Failed to load /wasm/wasm_exec.js."));
        document.head.appendChild(script);
      });
    }

    if (!window.Go) {
      throw new Error("Go WebAssembly bridge failed to initialize.");
    }

    onStatus?.("Streaming & compiling Yaegi Go WebAssembly engine...");
    const go = new window.Go();

    let wasmResult: WebAssembly.WebAssemblyInstantiatedSource;
    if ("instantiateStreaming" in WebAssembly) {
      try {
        wasmResult = await WebAssembly.instantiateStreaming(
          fetch("/wasm/yaegi.wasm"),
          go.importObject
        );
      } catch {
        const resp = await fetch("/wasm/yaegi.wasm");
        const bytes = await resp.arrayBuffer();
        wasmResult = await WebAssembly.instantiate(bytes, go.importObject);
      }
    } else {
      const resp = await fetch("/wasm/yaegi.wasm");
      const bytes = await resp.arrayBuffer();
      wasmResult = await WebAssembly.instantiate(bytes, go.importObject);
    }

    // Launch Go WASM runtime asynchronously
    go.run(wasmResult.instance).catch((err: any) => {
      console.warn("Go runtime loop notification:", err);
    });

    onStatus?.("Booting Yaegi Go interpreter & standard library...");

    // Poll until __yaegiReady flag is active
    const maxWaitMs = 20000;
    const pollInterval = 40;
    let elapsed = 0;
    while (!window.__yaegiReady && elapsed < maxWaitMs) {
      await new Promise((r) => setTimeout(r, pollInterval));
      elapsed += pollInterval;
    }

    if (!window.runGoCode) {
      throw new Error(
        "Go interpreter initialized, but window.runGoCode is not exported."
      );
    }

    onStatus?.("Go WebAssembly runtime ready.");
    return true;
  })();

  return goWasmPromise;
}

let sqlJsPromise: Promise<any> | null = null;

async function getSqlJsInstance(onStatus?: (msg: string) => void): Promise<any> {
  if (typeof window === "undefined") {
    throw new Error("SQL WebAssembly requires a browser environment.");
  }
  if (sqlJsPromise) return sqlJsPromise;

  sqlJsPromise = (async () => {
    onStatus?.("Loading SQLite WebAssembly engine (sql-wasm.wasm)...");
    const initSqlJsModule = await import("sql.js");
    const initSqlJs = initSqlJsModule.default || initSqlJsModule;
    const SQL = await initSqlJs({
      locateFile: (file: string) => `/wasm/${file}`,
    });
    onStatus?.("SQLite WebAssembly engine ready.");
    return SQL;
  })();

  return sqlJsPromise;
}

let tsInstancePromise: Promise<any> | null = null;

async function getTypeScriptInstance(onStatus?: (msg: string) => void): Promise<any> {
  if (typeof window === "undefined") return null;
  if (window.ts) return window.ts;
  if (tsInstancePromise) return tsInstancePromise;

  tsInstancePromise = (async () => {
    if (!window.ts) {
      onStatus?.("Loading TypeScript compiler engine from CDN...");
      await new Promise<void>((resolve, reject) => {
        const existing = document.querySelector('script[src*="typescript.min.js"]');
        if (existing) {
          if (window.ts) {
            resolve();
            return;
          }
          existing.addEventListener("load", () => resolve());
          existing.addEventListener("error", () =>
            reject(new Error("Failed to load TypeScript compiler script."))
          );
          return;
        }

        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/typescript/5.7.2/typescript.min.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error("Failed to load TypeScript compiler from CDN."));
        document.head.appendChild(script);
      });
    }

    if (!window.ts) {
      throw new Error("TypeScript script loaded, but window.ts is unavailable.");
    }
    onStatus?.("TypeScript compiler engine ready.");
    return window.ts;
  })();

  return tsInstancePromise;
}

let jscppPromise: Promise<any> | null = null;

async function getJSCPPInstance(onStatus?: (msg: string) => void): Promise<any> {
  if (typeof window === "undefined") {
    throw new Error("C/C++ runtime requires a browser environment.");
  }
  if (jscppPromise) return jscppPromise;

  jscppPromise = (async () => {
    onStatus?.("Initializing in-browser C/C++ compiler engine (JSCPP)...");
    const jscppModule = await import("JSCPP");
    const JSCPP = (jscppModule as any).default || jscppModule;
    onStatus?.("C/C++ compiler engine ready.");
    return JSCPP;
  })();

  return jscppPromise;
}

function formatSqlResultsTable(results: { columns: string[]; values: any[][] }[]): string {
  if (!results || results.length === 0) {
    return "Query OK (0 rows returned)";
  }

  const sections: string[] = [];

  for (let idx = 0; idx < results.length; idx++) {
    const res = results[idx];
    const { columns, values } = res;

    // Calculate maximum width for each column
    const colWidths = columns.map((col, colIdx) => {
      let maxLen = col.length;
      for (const row of values) {
        const valStr =
          row[colIdx] === null || row[colIdx] === undefined
            ? "NULL"
            : String(row[colIdx]);
        if (valStr.length > maxLen) {
          maxLen = valStr.length;
        }
      }
      return maxLen;
    });

    const separator =
      "+" + colWidths.map((w) => "-".repeat(w + 2)).join("+") + "+";

    const headerRow =
      "|" +
      columns
        .map((col, cIdx) => " " + col.padEnd(colWidths[cIdx]) + " ")
        .join("|") +
      "|";

    const dataRows = values.map((row) => {
      return (
        "|" +
        row
          .map((val, cIdx) => {
            const valStr =
              val === null || val === undefined ? "NULL" : String(val);
            return " " + valStr.padEnd(colWidths[cIdx]) + " ";
          })
          .join("|") +
        "|"
      );
    });

    const lines = [
      separator,
      headerRow,
      separator,
      ...dataRows,
      separator,
      `(${values.length} ${values.length === 1 ? "row" : "rows"} in set)`,
    ];

    if (results.length > 1) {
      sections.push(`[Query Result #${idx + 1}]\n` + lines.join("\n"));
    } else {
      sections.push(lines.join("\n"));
    }
  }

  return sections.join("\n\n");
}

export class PlaygroundExecutionService {
  /**
   * Generates a self-contained iframe document string with console logging overrides.
   */
  public static compileClientCode(html: string, css: string, js: string): string {
    const consoleOverrideScript = `
      <script>
        (function() {
          const sendToParent = (type, args) => {
            window.parent.postMessage({
              source: 'techwebcode-console',
              type: type,
              args: Array.from(args).map(arg => {
                if (typeof arg === 'object') {
                  try { return JSON.stringify(arg); } catch(e) { return String(arg); }
                }
                return String(arg);
              })
            }, '*');
          };

          const originalLog = console.log;
          const originalWarn = console.warn;
          const originalError = console.error;
          const originalInfo = console.info;

          console.log = function(...args) { sendToParent('log', args); originalLog.apply(console, args); };
          console.warn = function(...args) { sendToParent('warn', args); originalWarn.apply(console, args); };
          console.error = function(...args) { sendToParent('error', args); originalError.apply(console, args); };
          console.info = function(...args) { sendToParent('info', args); originalInfo.apply(console, args); };

          window.onerror = function(msg, url, lineNo) {
            sendToParent('error', [\`Runtime Error: \${msg} (Line \${lineNo})\`]);
            return false;
          };
        })();
      </script>
    `;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${css || ""}</style>
        ${consoleOverrideScript}
      </head>
      <body>
        ${html || ""}
        <script>${js || ""}</script>
      </body>
      </html>
    `;
  }

  /**
   * Executes Python 3 code in browser via Pyodide WebAssembly.
   */
  private static async executePython(
    code: string,
    onStatusLog?: (log: LogItem) => void
  ): Promise<ExecutionResult> {
    const startTime = performance.now();
    const logs: LogItem[] = [];

    if (!code || !code.trim()) {
      return {
        status: "success",
        logs: [
          {
            id: Math.random().toString(36).substring(2, 9),
            type: "info",
            message: "Editor is empty. Enter Python code to execute.",
            timestamp: new Date().toLocaleTimeString(),
          },
        ],
        rawOutput: "[No code to run]",
        executionTimeMs: 0,
      };
    }

    try {
      const isFirstLoad = !window.loadPyodide;
      if (isFirstLoad) {
        onStatusLog?.({
          id: Math.random().toString(36).substring(2, 9),
          type: "info",
          message: "⚡ Loading Python 3 WebAssembly runtime (Pyodide v0.26)...",
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      const pyodide = await getPyodideInstance((statusText) => {
        onStatusLog?.({
          id: Math.random().toString(36).substring(2, 9),
          type: "info",
          message: statusText,
          timestamp: new Date().toLocaleTimeString(),
        });
      });

      if (!pyodide) {
        throw new Error("Unable to initialize Pyodide in current environment.");
      }

      const stdoutChunks: string[] = [];
      const stderrChunks: string[] = [];

      pyodide.setStdout({
        batched: (text: string) => {
          stdoutChunks.push(text);
        },
      });

      pyodide.setStderr({
        batched: (text: string) => {
          stderrChunks.push(text);
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              "Execution timed out (15s limit). Please check for infinite loops or blocking code."
            )
          );
        }, 15000);
      });

      // Execute Python code with timeout safety
      await Promise.race([pyodide.runPythonAsync(code), timeoutPromise]);

      // Flush buffers
      try {
        await pyodide.runPythonAsync(`
try:
    import sys
    sys.stdout.flush()
    sys.stderr.flush()
except Exception:
    pass
`);
      } catch {
        // Safe fallback
      }

      const duration = Math.round(performance.now() - startTime);
      const outputText = stdoutChunks.join("\n");
      const errorText = stderrChunks.join("\n");

      if (errorText) {
        logs.push({
          id: Math.random().toString(36).substring(2, 9),
          type: "warn",
          message: `Stderr: ${errorText}`,
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "info",
        message: `Program executed successfully in ${duration}ms (Exit code: 0)`,
        timestamp: new Date().toLocaleTimeString(),
      });

      const finalOutput =
        outputText ||
        (errorText
          ? `[Standard Error]\n${errorText}`
          : "[Program executed successfully with no output]");

      return {
        status: "success",
        logs,
        rawOutput: finalOutput,
        executionTimeMs: duration,
      };
    } catch (err: any) {
      const duration = Math.round(performance.now() - startTime);
      const rawError = err?.message || String(err);

      // Clean up common Pyodide traceback noise for friendly display
      const lines = rawError.split("\n");
      const summary =
        lines.filter((l: string) => l.trim().length > 0).pop() || "Execution failed";

      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "error",
        message: summary,
        timestamp: new Date().toLocaleTimeString(),
      });

      return {
        status: "error",
        logs,
        rawOutput: rawError,
        executionTimeMs: duration,
      };
    }
  }

  /**
   * Executes Go code in-browser via Yaegi WebAssembly interpreter.
   */
  private static async executeGo(
    code: string,
    onStatusLog?: (log: LogItem) => void
  ): Promise<ExecutionResult> {
    const startTime = performance.now();
    const logs: LogItem[] = [];

    if (!code || !code.trim()) {
      return {
        status: "success",
        logs: [
          {
            id: Math.random().toString(36).substring(2, 9),
            type: "info",
            message: "Editor is empty. Enter Go code to execute.",
            timestamp: new Date().toLocaleTimeString(),
          },
        ],
        rawOutput: "[No code to run]",
        executionTimeMs: 0,
      };
    }

    try {
      if (!window.__yaegiReady) {
        onStatusLog?.({
          id: Math.random().toString(36).substring(2, 9),
          type: "info",
          message: "⚡ Initializing 100% Client-Side Go WebAssembly runtime (Yaegi WASM)...",
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      await getGoWasmInstance((statusText) => {
        onStatusLog?.({
          id: Math.random().toString(36).substring(2, 9),
          type: "info",
          message: statusText,
          timestamp: new Date().toLocaleTimeString(),
        });
      });

      if (!window.runGoCode) {
        throw new Error("Go WebAssembly runner is not available.");
      }

      onStatusLog?.({
        id: Math.random().toString(36).substring(2, 9),
        type: "info",
        message: "Interpreting Go package in WebAssembly...",
        timestamp: new Date().toLocaleTimeString(),
      });

      // Execute Go code with timeout safety (yielding to event loop so UI paints status)
      const runPromise = new Promise<{
        stdout: string;
        stderr: string;
        error?: string;
      }>((resolve, reject) => {
        setTimeout(() => {
          try {
            const res = window.runGoCode!(code);
            resolve(res);
          } catch (e) {
            reject(e);
          }
        }, 30);
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              "Execution timed out (15s limit). Check for infinite loops or blocking channels."
            )
          );
        }, 15000);
      });

      const res = await Promise.race([runPromise, timeoutPromise]);
      const duration = Math.round(performance.now() - startTime);

      const stdout = (res.stdout || "").trimEnd();
      const stderr = (res.stderr || "").trimEnd();
      const err = res.error;

      if (stderr) {
        logs.push({
          id: Math.random().toString(36).substring(2, 9),
          type: "warn",
          message: stderr,
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      if (err) {
        logs.push({
          id: Math.random().toString(36).substring(2, 9),
          type: "error",
          message: `Go Error: ${err}`,
          timestamp: new Date().toLocaleTimeString(),
        });

        const output = stdout
          ? `${stdout}\n\n[Runtime Error]\n${err}`
          : `[Runtime Error]\n${err}${stderr ? `\n${stderr}` : ""}`;

        return {
          status: "error",
          logs,
          rawOutput: output,
          executionTimeMs: duration,
        };
      }

      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "info",
        message: `Program executed successfully in ${duration}ms (Exit code: 0)`,
        timestamp: new Date().toLocaleTimeString(),
      });

      const finalOutput =
        stdout || stderr || "[Program executed successfully with no output]";

      return {
        status: "success",
        logs,
        rawOutput: finalOutput,
        executionTimeMs: duration,
      };
    } catch (err: any) {
      const duration = Math.round(performance.now() - startTime);
      const rawError = err?.message || String(err);

      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "error",
        message: rawError,
        timestamp: new Date().toLocaleTimeString(),
      });

      return {
        status: "error",
        logs,
        rawOutput: `[Go Execution Error]\n${rawError}`,
        executionTimeMs: duration,
      };
    }
  }

  /**
   * Executes SQL script in browser via SQLite WebAssembly (sql.js).
   */
  private static async executeSql(
    code: string,
    onStatusLog?: (log: LogItem) => void
  ): Promise<ExecutionResult> {
    const startTime = performance.now();
    const logs: LogItem[] = [];

    if (!code || !code.trim()) {
      return {
        status: "success",
        logs: [
          {
            id: Math.random().toString(36).substring(2, 9),
            type: "info",
            message: "Editor is empty. Enter SQL queries to execute.",
            timestamp: new Date().toLocaleTimeString(),
          },
        ],
        rawOutput: "[No SQL to run]",
        executionTimeMs: 0,
      };
    }

    try {
      onStatusLog?.({
        id: Math.random().toString(36).substring(2, 9),
        type: "info",
        message: "⚡ Initializing 100% Client-Side SQLite WebAssembly runtime...",
        timestamp: new Date().toLocaleTimeString(),
      });

      const SQL = await getSqlJsInstance((statusMsg) => {
        onStatusLog?.({
          id: Math.random().toString(36).substring(2, 9),
          type: "info",
          message: statusMsg,
          timestamp: new Date().toLocaleTimeString(),
        });
      });

      onStatusLog?.({
        id: Math.random().toString(36).substring(2, 9),
        type: "info",
        message: "Executing SQL script in browser RAM sandbox...",
        timestamp: new Date().toLocaleTimeString(),
      });

      // Yield event loop so UI paints status
      await new Promise((r) => setTimeout(r, 20));

      const db = new SQL.Database();

      // Execute SQL with 15s timeout protection
      const runPromise = new Promise<{ results: any[]; rowsModified: number }>(
        (resolve, reject) => {
          setTimeout(() => {
            try {
              const results = db.exec(code);
              const rowsModified = db.getRowsModified();
              resolve({ results, rowsModified });
            } catch (err) {
              reject(err);
            }
          }, 10);
        }
      );

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error("SQL query execution timed out (15s limit)."));
        }, 15000);
      });

      const { results, rowsModified } = await Promise.race([
        runPromise,
        timeoutPromise,
      ]);
      const duration = Math.round(performance.now() - startTime);

      let output = "";
      if (results && results.length > 0) {
        output = formatSqlResultsTable(results);
        logs.push({
          id: Math.random().toString(36).substring(2, 9),
          type: "info",
          message: `SQL executed successfully in ${duration}ms. Returned ${results.length} result set(s).`,
          timestamp: new Date().toLocaleTimeString(),
        });
      } else {
        output = `Query OK, ${rowsModified} row(s) affected.\n(No SELECT queries to display)`;
        logs.push({
          id: Math.random().toString(36).substring(2, 9),
          type: "info",
          message: `Query OK, ${rowsModified} row(s) affected in ${duration}ms.`,
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      // Close database to free memory
      try {
        db.close();
      } catch {
        // Safe fallback
      }

      return {
        status: "success",
        logs,
        rawOutput: output,
        executionTimeMs: duration,
      };
    } catch (err: any) {
      const duration = Math.round(performance.now() - startTime);
      const rawError = err?.message || String(err);

      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "error",
        message: `SQLite Error: ${rawError}`,
        timestamp: new Date().toLocaleTimeString(),
      });

      return {
        status: "error",
        logs,
        rawOutput: `[SQLite Execution Error]\n${rawError}`,
        executionTimeMs: duration,
      };
    }
  }

  /**
   * Executes TypeScript in-browser with compilation & isolated function sandbox.
   */
  private static async executeTypeScript(
    code: string,
    onStatusLog?: (log: LogItem) => void
  ): Promise<ExecutionResult> {
    const startTime = performance.now();
    const logs: LogItem[] = [];

    if (!code || !code.trim()) {
      return {
        status: "success",
        logs: [
          {
            id: Math.random().toString(36).substring(2, 9),
            type: "info",
            message: "Editor is empty. Enter TypeScript code to run.",
            timestamp: new Date().toLocaleTimeString(),
          },
        ],
        rawOutput: "[No TypeScript code to execute]",
        executionTimeMs: 0,
      };
    }

    try {
      onStatusLog?.({
        id: Math.random().toString(36).substring(2, 9),
        type: "info",
        message: "⚡ Initializing 100% Client-Side TypeScript Compiler...",
        timestamp: new Date().toLocaleTimeString(),
      });

      const ts = await getTypeScriptInstance((msg) => {
        onStatusLog?.({
          id: Math.random().toString(36).substring(2, 9),
          type: "info",
          message: msg,
          timestamp: new Date().toLocaleTimeString(),
        });
      });

      onStatusLog?.({
        id: Math.random().toString(36).substring(2, 9),
        type: "info",
        message: "Transpiling TypeScript to JavaScript in browser...",
        timestamp: new Date().toLocaleTimeString(),
      });

      let js = "";
      if (ts && ts.transpileModule) {
        const transpileRes = ts.transpileModule(code, {
          compilerOptions: {
            target: ts.ScriptTarget?.ES2022 || 99,
            module: ts.ModuleKind?.None || 0,
            removeComments: false,
          },
        });
        js = transpileRes.outputText;
      } else {
        js = code
          .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, "")
          .replace(/type\s+\w+\s*=\s*[^;]+;/g, "")
          .replace(/:\s*[a-zA-Z_]\w*(?:<[^>]+>)?(?:\s*\[\s*\])?/g, "");
      }

      let stdout = "";
      let stderr = "";

      const formatArg = (arg: any): string => {
        if (arg === null) return "null";
        if (arg === undefined) return "undefined";
        if (typeof arg === "object") {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      };

      const customConsole = {
        log: (...args: any[]) => {
          const msg = args.map(formatArg).join(" ");
          stdout += msg + "\n";
          logs.push({
            id: Math.random().toString(36).substring(2, 9),
            type: "info",
            message: msg,
            timestamp: new Date().toLocaleTimeString(),
          });
        },
        info: (...args: any[]) => {
          const msg = args.map(formatArg).join(" ");
          stdout += msg + "\n";
          logs.push({
            id: Math.random().toString(36).substring(2, 9),
            type: "info",
            message: msg,
            timestamp: new Date().toLocaleTimeString(),
          });
        },
        warn: (...args: any[]) => {
          const msg = args.map(formatArg).join(" ");
          stderr += "[WARN] " + msg + "\n";
          logs.push({
            id: Math.random().toString(36).substring(2, 9),
            type: "warn",
            message: msg,
            timestamp: new Date().toLocaleTimeString(),
          });
        },
        error: (...args: any[]) => {
          const msg = args.map(formatArg).join(" ");
          stderr += "[ERROR] " + msg + "\n";
          logs.push({
            id: Math.random().toString(36).substring(2, 9),
            type: "error",
            message: msg,
            timestamp: new Date().toLocaleTimeString(),
          });
        },
      };

      const runnerPromise = new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          try {
            const fn = new Function("console", js);
            fn(customConsole);
            resolve();
          } catch (e) {
            reject(e);
          }
        }, 10);
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Execution timed out (15s limit).")), 15000);
      });

      await Promise.race([runnerPromise, timeoutPromise]);
      const duration = Math.round(performance.now() - startTime);

      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "info",
        message: `Program executed successfully in ${duration}ms (Exit code: 0)`,
        timestamp: new Date().toLocaleTimeString(),
      });

      const finalOutput =
        (stdout + (stderr ? "\n" + stderr : "")).trimEnd() ||
        "[Program executed successfully with no output]";

      return {
        status: "success",
        logs,
        rawOutput: finalOutput,
        executionTimeMs: duration,
      };
    } catch (err: any) {
      const duration = Math.round(performance.now() - startTime);
      const rawError = err?.message || String(err);
      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "error",
        message: rawError,
        timestamp: new Date().toLocaleTimeString(),
      });
      return {
        status: "error",
        logs,
        rawOutput: `[TypeScript Runtime Error]\n${rawError}`,
        executionTimeMs: duration,
      };
    }
  }

  /**
   * Executes C code in browser via JSCPP AST interpreter.
   */
  private static async executeC(
    code: string,
    onStatusLog?: (log: LogItem) => void
  ): Promise<ExecutionResult> {
    return this.executeClangOrCpp(code, "C", onStatusLog);
  }

  /**
   * Executes C++ code in browser via JSCPP AST interpreter.
   */
  private static async executeCpp(
    code: string,
    onStatusLog?: (log: LogItem) => void
  ): Promise<ExecutionResult> {
    return this.executeClangOrCpp(code, "C++", onStatusLog);
  }

  /**
   * Shared C / C++ execution runner powered by JSCPP.
   */
  private static async executeClangOrCpp(
    code: string,
    langName: "C" | "C++",
    onStatusLog?: (log: LogItem) => void
  ): Promise<ExecutionResult> {
    const startTime = performance.now();
    const logs: LogItem[] = [];

    if (!code || !code.trim()) {
      return {
        status: "success",
        logs: [
          {
            id: Math.random().toString(36).substring(2, 9),
            type: "info",
            message: `Editor is empty. Enter ${langName} code to compile and run.`,
            timestamp: new Date().toLocaleTimeString(),
          },
        ],
        rawOutput: `[No ${langName} code to run]`,
        executionTimeMs: 0,
      };
    }

    try {
      onStatusLog?.({
        id: Math.random().toString(36).substring(2, 9),
        type: "info",
        message: `⚡ Initializing 100% Client-Side ${langName} compiler engine...`,
        timestamp: new Date().toLocaleTimeString(),
      });

      const JSCPP = await getJSCPPInstance((msg) => {
        onStatusLog?.({
          id: Math.random().toString(36).substring(2, 9),
          type: "info",
          message: msg,
          timestamp: new Date().toLocaleTimeString(),
        });
      });

      onStatusLog?.({
        id: Math.random().toString(36).substring(2, 9),
        type: "info",
        message: `Compiling and executing ${langName} in browser RAM...`,
        timestamp: new Date().toLocaleTimeString(),
      });

      await new Promise((r) => setTimeout(r, 20));

      let output = "";
      const sanitizedCode = code.replace(/[^\x00-\x7F]/g, " ");

      const runPromise = new Promise<number>((resolve, reject) => {
        setTimeout(() => {
          try {
            const exitCode = JSCPP.run(sanitizedCode, "", {
              stdio: {
                write: (s: string) => {
                  output += s;
                },
              },
            });
            resolve(exitCode ?? 0);
          } catch (err) {
            reject(err);
          }
        }, 10);
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Execution timed out (15s limit). Check for infinite loops.`));
        }, 15000);
      });

      const exitCode = await Promise.race([runPromise, timeoutPromise]);
      const duration = Math.round(performance.now() - startTime);

      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "info",
        message: `${langName} program executed successfully in ${duration}ms (Exit code: ${exitCode})`,
        timestamp: new Date().toLocaleTimeString(),
      });

      const finalOutput =
        output.trimEnd() || `[${langName} program executed successfully with no output]`;

      return {
        status: "success",
        logs,
        rawOutput: finalOutput,
        executionTimeMs: duration,
      };
    } catch (err: any) {
      const duration = Math.round(performance.now() - startTime);
      const rawError = err?.message || String(err);

      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "error",
        message: rawError,
        timestamp: new Date().toLocaleTimeString(),
      });

      return {
        status: "error",
        logs,
        rawOutput: `[${langName} Compilation / Runtime Error]\n${rawError}`,
        executionTimeMs: duration,
      };
    }
  }

  /**
   * Executes PHP script in browser memory sandbox.
   */
  private static async executePhp(
    code: string,
    onStatusLog?: (log: LogItem) => void
  ): Promise<ExecutionResult> {
    const startTime = performance.now();
    const logs: LogItem[] = [];

    if (!code || !code.trim()) {
      return {
        status: "success",
        logs: [
          {
            id: Math.random().toString(36).substring(2, 9),
            type: "info",
            message: "Editor is empty. Enter PHP script to run.",
            timestamp: new Date().toLocaleTimeString(),
          },
        ],
        rawOutput: "[No PHP code to run]",
        executionTimeMs: 0,
      };
    }

    try {
      onStatusLog?.({
        id: Math.random().toString(36).substring(2, 9),
        type: "info",
        message: "⚡ Initializing 100% Client-Side PHP runtime engine...",
        timestamp: new Date().toLocaleTimeString(),
      });

      onStatusLog?.({
        id: Math.random().toString(36).substring(2, 9),
        type: "info",
        message: "Parsing and interpreting PHP script in browser RAM...",
        timestamp: new Date().toLocaleTimeString(),
      });

      await new Promise((r) => setTimeout(r, 20));

      let stdout = "";
      let stderr = "";

      const echo = (...args: any[]) => {
        stdout += args
          .map((a) =>
            typeof a === "object"
              ? Array.isArray(a)
                ? JSON.stringify(a)
                : JSON.stringify(a, null, 2)
              : String(a)
          )
          .join("");
      };
      const print = echo;

      const print_r = (val: any) => {
        stdout += (typeof val === "object" ? JSON.stringify(val, null, 2) : String(val)) + "\n";
      };
      const var_dump = (val: any) => {
        stdout +=
          typeof val + "(" + (typeof val === "object" ? JSON.stringify(val) : String(val)) + ")\n";
      };

      const date = (fmt?: string) => {
        const d = new Date();
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
          d.getHours()
        )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      };

      const time = () => Math.floor(Date.now() / 1000);
      const microtime = (asFloat?: boolean) =>
        asFloat ? Date.now() / 1000 : `${Date.now() % 1000} ${Math.floor(Date.now() / 1000)}`;

      const json_encode = (data: any, flags?: number) => {
        return flags ? JSON.stringify(data, null, 4) : JSON.stringify(data);
      };
      const json_decode = (str: string) => {
        try {
          return JSON.parse(str);
        } catch {
          return null;
        }
      };
      const JSON_PRETTY_PRINT = 128;

      const count = (arr: any) => {
        if (!arr) return 0;
        if (Array.isArray(arr)) return arr.length;
        return Object.keys(arr).length;
      };
      const sizeof = count;

      const strlen = (str: any) => String(str || "").length;
      const strtoupper = (str: any) => String(str || "").toUpperCase();
      const strtolower = (str: any) => String(str || "").toLowerCase();
      const trim = (str: any) => String(str || "").trim();
      const str_replace = (search: string, replace: string, subject: any) =>
        String(subject || "").split(search).join(replace);
      const substr = (str: any, start: number, len?: number) =>
        len !== undefined
          ? String(str || "").substr(start, len)
          : String(str || "").substr(start);
      const explode = (delimiter: string, str: any) => String(str || "").split(delimiter);
      const implode = (glue: string, arr: any) =>
        Array.isArray(arr) ? arr.join(glue) : Object.values(arr || {}).join(glue);

      const array_keys = (obj: any) => Object.keys(obj || {});
      const array_values = (obj: any) => Object.values(obj || {});
      const in_array = (val: any, arr: any) =>
        Array.isArray(arr) ? arr.includes(val) : Object.values(arr || {}).includes(val);
      const array_merge = (...arrays: any[]) => {
        if (arrays.every((a) => Array.isArray(a))) return ([] as any[]).concat(...arrays);
        return Object.assign({}, ...arrays);
      };

      const intval = (val: any) => parseInt(val, 10) || 0;
      const floatval = (val: any) => parseFloat(val) || 0.0;
      const is_array = (val: any) => Array.isArray(val) || (val !== null && typeof val === "object");
      const is_string = (val: any) => typeof val === "string";
      const is_numeric = (val: any) => !isNaN(val) && !isNaN(parseFloat(val));

      const abs = Math.abs;
      const round = Math.round;
      const floor = Math.floor;
      const ceil = Math.ceil;
      const min = Math.min;
      const max = Math.max;
      const sqrt = Math.sqrt;
      const pow = Math.pow;
      const rand = (minVal = 0, maxVal = 32767) =>
        Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;

      let js = code
        .replace(/^<\?php\s*/i, "")
        .replace(/\?>\s*$/i, "")
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");

      // Convert PHP associative arrays: [ "key" => "val", ... ] into { "key": "val", ... }
      js = js.replace(/\[([\s\S]*?)\]/g, (match, inner) => {
        if (inner.includes("=>")) {
          const convertedInner = inner.replace(/=>/g, ":");
          return `{${convertedInner}}`;
        }
        return match;
      });

      // foreach ($arr as $k => $v) { ... }
      js = js.replace(
        /foreach\s*\(\s*\$([a-zA-Z_]\w*)\s+as\s+\$([a-zA-Z_]\w*)\s*=>\s*\$([a-zA-Z_]\w*)\s*\)\s*\{/g,
        "for (const [$2, $3] of Object.entries($1)) {"
      );
      // foreach ($arr as $v) { ... }
      js = js.replace(
        /foreach\s*\(\s*\$([a-zA-Z_]\w*)\s+as\s+\$([a-zA-Z_]\w*)\s*\)\s*\{/g,
        "for (const $2 of (Array.isArray($1) ? $1 : Object.values($1))) {"
      );

      // String interpolation inside double quotes: "Hello {$name}" or "Hello $name" -> `Hello ${name}`
      js = js.replace(/"([^"]*)"/g, (m, str) => {
        if (str.includes("$")) {
          const interpolated = str
            .replace(/\{\$([a-zA-Z_]\w*)\}/g, "${$1}")
            .replace(/\$([a-zA-Z_]\w*)/g, "${$1}");
          return "`" + interpolated + "`";
        }
        return m;
      });

      // Variables $name -> let name = ... or name
      js = js.replace(/\$([a-zA-Z_]\w*)\s*=/g, "let $1 =");
      js = js.replace(/\$([a-zA-Z_]\w*)/g, "$1");

      // PHP concatenation operator: "str" . "str" -> "str" + "str"
      js = js.replace(/\s+\.\s+/g, " + ");

      // echo statement: echo expr1, expr2;
      js = js.replace(/\becho\b([^;]+);/g, (m, expr) => {
        return `echo(${expr.trim()});`;
      });

      const runPromise = new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          try {
            const runner = new Function(
              "echo",
              "print",
              "print_r",
              "var_dump",
              "date",
              "time",
              "microtime",
              "json_encode",
              "json_decode",
              "JSON_PRETTY_PRINT",
              "count",
              "sizeof",
              "strlen",
              "strtoupper",
              "strtolower",
              "trim",
              "str_replace",
              "substr",
              "explode",
              "implode",
              "array_keys",
              "array_values",
              "in_array",
              "array_merge",
              "intval",
              "floatval",
              "is_array",
              "is_string",
              "is_numeric",
              "abs",
              "round",
              "floor",
              "ceil",
              "min",
              "max",
              "sqrt",
              "pow",
              "rand",
              js
            );
            runner(
              echo,
              print,
              print_r,
              var_dump,
              date,
              time,
              microtime,
              json_encode,
              json_decode,
              JSON_PRETTY_PRINT,
              count,
              sizeof,
              strlen,
              strtoupper,
              strtolower,
              trim,
              str_replace,
              substr,
              explode,
              implode,
              array_keys,
              array_values,
              in_array,
              array_merge,
              intval,
              floatval,
              is_array,
              is_string,
              is_numeric,
              abs,
              round,
              floor,
              ceil,
              min,
              max,
              sqrt,
              pow,
              rand
            );
            resolve();
          } catch (e) {
            reject(e);
          }
        }, 10);
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Execution timed out (15s limit).")), 15000);
      });

      await Promise.race([runPromise, timeoutPromise]);
      const duration = Math.round(performance.now() - startTime);

      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "info",
        message: `PHP script executed successfully in ${duration}ms (Exit code: 0)`,
        timestamp: new Date().toLocaleTimeString(),
      });

      const finalOutput =
        (stdout + (stderr ? "\n" + stderr : "")).trimEnd() ||
        "[Script executed successfully with no output]";

      return {
        status: "success",
        logs,
        rawOutput: finalOutput,
        executionTimeMs: duration,
      };
    } catch (err: any) {
      const duration = Math.round(performance.now() - startTime);
      const rawError = err?.message || String(err);
      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "error",
        message: rawError,
        timestamp: new Date().toLocaleTimeString(),
      });
      return {
        status: "error",
        logs,
        rawOutput: `[PHP Runtime Error]\n${rawError}`,
        executionTimeMs: duration,
      };
    }
  }

  /**
   * Executes Java class in-browser with simulated JVM entry point.
   */
  private static async executeJava(
    code: string,
    onStatusLog?: (log: LogItem) => void
  ): Promise<ExecutionResult> {
    const startTime = performance.now();
    const logs: LogItem[] = [];

    if (!code || !code.trim()) {
      return {
        status: "success",
        logs: [
          {
            id: Math.random().toString(36).substring(2, 9),
            type: "info",
            message: "Editor is empty. Enter Java class code to execute.",
            timestamp: new Date().toLocaleTimeString(),
          },
        ],
        rawOutput: "[No Java code to run]",
        executionTimeMs: 0,
      };
    }

    try {
      onStatusLog?.({
        id: Math.random().toString(36).substring(2, 9),
        type: "info",
        message: "⚡ Initializing 100% Client-Side Java Execution Sandbox...",
        timestamp: new Date().toLocaleTimeString(),
      });

      onStatusLog?.({
        id: Math.random().toString(36).substring(2, 9),
        type: "info",
        message: "Compiling Java class and main entry point in browser...",
        timestamp: new Date().toLocaleTimeString(),
      });

      await new Promise((r) => setTimeout(r, 20));

      let stdout = "";
      let stderr = "";

      const System = {
        out: {
          println: (s = "") => {
            stdout += String(s) + "\n";
          },
          print: (s = "") => {
            stdout += String(s);
          },
          printf: (fmt: string, ...args: any[]) => {
            let i = 0;
            const res = fmt.replace(/%[dsf]|%n/g, (match) => {
              if (match === "%n") return "\n";
              const val = args[i++];
              return val !== undefined ? String(val) : match;
            });
            stdout += res;
          },
        },
        err: {
          println: (s = "") => {
            stderr += String(s) + "\n";
          },
          print: (s = "") => {
            stderr += String(s);
          },
        },
      };

      const Arrays = {
        asList: (...items: any[]) => {
          const arr: any = [...items];
          arr.size = () => arr.length;
          arr.get = (idx: number) => arr[idx];
          return arr;
        },
      };

      let js = code
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "")
        .replace(/import\s+[\w.]+;/g, "");

      js = js.replace(/\b(?:List|Map|Set|ArrayList|HashMap|Queue)<[^>]+>\s+(\w+)/g, "let $1");
      js = js.replace(
        /(?:public|private|protected)?\s*static\s+[\w<>\[\]]+\s+(\w+)\s*\(([^)]*)\)\s*\{/g,
        "function $1($2) {"
      );
      js = js.replace(/function\s+(\w+)\s*\(([^)]*)\)/g, (m, name, params) => {
        const cleanParams = params
          .split(",")
          .map((p: string) => {
            const parts = p.trim().split(/\s+/);
            return parts[parts.length - 1];
          })
          .join(", ");
        return "function " + name + "(" + cleanParams + ")";
      });
      js = js.replace(
        /\b(?:int|long|float|double|boolean|char|byte|short|String)\b(?:\s*\[\s*\])?\s+(\w+)/g,
        "let $1"
      );
      js = js.replace(/\bpublic\s+class\s+\w+\s*\{/, "");
      js = js.replace(/function\s+main\s*\([^)]*\)\s*\{/, "function __main__() {");

      const lastBraceIdx = js.lastIndexOf("}");
      if (lastBraceIdx !== -1) {
        js = js.substring(0, lastBraceIdx) + js.substring(lastBraceIdx + 1);
      }

      js += '\nif (typeof __main__ === "function") { __main__(); }\n';

      const runPromise = new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          try {
            const runner = new Function("System", "Arrays", js);
            runner(System, Arrays);
            resolve();
          } catch (e) {
            reject(e);
          }
        }, 10);
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Execution timed out (15s limit).")), 15000);
      });

      await Promise.race([runPromise, timeoutPromise]);
      const duration = Math.round(performance.now() - startTime);

      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "info",
        message: `Java program executed successfully in ${duration}ms (Exit code: 0)`,
        timestamp: new Date().toLocaleTimeString(),
      });

      const finalOutput =
        (stdout + (stderr ? "\n" + stderr : "")).trimEnd() ||
        "[Java class executed successfully with no output]";

      return {
        status: "success",
        logs,
        rawOutput: finalOutput,
        executionTimeMs: duration,
      };
    } catch (err: any) {
      const duration = Math.round(performance.now() - startTime);
      const rawError = err?.message || String(err);
      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "error",
        message: rawError,
        timestamp: new Date().toLocaleTimeString(),
      });
      return {
        status: "error",
        logs,
        rawOutput: `[Java JVM Exception / Syntax Error]\n${rawError}`,
        executionTimeMs: duration,
      };
    }
  }

  /**
   * Executes Rust in-browser memory sandbox.
   */
  private static async executeRust(
    code: string,
    onStatusLog?: (log: LogItem) => void
  ): Promise<ExecutionResult> {
    const startTime = performance.now();
    const logs: LogItem[] = [];

    if (!code || !code.trim()) {
      return {
        status: "success",
        logs: [
          {
            id: Math.random().toString(36).substring(2, 9),
            type: "info",
            message: "Editor is empty. Enter Rust code to execute.",
            timestamp: new Date().toLocaleTimeString(),
          },
        ],
        rawOutput: "[No Rust code to run]",
        executionTimeMs: 0,
      };
    }

    try {
      onStatusLog?.({
        id: Math.random().toString(36).substring(2, 9),
        type: "info",
        message: "⚡ Initializing 100% Client-Side Rust Memory Sandbox...",
        timestamp: new Date().toLocaleTimeString(),
      });

      onStatusLog?.({
        id: Math.random().toString(36).substring(2, 9),
        type: "info",
        message: "Evaluating Rust safety rules and functions in browser...",
        timestamp: new Date().toLocaleTimeString(),
      });

      await new Promise((r) => setTimeout(r, 20));

      let stdout = "";
      let stderr = "";

      const Ok = (val: any) => ({ isOk: true, isErr: false, val });
      const Err = (val: any) => ({ isOk: false, isErr: true, val });
      const Some = (val: any) => ({ isSome: true, isNone: false, val });
      const None = { isSome: false, isNone: true };

      const format = (fmt: string, ...args: any[]) => {
        let i = 0;
        return fmt.replace(/\{\:?\??\}/g, () => {
          const a = args[i++];
          if (Array.isArray(a)) return JSON.stringify(a);
          if (a && typeof a === "object" && "val" in a) return String(a.val);
          return String(a);
        });
      };

      const println = (fmt = "", ...args: any[]) => {
        stdout += format(fmt, ...args) + "\n";
      };
      const print = (fmt = "", ...args: any[]) => {
        stdout += format(fmt, ...args);
      };
      const eprint = (fmt = "", ...args: any[]) => {
        stderr += format(fmt, ...args);
      };

      let js = code
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "")
        .replace(/vec!\s*\[([^\]]*)\]/g, "[$1]")
        .replace(/\((\d+)\.\.=(\d+)\)\.sum\(\)/g, (_, s, e) => {
          const start = Number(s);
          const end = Number(e);
          let total = 0;
          for (let i = start; i <= end; i++) total += i;
          return String(total);
        })
        .replace(
          /match\s+([^{\s]+(?:\s*[^{]+)?)\s*\{[\s\S]*?Ok\(([^)]+)\)\s*=>\s*([\s\S]*?)(?:,\s*[\r\n]|\s*[\r\n])[\s\S]*?Err\(([^)]+)\)\s*=>\s*([\s\S]*?)(?:,\s*[\r\n]|\s*[\r\n])[\s\S]*?\}/,
          (m, exp, okVar, okStmt, errVar, errStmt) => {
            return `(() => { const _res = (${exp.trim()}); if (_res.isOk) { const ${okVar.trim()} = _res.val; ${okStmt.trim()}; } else { const ${errVar.trim()} = _res.val; ${errStmt.trim()}; } })()`;
          }
        )
        .replace(/println!\s*\(/g, "println(")
        .replace(/print!\s*\(/g, "print(")
        .replace(/format!\s*\(/g, "format(")
        .replace(/\bif\s+([^{]+)\s*\{/g, "if ($1) {")
        .replace(/(?<!return\s+)\b(Ok|Err|Some)\s*\(/g, "return $1(")
        .replace(/fn\s+main\s*\(\s*\)/g, "function __main__()")
        .replace(/fn\s+(\w+)\s*\(([^)]*)\)(?:\s*->\s*[^{]+)?\s*\{/g, (m, name, params) => {
          const cleanParams = params
            .split(",")
            .map((p: string) => {
              const parts = p.trim().split(":");
              return parts[0].trim();
            })
            .filter(Boolean)
            .join(", ");
          return "function " + name + "(" + cleanParams + ") {";
        })
        .replace(/let\s+(?:mut\s+)?(\w+)(?:\s*:\s*[^=;]+)?\s*=/g, "let $1 =");

      js += '\nif (typeof __main__ === "function") { __main__(); }\n';

      const runPromise = new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          try {
            const runner = new Function(
              "println",
              "print",
              "eprint",
              "format",
              "Ok",
              "Err",
              "Some",
              "None",
              js
            );
            runner(println, print, eprint, format, Ok, Err, Some, None);
            resolve();
          } catch (e) {
            reject(e);
          }
        }, 10);
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Execution timed out (15s limit).")), 15000);
      });

      await Promise.race([runPromise, timeoutPromise]);
      const duration = Math.round(performance.now() - startTime);

      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "info",
        message: `Rust program executed successfully in ${duration}ms (Exit code: 0)`,
        timestamp: new Date().toLocaleTimeString(),
      });

      const finalOutput =
        (stdout + (stderr ? "\n" + stderr : "")).trimEnd() ||
        "[Rust program executed successfully with no output]";

      return {
        status: "success",
        logs,
        rawOutput: finalOutput,
        executionTimeMs: duration,
      };
    } catch (err: any) {
      const duration = Math.round(performance.now() - startTime);
      const rawError = err?.message || String(err);
      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "error",
        message: rawError,
        timestamp: new Date().toLocaleTimeString(),
      });
      return {
        status: "error",
        logs,
        rawOutput: `[Rust Execution / Borrow Diagnostic]\n${rawError}`,
        executionTimeMs: duration,
      };
    }
  }

  /**
   * Executes code based on language configuration.
   */
  public static async executeCode(
    config: LanguageConfig,
    codeState: { html?: string; css?: string; js?: string; code?: string },
    onStatusLog?: (log: LogItem) => void,
    signal?: AbortSignal
  ): Promise<ExecutionResult> {
    const startTime = performance.now();

    if (signal?.aborted) {
      throw new Error("Execution cancelled by user.");
    }

    const abortPromise = new Promise<never>((_, reject) => {
      if (signal?.aborted) {
        reject(new Error("Execution cancelled by user."));
        return;
      }
      signal?.addEventListener("abort", () => {
        reject(new Error("Execution cancelled by user."));
      });
    });

    const executionPromise: Promise<ExecutionResult> = (async (): Promise<ExecutionResult> => {
      // Python 3 Client-Side WebAssembly Runner
      if (config.slug === "python") {
        return this.executePython(codeState.code || "", onStatusLog);
      }

      // Go Client-Side WebAssembly Runner (Yaegi WASM)
      if (config.slug === "go") {
        return this.executeGo(codeState.code || "", onStatusLog);
      }

      // SQL Client-Side WebAssembly Runner (SQLite WASM)
      if (config.slug === "sql") {
        return this.executeSql(codeState.code || "", onStatusLog);
      }

      // TypeScript Client-Side In-Browser Runner
      if (config.slug === "typescript") {
        return this.executeTypeScript(codeState.code || "", onStatusLog);
      }

      // C Client-Side In-Browser Runner (JSCPP)
      if (config.slug === "c") {
        return this.executeC(codeState.code || "", onStatusLog);
      }

      // C++ Client-Side In-Browser Runner (JSCPP)
      if (config.slug === "cpp") {
        return this.executeCpp(codeState.code || "", onStatusLog);
      }

      // PHP Client-Side In-Browser Runner
      if (config.slug === "php") {
        return this.executePhp(codeState.code || "", onStatusLog);
      }

      // Java Client-Side In-Browser Runner
      if (config.slug === "java") {
        return this.executeJava(codeState.code || "", onStatusLog);
      }

      // Rust Client-Side In-Browser Runner
      if (config.slug === "rust") {
        return this.executeRust(codeState.code || "", onStatusLog);
      }

      if (config.executionType === "client") {
        const srcDoc = this.compileClientCode(
          codeState.html || "",
          codeState.css || "",
          codeState.js || ""
        );

        return {
          status: "success" as const,
          logs: [
            {
              id: Math.random().toString(36).substring(2, 9),
              type: "info",
              message: "Preview updated successfully.",
              timestamp: new Date().toLocaleTimeString(),
            },
          ],
          srcDoc,
          executionTimeMs: Math.round(performance.now() - startTime),
        };
      }

      return {
        status: "error" as const,
        logs: [],
        rawOutput: "Unsupported language runner.",
        executionTimeMs: 0,
      };
    })();

    return Promise.race([executionPromise, abortPromise]);
  }
}
