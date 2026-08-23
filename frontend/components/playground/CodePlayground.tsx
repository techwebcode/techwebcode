"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  RotateCcw,
  Download,
  Terminal,
  Code2,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Sparkles,
  LayoutGrid,
  Columns,
  Rows,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import FullScreenWorkspace from "@/components/tool/workspace/FullScreenWorkspace";

interface Template {
  name: string;
  description: string;
  html: string;
  css: string;
  js: string;
}

const TEMPLATES: Record<string, Template> = {
  counter: {
    name: "Interactive Counter",
    description: "Glassmorphism UI counter with smooth state animation",
    html: `<div class="card">
  <h2>⚡ Counter App</h2>
  <div id="counter-value">0</div>
  <div class="button-group">
    <button id="decrement-btn">-</button>
    <button id="reset-btn">Reset</button>
    <button id="increment-btn">+</button>
  </div>
</div>`,
    css: `body {
  font-family: system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #0f172a, #1e1b4b);
  color: white;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}

.card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 32px 48px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

h2 {
  margin-top: 0;
  color: #a5b4fc;
}

#counter-value {
  font-size: 4rem;
  font-weight: 800;
  margin: 24px 0;
  color: #6366f1;
  text-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
  transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
}

button {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover {
  background: #6366f1;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

button:active {
  transform: translateY(0);
}`,
    js: `let count = 0;
const valueDisplay = document.getElementById('counter-value');
const incBtn = document.getElementById('increment-btn');
const decBtn = document.getElementById('decrement-btn');
const resetBtn = document.getElementById('reset-btn');

function updateDisplay() {
  valueDisplay.textContent = count;
  valueDisplay.style.transform = 'scale(1.25)';
  setTimeout(() => {
    valueDisplay.style.transform = 'scale(1)';
  }, 150);
  console.log("Current Count:", count);
}

incBtn.addEventListener('click', () => {
  count++;
  updateDisplay();
});

decBtn.addEventListener('click', () => {
  count--;
  updateDisplay();
});

resetBtn.addEventListener('click', () => {
  count = 0;
  updateDisplay();
  console.warn("Counter reset to 0");
});`
  },
  particles: {
    name: "Canvas Particle Animation",
    description: "Interactive HTML5 canvas particle system with mouse trail",
    html: `<canvas id="canvas"></canvas>
<div class="overlay-text">Move your mouse across the canvas ✨</div>`,
    css: `body {
  margin: 0;
  overflow: hidden;
  background: #090d16;
  font-family: sans-serif;
}

#canvas {
  display: block;
  width: 100vw;
  height: 100vh;
}

.overlay-text {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  pointer-events: none;
  letter-spacing: 0.05em;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  padding: 8px 18px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}`,
    js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const colors = ['#6366f1', '#06b6d4', '#10b981', '#f43f5e', '#a855f7'];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 8 + 2;
    this.speedX = (Math.random() - 0.5) * 4;
    this.speedY = (Math.random() - 0.5) * 4;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.alpha = 1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= 0.015;
    if (this.size > 0.2) this.size -= 0.05;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

window.addEventListener('mousemove', (e) => {
  for (let i = 0; i < 3; i++) {
    particles.push(new Particle(e.x, e.y));
  }
});

function animate() {
  ctx.fillStyle = 'rgba(9, 13, 22, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    if (particles[i].alpha <= 0 || particles[i].size <= 0.2) {
      particles.splice(i, 1);
      i--;
    }
  }
  requestAnimationFrame(animate);
}

console.log("Canvas Engine Initialized!");
animate();`
  },
  todo: {
    name: "Interactive Todo Tracker",
    description: "Task manager with local state management",
    html: `<div class="todo-app">
  <h1>Task Tracker 📝</h1>
  <div class="input-row">
    <input type="text" id="todo-input" placeholder="What needs to be done?" />
    <button id="add-btn">Add Task</button>
  </div>
  <ul id="todo-list"></ul>
</div>`,
    css: `body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0f172a;
  color: #f8fafc;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}

.todo-app {
  width: 90%;
  max-width: 440px;
  background: #1e293b;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.08);
}

h1 { font-size: 1.5rem; margin-top: 0; color: #38bdf8; }

.input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  background: #0f172a;
  border: 1px solid #334155;
  color: white;
  padding: 10px 14px;
  border-radius: 8px;
  outline: none;
}

button {
  background: #0284c7;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

button:hover { background: #0369a1; }

ul { list-style: none; padding: 0; margin: 0; }

li {
  background: #334155;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
}

li.done { text-decoration: line-through; opacity: 0.5; }

.delete-btn {
  background: #ef4444;
  padding: 4px 8px;
  font-size: 0.8rem;
}`,
    js: `const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

let todos = [
  { id: 1, text: "Build HTML/JS Playground", completed: true },
  { id: 2, text: "Add SplitUdhar features", completed: true }
];

function render() {
  list.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    if (todo.completed) li.classList.add('done');
    li.innerHTML = \`
      <span onclick="toggleTodo(\${todo.id})" style="cursor:pointer">\${todo.text}</span>
      <button class="delete-btn" onclick="deleteTodo(\${todo.id})">✕</button>
    \`;
    list.appendChild(li);
  });
}

function addTodo() {
  const text = input.value.trim();
  if (!text) return;
  todos.push({ id: Date.now(), text, completed: false });
  input.value = '';
  console.log("Task Added:", text);
  render();
}

function toggleTodo(id) {
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  render();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  console.warn("Deleted task ID:", id);
  render();
}

addBtn.addEventListener('click', addTodo);
input.addEventListener('keypress', e => { if (e.key === 'Enter') addTodo(); });

render();`
  }
};

interface LogItem {
  id: string;
  type: "log" | "warn" | "error" | "info";
  message: string;
  timestamp: string;
}

export default function CodePlayground() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("counter");
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [html, setHtml] = useState<string>(TEMPLATES.counter.html);
  const [css, setCss] = useState<string>(TEMPLATES.counter.css);
  const [js, setJs] = useState<string>(TEMPLATES.counter.js);
  const [autoRun, setAutoRun] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [layoutMode, setLayoutMode] = useState<"columns" | "rows">("columns");
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [srcDoc, setSrcDoc] = useState<string>("");

  const previewFrameRef = useRef<HTMLIFrameElement>(null);

  // Clear Console
  const clearConsole = () => {
    setLogs([]);
  };

  // Compile Code and Update Preview
  const runCode = useCallback(() => {
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

    const compiledDocument = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${css}</style>
        ${consoleOverrideScript}
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
      </html>
    `;

    setSrcDoc(compiledDocument);
  }, [html, css, js]);

  // Handle Log Messages from IFrame
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === "techwebcode-console") {
        const newLog: LogItem = {
          id: Math.random().toString(36).substring(2, 9),
          type: event.data.type || "log",
          message: event.data.args.join(" "),
          timestamp: new Date().toLocaleTimeString(),
        };
        setLogs((prev) => [...prev.slice(-99), newLog]);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Auto Run Debounce
  useEffect(() => {
    if (!autoRun) return;
    const timer = setTimeout(() => {
      runCode();
    }, 650);
    return () => clearTimeout(timer);
  }, [html, css, js, autoRun, runCode]);

  // Initial Run
  useEffect(() => {
    runCode();
  }, [runCode]);

  // Template Change Handler
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    setSelectedTemplate(key);
    if (TEMPLATES[key]) {
      setHtml(TEMPLATES[key].html);
      setCss(TEMPLATES[key].css);
      setJs(TEMPLATES[key].js);
      clearConsole();
      toast.success(`Loaded template: ${TEMPLATES[key].name}`);
    }
  };

  // Reset Handler
  const handleReset = () => {
    if (TEMPLATES[selectedTemplate]) {
      setHtml(TEMPLATES[selectedTemplate].html);
      setCss(TEMPLATES[selectedTemplate].css);
      setJs(TEMPLATES[selectedTemplate].js);
      clearConsole();
      toast.info("Editor code reset");
    }
  };

  // Copy Code Handler
  const handleCopyCode = () => {
    const fullCode = `<!-- HTML -->\n${html}\n\n/* CSS */\n${css}\n\n// JavaScript\n${js}`;
    navigator.clipboard.writeText(fullCode);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Download Handler
  const handleDownload = () => {
    const blob = new Blob(
      [
        `<!DOCTYPE html>\n<html>\n<head>\n<style>\n${css}\n</style>\n</head>\n<body>\n${html}\n<script>\n${js}\n</script>\n</body>\n</html>`,
      ],
      { type: "text/html" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "techwebcode-playground.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported playground-code.html!");
  };

  // Keyboard Shortcuts (Ctrl + Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runCode();
        toast.info("Code executed!");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [runCode]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background text-foreground overflow-hidden">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-card border-b border-border">
        {/* Left: Brand & Template Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-lg border border-primary/20">
            <Code2 className="w-4 h-4 text-primary" />
            <span>HTML & JS Playground</span>
          </div>

          <select
            value={selectedTemplate}
            onChange={handleTemplateChange}
            className="text-xs bg-muted text-foreground border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
          >
            {Object.entries(TEMPLATES).map(([key, t]) => (
              <option key={key} value={key}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={runCode}
            className="flex items-center gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground px-3.5 py-1.5 rounded-lg shadow-sm transition-all active:scale-95"
            title="Run Code (Ctrl + Enter)"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-medium bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-lg border border-border transition-all"
            title="Reset to Template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 text-xs font-medium bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-lg border border-border transition-all"
            title="Copy Code"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs font-medium bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-lg border border-border transition-all"
            title="Export HTML File"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Layout Toggle */}
          <button
            onClick={() => setLayoutMode(layoutMode === "columns" ? "rows" : "columns")}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
            title={`Switch to ${layoutMode === "columns" ? "Stacked Rows" : "Side-by-Side"} Layout`}
          >
            {layoutMode === "columns" ? <Rows className="w-4 h-4" /> : <Columns className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Container Grid */}
      <div
        className={`flex-1 grid overflow-hidden ${
          layoutMode === "columns" ? "grid-cols-1 lg:grid-cols-2" : "grid-rows-2"
        }`}
      >
        {/* Editor Area (Left/Top) */}
        <div className="flex flex-col border-r border-b border-border bg-card overflow-hidden">
          {/* Editor Tabs */}
          <div className="flex items-center justify-between px-2 bg-muted/40 border-b border-border">
            <div className="flex">
              <button
                onClick={() => setActiveTab("html")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === "html"
                    ? "border-orange-500 text-foreground bg-background"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                HTML
              </button>

              <button
                onClick={() => setActiveTab("css")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === "css"
                    ? "border-blue-500 text-foreground bg-background"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                CSS
              </button>

              <button
                onClick={() => setActiveTab("js")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === "js"
                    ? "border-yellow-400 text-foreground bg-background"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                JavaScript
              </button>
            </div>

            <span className="text-[11px] text-muted-foreground font-mono px-2 hidden sm:inline">
              Ctrl + Enter to execute
            </span>
          </div>

          {/* Monaco Code Editor */}
          <div className="flex-1 overflow-hidden relative">
            <div className={`h-full ${activeTab === "html" ? "block" : "hidden"}`}>
              <Editor
                height="100%"
                defaultLanguage="html"
                theme="vs-dark"
                value={html}
                onChange={(v) => setHtml(v || "")}
                options={{
                  fontSize: 13,
                  fontFamily: "'Fira Code', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  lineNumbers: "on",
                  tabSize: 2,
                  scrollbar: {
                    alwaysConsumeMouseWheel: false,
                    vertical: "auto",
                    horizontal: "auto",
                  },
                }}
              />
            </div>

            <div className={`h-full ${activeTab === "css" ? "block" : "hidden"}`}>
              <Editor
                height="100%"
                defaultLanguage="css"
                theme="vs-dark"
                value={css}
                onChange={(v) => setCss(v || "")}
                options={{
                  fontSize: 13,
                  fontFamily: "'Fira Code', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  lineNumbers: "on",
                  tabSize: 2,
                  scrollbar: {
                    alwaysConsumeMouseWheel: false,
                    vertical: "auto",
                    horizontal: "auto",
                  },
                }}
              />
            </div>

            <div className={`h-full ${activeTab === "js" ? "block" : "hidden"}`}>
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={js}
                onChange={(v) => setJs(v || "")}
                options={{
                  fontSize: 13,
                  fontFamily: "'Fira Code', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  lineNumbers: "on",
                  tabSize: 2,
                  scrollbar: {
                    alwaysConsumeMouseWheel: false,
                    vertical: "auto",
                    horizontal: "auto",
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Live Preview & Console Area (Right/Bottom) */}
        <div className="flex flex-col bg-background overflow-hidden relative">
          {/* Live Preview Header */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Live Preview
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsFullscreen(true)}
                className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
                title="Fullscreen Workspace Preview"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Viewport-Level Reusable FullScreen Workspace */}
          <FullScreenWorkspace
            isOpen={isFullscreen}
            onClose={() => setIsFullscreen(false)}
            title="Live Code Playground Preview"
            badge="Full Viewport Preview"
          >
            <div className="flex-1 w-full h-full bg-white rounded-xl overflow-hidden relative shadow-2xl min-h-0">
              <iframe
                srcDoc={srcDoc}
                title="Full Viewport Preview"
                className="w-full h-full border-none bg-white"
                sandbox="allow-scripts allow-modals allow-same-origin"
              />
            </div>
          </FullScreenWorkspace>

          {/* Inline IFrame Preview */}
          <div className="flex-1 bg-white relative">
            <iframe
              ref={previewFrameRef}
              srcDoc={srcDoc}
              title="Preview"
              className="w-full h-full border-none bg-white"
              sandbox="allow-scripts allow-modals allow-same-origin"
            />
          </div>

          {/* Integrated Console Panel */}
          <div className="h-44 bg-slate-950 border-t border-border flex flex-col font-mono text-xs">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-border/40 text-muted-foreground font-semibold">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Console Log ({logs.length})</span>
              </div>
              <button
                onClick={clearConsole}
                className="p-1 hover:text-foreground rounded transition-colors flex items-center gap-1 text-[11px]"
                title="Clear Console Logs"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>

            <div className="flex-1 editor-scroll-area p-2.5 space-y-1">
              {logs.length === 0 ? (
                <div className="text-slate-600 italic py-2">
                  Console logs and runtime errors will appear here...
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-start gap-2 px-2 py-1 rounded leading-relaxed break-all ${
                      log.type === "error"
                        ? "bg-rose-950/40 text-rose-300 border-l-2 border-rose-500"
                        : log.type === "warn"
                        ? "bg-amber-950/40 text-amber-300 border-l-2 border-amber-500"
                        : log.type === "info"
                        ? "bg-sky-950/40 text-sky-300 border-l-2 border-sky-500"
                        : "text-slate-200 border-l-2 border-slate-600"
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 select-none pt-0.5">
                      {log.timestamp}
                    </span>
                    <span>{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
