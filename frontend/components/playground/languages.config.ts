export interface FAQItem {
  question: string;
  answer: string;
}

export interface LanguageConfig {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  extension: string;
  monacoLanguage: string;
  executionType: "client" | "server";
  supportsPreview: boolean;
  supportsConsole: boolean;
  supportsMultiTab: boolean; // HTML/CSS/JS multi-tab editing
  defaultCode: {
    html?: string;
    css?: string;
    js?: string;
    code?: string;
  };
  seo: {
    title: string;
    description: string;
    h1: string;
    keywords: string[];
  };
  content: {
    overview: string;
    howToUse: string[];
    features: string[];
    exampleSnippets: { name: string; description: string; code: string }[];
    faqs: FAQItem[];
  };
}

export const LANGUAGES: Record<string, LanguageConfig> = {
  html: {
    id: "html",
    name: "HTML5",
    slug: "html",
    iconName: "FileCode",
    extension: "html",
    monacoLanguage: "html",
    executionType: "client",
    supportsPreview: true,
    supportsConsole: true,
    supportsMultiTab: true,
    defaultCode: {
      html: `<div class="card">
  <h2>⚡ Interactive HTML5 Playground</h2>
  <p>Build, test, and render HTML, CSS, and JavaScript in real-time.</p>
  <button id="demo-btn">Click Me!</button>
</div>`,
      css: `body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0f172a;
  color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
}
.card {
  background: #1e293b;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.1);
  text-align: center;
}
h2 { color: #38bdf8; margin-top: 0; }
button {
  background: #0284c7;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease;
}
button:hover { background: #0369a1; transform: scale(1.05); }`,
      js: `const btn = document.getElementById('demo-btn');
btn.addEventListener('click', () => {
  console.log("Button clicked inside live HTML playground!");
  alert("Hello from HTML & JS Playground!");
});`,
    },
    seo: {
      title: "HTML5 Online Code Playground & Live Preview | TechWebCode",
      description: "Write, test, and render HTML5 markup online with instant live browser preview, CSS styling, and JavaScript console debugger.",
      h1: "HTML5 Online Code Playground & Live Preview",
      keywords: ["HTML playground", "online HTML editor", "HTML live preview", "HTML CSS JS playground"],
    },
    content: {
      overview: "TechWebCode's HTML5 Playground allows web developers to write, test, and render HTML structure, CSS stylesheets, and JavaScript scripts in a unified browser interface.",
      howToUse: [
        "Select the HTML, CSS, or JavaScript tabs to edit your code.",
        "Watch the Live Preview window update in real-time as you type.",
        "Inspect console logs and runtime error tracebacks in the integrated Terminal.",
        "Export your complete project as a standalone single-file `.html` document with one click.",
      ],
      features: [
        "100% Client-Side Browser Sandbox Execution.",
        "Monaco VS Code Editor with full syntax highlighting.",
        "Integrated JavaScript Console log & error interceptor.",
        "Export single-file HTML & instant clipboard copying.",
      ],
      exampleSnippets: [
        {
          name: "Responsive Glassmorphic Card",
          description: "Modern CSS glassmorphism UI card element with hover effects",
          code: `<div class="glass-card"><h1>Glassmorphic Card</h1></div>`,
        },
      ],
      faqs: [
        {
          question: "Is this HTML playground completely free?",
          answer: "Yes, TechWebCode's HTML Playground is 100% free with no sign-up or installation required.",
        },
        {
          question: "Does my HTML code run on your servers?",
          answer: "No. All HTML, CSS, and JavaScript rendering occurs 100% locally inside your web browser sandbox.",
        },
      ],
    },
  },

  css: {
    id: "css",
    name: "CSS3",
    slug: "css",
    iconName: "Palette",
    extension: "css",
    monacoLanguage: "css",
    executionType: "client",
    supportsPreview: true,
    supportsConsole: true,
    supportsMultiTab: true,
    defaultCode: {
      html: `<div class="container">
  <div class="box box-1">Flex 1</div>
  <div class="box box-2">Flex 2</div>
  <div class="box box-3">Flex 3</div>
</div>`,
      css: `body {
  margin: 0;
  background: #090d16;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.container {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #111827;
  border-radius: 12px;
}
.box {
  padding: 24px 32px;
  border-radius: 8px;
  color: white;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
.box-1 { background: linear-gradient(135deg, #6366f1, #4f46e5); }
.box-2 { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.box-3 { background: linear-gradient(135deg, #10b981, #059669); }`,
      js: `console.log("CSS Flexbox Layout initialized");`,
    },
    seo: {
      title: "CSS3 Online Playground & Live Layout Tester | TechWebCode",
      description: "Test CSS flexbox, grid, animations, and responsive layouts online with real-time browser preview and syntax completion.",
      h1: "CSS3 Online Playground & Live Layout Tester",
      keywords: ["CSS playground", "CSS flexbox tester", "online CSS editor", "live CSS preview"],
    },
    content: {
      overview: "Experiment with CSS Flexbox, Grid, keyframe animations, and custom CSS variables with live side-by-side browser preview.",
      howToUse: [
        "Write CSS styling rules directly into the CSS editor tab.",
        "Modify HTML markup to test layout responsiveness.",
        "Observe instant layout rendering in the Live Preview pane.",
      ],
      features: [
        "Live CSS auto-reload preview.",
        "Monaco editor code completion for CSS properties.",
        "Full CSS Grid & Flexbox visual testing.",
      ],
      exampleSnippets: [],
      faqs: [
        {
          question: "Can I test keyframe CSS animations?",
          answer: "Yes! All standard CSS3 animations and CSS transitions render smoothly in the live preview window.",
        },
      ],
    },
  },

  javascript: {
    id: "javascript",
    name: "JavaScript",
    slug: "javascript",
    iconName: "FileJson",
    extension: "js",
    monacoLanguage: "javascript",
    executionType: "client",
    supportsPreview: true,
    supportsConsole: true,
    supportsMultiTab: true,
    defaultCode: {
      html: `<div style="padding:20px; font-family:sans-serif; color:white; background:#0f172a; min-height:100vh;">
  <h2>JS Console Sandbox</h2>
  <p>Check the console window below to see output!</p>
</div>`,
      css: `body { margin: 0; }`,
      js: `// Interactive JavaScript Playground
const items = ["Go", "Python", "JavaScript", "Rust", "TypeScript"];

console.log("🚀 TechWebCode Multi-Language Playground Initialized!");
console.info("Available languages:", items.join(", "));

function calculateFibonacci(n) {
  if (n <= 1) return n;
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
}

const fibResult = calculateFibonacci(10);
console.log("Fibonacci(10) =", fibResult);`,
    },
    seo: {
      title: "JavaScript Online Playground & Console Sandbox | TechWebCode",
      description: "Execute JavaScript online in a sandbox environment with Monaco editor, live DOM preview, and integrated console logger.",
      h1: "JavaScript Online Playground & Console Sandbox",
      keywords: ["JavaScript playground", "online JS compiler", "JS console runner", "JS online editor"],
    },
    content: {
      overview: "Test modern JavaScript (ES6+), DOM operations, arrays, and algorithms with an integrated console logger and runtime error debugger.",
      howToUse: [
        "Write JavaScript code in the JS editor panel.",
        "Click Run or press Ctrl + Enter to execute.",
        "View console log outputs, warnings, and errors in the Console window.",
      ],
      features: [
        "ES6+ modern syntax support with autocomplete.",
        "Real-time console log, warn, and error interceptor.",
        "DOM manipulation support inside preview iframe.",
      ],
      exampleSnippets: [],
      faqs: [
        {
          question: "Supports ES6+ syntax like async/await?",
          answer: "Yes, modern ES6+ async/await, arrow functions, destructing, and Promises are fully supported.",
        },
      ],
    },
  },

  typescript: {
    id: "typescript",
    name: "TypeScript",
    slug: "typescript",
    iconName: "FileCode2",
    extension: "ts",
    monacoLanguage: "typescript",
    executionType: "client",
    supportsPreview: false,
    supportsConsole: true,
    supportsMultiTab: false,
    defaultCode: {
      code: `// TypeScript Online Playground & Type Checker
interface Developer {
  name: string;
  role: string;
  experienceYears: number;
  languages: string[];
}

function greetDeveloper(dev: Developer): string {
  return \`Hello \${dev.name}, \${dev.role} with \${dev.experienceYears} years of experience!\`;
}

const dev: Developer = {
  name: "Alex",
  role: "Senior Systems Engineer",
  experienceYears: 7,
  languages: ["TypeScript", "Go", "Rust"]
};

console.log(greetDeveloper(dev));
console.log("Active skills:", dev.languages.join(", "));`,
    },
    seo: {
      title: "TypeScript Online Compiler & Playground | TechWebCode",
      description: "Write, check types, and run TypeScript code 100% in your browser. Monaco editor with strict type checking, zero server latency, and instant console output.",
      h1: "TypeScript Online Compiler & Playground",
      keywords: ["TypeScript playground", "online TypeScript compiler", "TS type checker", "TypeScript sandbox", "in-browser TypeScript"],
    },
    content: {
      overview: "Write strongly-typed TypeScript code, test interface definitions, generics, and execute TypeScript directly in your browser with 100% Client-Side In-Browser execution.",
      howToUse: [
        "Write TypeScript code using full type syntax, interfaces, and generics.",
        "Inspect Monaco editor inline type errors and autocomplete recommendations in real-time.",
        "Click Run or press Ctrl + Enter to transpile and execute client-side with zero server roundtrips.",
      ],
      features: [
        "100% Client-Side In-Browser Execution with zero server roundtrips.",
        "Monaco VS Code type inference and error highlighting.",
        "Strict mode type checking support with instant transpile.",
        "Console log interceptor & formatted object inspector.",
      ],
      exampleSnippets: [],
      faqs: [
        {
          question: "Does it check interface types in real-time?",
          answer: "Yes, Monaco provides instant red squiggle type checking for type mismatches directly in the editor.",
        },
      ],
    },
  },

  python: {
    id: "python",
    name: "Python 3",
    slug: "python",
    iconName: "Code",
    extension: "py",
    monacoLanguage: "python",
    executionType: "client",
    supportsPreview: false,
    supportsConsole: true,
    supportsMultiTab: false,
    defaultCode: {
      code: `def greet_developer(name):
    return f"Hello, {name}! Welcome to TechWebCode."

print(greet_developer("TechWebCode User"))`,
    },
    seo: {
      title: "Python 3 Online Compiler & Playground | TechWebCode",
      description: "Write, run, and test Python 3 code online with TechWebCode's client-side WebAssembly Python compiler. Monaco editor, zero server roundtrips, instant execution.",
      h1: "Python 3 Online Compiler & Playground",
      keywords: ["Python online compiler", "Python playground", "online Python 3 runner", "Python WebAssembly", "Pyodide playground"],
    },
    content: {
      overview: "TechWebCode's Python 3 Playground runs 100% inside your browser using WebAssembly (Pyodide v0.26). Zero server roundtrips, private memory execution, and instant latency.",
      howToUse: [
        "Type or paste your Python 3 script into the code editor.",
        "Click the Run button or press Ctrl + Enter to execute in browser WebAssembly.",
        "Inspect standard output (stdout), stderr, and runtime exceptions in the Terminal window.",
      ],
      features: [
        "100% Client-Side WebAssembly (Pyodide v0.26) execution.",
        "Zero server roundtrips & zero latency private execution.",
        "Python 3 syntax highlighting and auto-indentation.",
        "Standard library functions and data structures support.",
        "Instant code snippet execution & terminal logging.",
      ],
      exampleSnippets: [],
      faqs: [
        {
          question: "Do I need to install Python on my machine?",
          answer: "No! The compiler runs entirely online without any local software installation.",
        },
        {
          question: "Which Python version is supported?",
          answer: "TechWebCode supports standard Python 3.11+ syntax.",
        },
      ],
    },
  },

  java: {
    id: "java",
    name: "Java",
    slug: "java",
    iconName: "Coffee",
    extension: "java",
    monacoLanguage: "java",
    executionType: "client",
    supportsPreview: false,
    supportsConsole: true,
    supportsMultiTab: false,
    defaultCode: {
      code: `// Java Online Compiler & Execution Sandbox
import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        System.out.println("TechWebCode Java Online Compiler");
        System.out.println("==================================");
        
        List<String> techStack = Arrays.asList("Java 21", "Spring Boot", "Docker", "Kubernetes", "MySQL");
        System.out.println("Core Enterprise Stack:");
        
        for (int i = 0; i < techStack.size(); i++) {
            System.out.printf("  %d. %s%n", i + 1, techStack.get(i));
        }

        int n = 10;
        System.out.println("\\nFactorial of " + n + " = " + factorial(n));
    }

    private static long factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
}`,
    },
    seo: {
      title: "Java Online Compiler & In-Browser Execution Sandbox | TechWebCode",
      description: "Write, compile, and run Java code 100% in your browser. Monaco editor with Java class syntax highlighting, zero server latency, and instant terminal output.",
      h1: "Java Online Compiler & Execution Sandbox",
      keywords: ["Java online compiler", "Java IDE online", "run Java code online", "Java playground", "in-browser Java"],
    },
    content: {
      overview: "Write, compile, and execute Java programs directly in your browser with 100% Client-Side In-Browser execution without setting up JDK or IDE configurations locally.",
      howToUse: [
        "Write your Java class with a `public static void main(String[] args)` entry point.",
        "Click Run or press Ctrl + Enter to compile and execute inside your browser.",
        "View compiled console output and JVM diagnostics in the terminal output pane.",
      ],
      features: [
        "100% Client-Side In-Browser Execution with zero server roundtrips.",
        "Full Java OOP class structure & method recursion support.",
        "Java Standard Library utility packages (`Arrays`, `List`, `System.out.printf`).",
        "Instant execution diagnostics and runtime traceback reporting.",
      ],
      exampleSnippets: [],
      faqs: [
        {
          question: "Can I define custom classes in Java?",
          answer: "Yes, you can define helper classes within the same file or as nested static classes.",
        },
      ],
    },
  },

  c: {
    id: "c",
    name: "C Language",
    slug: "c",
    iconName: "Cpu",
    extension: "c",
    monacoLanguage: "c",
    executionType: "client",
    supportsPreview: false,
    supportsConsole: true,
    supportsMultiTab: false,
    defaultCode: {
      code: `/* C Language Online Compiler */
#include <stdio.h>

void print_header() {
    printf("TechWebCode C Online Compiler\\n");
    printf("==================================\\n");
}

int main() {
    print_header();

    int numbers[] = {10, 20, 30, 40, 50};
    int count = sizeof(numbers) / sizeof(numbers[0]);
    int sum = 0;

    printf("Array Elements:\\n");
    for (int i = 0; i < count; i++) {
        printf("  Element[%d] = %d\\n", i, numbers[i]);
        sum += numbers[i];
    }

    printf("\\nTotal Sum = %d\\n", sum);
    printf("Average = %.2f\\n", (float)sum / count);

    return 0;
}`,
    },
    seo: {
      title: "C Online Compiler & In-Browser Code Runner | TechWebCode",
      description: "Write, compile, and execute C language programs 100% in your browser. Fast C code runner with Monaco editor, zero server latency, and instant GCC-standard feedback.",
      h1: "C Online Compiler & Code Runner",
      keywords: ["C online compiler", "online C runner", "C playground", "in-browser C compiler", "C WebAssembly"],
    },
    content: {
      overview: "Compile and test C language code directly in your browser with 100% Client-Side In-Browser execution. Test pointers, arrays, memory operations, and C standard library functions.",
      howToUse: [
        "Write standard C code containing `int main()`.",
        "Click Run or press Ctrl + Enter to build and execute instantly.",
        "Review compiler diagnostics and standard stdout in the terminal output.",
      ],
      features: [
        "100% Client-Side In-Browser C AST Compiler Engine.",
        "Zero server roundtrips with instant execution in browser memory.",
        "Standard C library headers (`stdio.h`, `stdlib.h`, `string.h`, `math.h`).",
        "Exit code detection and formatted terminal diagnostics.",
      ],
      exampleSnippets: [],
      faqs: [
        {
          question: "Supports stdio and math libraries?",
          answer: "Yes, standard C library headers are fully supported.",
        },
      ],
    },
  },

  cpp: {
    id: "cpp",
    name: "C++",
    slug: "cpp",
    iconName: "Terminal",
    extension: "cpp",
    monacoLanguage: "cpp",
    executionType: "client",
    supportsPreview: false,
    supportsConsole: true,
    supportsMultiTab: false,
    defaultCode: {
      code: `// C++ Online Compiler & STL Playground
#include <iostream>
using namespace std;

int main() {
    cout << "TechWebCode C++ Online Compiler" << endl;
    cout << "==================================" << endl;

    char features[][30] = {"Classes & Objects", "Pointers & References", "Templates", "High Performance"};
    int count = 4;
    cout << "\\nKey C++ Features:" << endl;
    for (int i = 0; i < count; i++) {
        cout << "  - " << features[i] << endl;
    }

    int nums[] = {5, 2, 9, 1, 7, 3};
    int n = 6;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (nums[j] > nums[j + 1]) {
                int temp = nums[j];
                nums[j] = nums[j + 1];
                nums[j + 1] = temp;
            }
        }
    }

    cout << "\\nSorted Numbers: ";
    for (int i = 0; i < n; i++) cout << nums[i] << " ";
    cout << endl;

    return 0;
}`,
    },
    seo: {
      title: "C++ Online Compiler & In-Browser STL Playground | TechWebCode",
      description: "Write, compile, and run C++ code 100% in your browser. Modern C++ with Monaco editor, zero server latency, and instant terminal feedback.",
      h1: "C++ Online Compiler & STL Playground",
      keywords: ["C++ online compiler", "online C++ runner", "C++ STL playground", "in-browser C++"],
    },
    content: {
      overview: "Write and execute C++ programs directly in your browser with 100% Client-Side In-Browser execution. Supports classes, pointers, loops, functions, and iostream.",
      howToUse: [
        "Write C++ code using `#include <iostream>` and `cout`.",
        "Click Run or press Ctrl + Enter to compile and execute instantly.",
        "Inspect standard output and compiler diagnostics in the output pane.",
      ],
      features: [
        "100% Client-Side In-Browser C++ Engine with zero server roundtrips.",
        "Standard iostream `cout`, `cin`, loops, functions, and arrays.",
        "Instant compiler error reporting with line and column diagnostics.",
        "Private local code execution in browser RAM.",
      ],
      exampleSnippets: [],
      faqs: [
        {
          question: "Supports C++ iostream and loops?",
          answer: "Yes! `std::cout`, `std::endl`, loops, and standard C++ constructs work seamlessly.",
        },
      ],
    },
  },

  go: {
    id: "go",
    name: "Go (Golang)",
    slug: "go",
    iconName: "Zap",
    extension: "go",
    monacoLanguage: "go",
    executionType: "client",
    supportsPreview: false,
    supportsConsole: true,
    supportsMultiTab: false,
    defaultCode: {
      code: `package main

import "fmt"

func main() {
    fmt.Println("Hello, TechWebCode Gopher!")
}`,
    },
    seo: {
      title: "Go (Golang) Online Compiler & Playground | TechWebCode",
      description: "Write, compile, and run Go (Golang) code 100% in your browser using WebAssembly. Instant execution, zero server roundtrips, and private execution.",
      h1: "Go (Golang) Online Compiler & Playground",
      keywords: ["Go online compiler", "Golang playground", "run Go code online", "Go WebAssembly", "Yaegi WASM"],
    },
    content: {
      overview: "Compile and execute Go code directly in your browser with 100% Client-Side WebAssembly. Powered by the Yaegi Go WebAssembly engine with zero server latency.",
      howToUse: [
        "Write Go code with `package main` and `func main()`.",
        "Click Run or press Ctrl + Enter to interpret and execute inside browser WebAssembly.",
        "View stdout, stderr, and runtime error diagnostics in the terminal.",
      ],
      features: [
        "100% Client-Side WebAssembly (Yaegi WASM) execution.",
        "Zero server roundtrips & zero latency private execution.",
        "Standard Go packages (`fmt`, `time`, `strings`, `math`, `encoding/json`).",
        "Instant compiler error reporting and runtime diagnostics.",
      ],
      exampleSnippets: [],
      faqs: [
        {
          question: "Can I test goroutines and channels in Golang?",
          answer: "Yes! Concurrency with goroutines and channels executes seamlessly in the Go playground.",
        },
      ],
    },
  },

  php: {
    id: "php",
    name: "PHP",
    slug: "php",
    iconName: "Globe",
    extension: "php",
    monacoLanguage: "php",
    executionType: "client",
    supportsPreview: false,
    supportsConsole: true,
    supportsMultiTab: false,
    defaultCode: {
      code: `<?php
// PHP Online Compiler & Script Runner
echo "TechWebCode PHP Online Playground\\n";
echo "====================================\\n\\n";

$frameworks = [
    "Laravel" => "Enterprise Web Framework",
    "Symfony" => "Modular PHP Components",
    "WordPress" => "Content Management System",
];

echo "Popular PHP Frameworks:\\n";
foreach ($frameworks as $name => $desc) {
    echo "  - {$name}: {$desc}\\n";
}

$user = [
    "name" => "Developer",
    "status" => "Active",
    "joined" => date("Y-m-d H:i:s")
];

echo "\\nJSON Export Example:\\n";
echo json_encode($user, JSON_PRETTY_PRINT) . "\\n";
`,
    },
    seo: {
      title: "PHP Online Compiler & In-Browser Script Runner | TechWebCode",
      description: "Write, execute, and test PHP scripts 100% in your browser. Monaco editor with PHP syntax formatting, zero server latency, and instant stdout output.",
      h1: "PHP Online Compiler & Script Runner",
      keywords: ["PHP online compiler", "PHP runner online", "PHP playground", "test PHP code online", "in-browser PHP"],
    },
    content: {
      overview: "Write and execute PHP scripts directly in your browser with 100% Client-Side In-Browser execution without requiring a local web server or Apache/Nginx configuration.",
      howToUse: [
        "Write PHP code starting with `<?php` tag.",
        "Click Run or press Ctrl + Enter to execute the in-browser PHP engine.",
        "Inspect output string, array iterations, and JSON encodings in the terminal.",
      ],
      features: [
        "100% Client-Side In-Browser PHP Execution Engine with zero latency.",
        "PHP 8.2+ modern syntax and associative array manipulation.",
        "Built-in JSON encoding/decoding, string utilities, and date functions.",
        "Private execution running strictly inside browser memory.",
      ],
      exampleSnippets: [],
      faqs: [
        {
          question: "Which PHP features are supported?",
          answer: "The playground supports variables, associative arrays, loops (foreach, for, while), functions, JSON formatting, and core PHP built-in functions.",
        },
      ],
    },
  },

  rust: {
    id: "rust",
    name: "Rust",
    slug: "rust",
    iconName: "Shield",
    extension: "rs",
    monacoLanguage: "rust",
    executionType: "client",
    supportsPreview: false,
    supportsConsole: true,
    supportsMultiTab: false,
    defaultCode: {
      code: `// Rust Online Compiler & Memory Safety Sandbox
fn main() {
    println!("TechWebCode Rust Online Playground");
    println!("==================================");

    let languages = vec!["Rust", "Go", "TypeScript", "C++"];
    println!("Languages vector: {:?}", languages);

    let sum: i32 = (1..=10).sum();
    println!("Sum of numbers 1 to 10 = {}", sum);

    match calculate_status(100) {
        Ok(msg) => println!("Success: {}", msg),
        Err(e) => println!("Error: {}", e),
    }
}

fn calculate_status(score: u32) -> Result<String, &'static str> {
    if score >= 50 {
        Ok(format!("Passed with score {}", score))
    } else {
        Err("Score below passing threshold")
    }
}`,
    },
    seo: {
      title: "Rust Online Compiler & In-Browser Memory Sandbox | TechWebCode",
      description: "Write, compile, and run Rust code 100% in your browser. Monaco editor with Rust syntax highlighting, pattern matching, zero server latency, and instant feedback.",
      h1: "Rust Online Compiler & Memory Sandbox",
      keywords: ["Rust online compiler", "Rust playground", "run Rust online", "in-browser Rust", "Rust WebAssembly"],
    },
    content: {
      overview: "Compile and execute Rust programs directly in your browser with 100% Client-Side In-Browser execution. Test functions, pattern matching, vectors, ranges, and Result types.",
      howToUse: [
        "Write Rust code containing `fn main()`.",
        "Click Run or press Ctrl + Enter to execute inside browser RAM.",
        "Inspect standard stdout and pattern matching results in the terminal output.",
      ],
      features: [
        "100% Client-Side In-Browser Rust Sandbox with zero server roundtrips.",
        "Pattern matching (`match`, `Ok`, `Err`, `Some`, `None`) support.",
        "Vector macros (`vec![]`), ranges, iterators, and formatting specifiers.",
        "Instant execution diagnostics with zero latency and complete privacy.",
      ],
      exampleSnippets: [],
      faqs: [
        {
          question: "Does it test Rust pattern matching and Result types?",
          answer: "Yes! Rust pattern matching, Result (`Ok`/`Err`), and Option types execute smoothly in browser memory.",
        },
      ],
    },
  },

  sql: {
    id: "sql",
    name: "SQL (SQLite)",
    slug: "sql",
    iconName: "Database",
    extension: "sql",
    monacoLanguage: "sql",
    executionType: "client",
    supportsPreview: false,
    supportsConsole: true,
    supportsMultiTab: false,
    defaultCode: {
      code: `-- ⚡ TechWebCode SQL Online Compiler (SQLite WebAssembly)
-- 100% Client-Side In-Browser Execution | Zero Latency | Private

CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    role TEXT NOT NULL,
    salary INTEGER NOT NULL,
    hired_year INTEGER NOT NULL
);

INSERT INTO employees (name, department, role, salary, hired_year) VALUES
('Rajat Singh', 'Engineering', 'Staff Architect', 185000, 2021),
('Sophia Chen', 'Engineering', 'Senior Backend Engineer', 160000, 2022),
('Marcus Vance', 'Product', 'Principal PM', 155000, 2020),
('Elena Rostova', 'Design', 'Lead UI/UX Designer', 140000, 2023),
('Aarav Patel', 'Engineering', 'Fullstack Engineer', 135000, 2023),
('Chloe Dubois', 'Marketing', 'Growth Lead', 125000, 2022);

-- Query 1: Department statistics with aggregates
SELECT 
    department,
    COUNT(*) AS total_staff,
    PRINTF('$%d', AVG(salary)) AS avg_salary,
    PRINTF('$%d', MAX(salary)) AS max_salary
FROM employees
GROUP BY department
ORDER BY AVG(salary) DESC;

-- Query 2: Senior engineering talent
SELECT 
    id,
    name,
    role,
    PRINTF('$%d', salary) AS compensation,
    hired_year
FROM employees
WHERE department = 'Engineering' AND salary >= 140000
ORDER BY salary DESC;`,
    },
    seo: {
      title: "SQL Online Compiler & SQLite Playground | TechWebCode",
      description: "Run SQL queries online with 100% in-browser SQLite WebAssembly. Instant table rendering, zero server roundtrips, and private execution.",
      h1: "SQL Online Compiler & SQLite Playground",
      keywords: ["SQL online compiler", "SQL playground", "SQLite WebAssembly", "run SQL online", "online SQL editor", "in-browser SQL"],
    },
    content: {
      overview: "Write, test, and execute SQL queries directly in your browser with 100% Client-Side WebAssembly (SQLite WASM). Create tables, insert records, run multi-table joins, and aggregate functions with instant tabular output.",
      howToUse: [
        "Write your SQL DDL schema statements (`CREATE TABLE`, `INSERT INTO`) or query scripts (`SELECT`, `JOIN`, `GROUP BY`).",
        "Click the Run button or press Ctrl + Enter to execute against SQLite in browser RAM.",
        "Inspect formatted ASCII table query results, affected row counts, and syntax diagnostics in the terminal.",
      ],
      features: [
        "100% Client-Side WebAssembly (SQLite WASM) execution.",
        "Zero server roundtrips & zero latency private memory execution.",
        "Formatted tabular CLI output for single and multiple `SELECT` result sets.",
        "Full support for ANSI SQL & SQLite dialect (aggregates, subqueries, CTEs, window functions).",
      ],
      exampleSnippets: [],
      faqs: [
        {
          question: "Does my SQL code or database get uploaded to any server?",
          answer: "No! The entire SQLite database engine runs inside your web browser RAM using WebAssembly. Your data never leaves your device.",
        },
        {
          question: "Can I run multiple SELECT queries at once?",
          answer: "Yes, TechWebCode executes your entire SQL script sequentially and formats all query results into clean terminal tables.",
        },
      ],
    },
  },
};

export const DEFAULT_LANGUAGE_SLUG = "html";

export function getLanguageConfig(slug: string): LanguageConfig {
  const normalized = (slug || "").toLowerCase().trim();
  return LANGUAGES[normalized] || LANGUAGES[DEFAULT_LANGUAGE_SLUG];
}
