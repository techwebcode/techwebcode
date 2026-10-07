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
    executionType: "server",
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
      description: "Write, check types, and run TypeScript code online with Monaco editor, strict type checking, and instant console output.",
      h1: "TypeScript Online Compiler & Playground",
      keywords: ["TypeScript playground", "online TypeScript compiler", "TS type checker", "TypeScript sandbox"],
    },
    content: {
      overview: "Write strongly-typed TypeScript code, test interface definitions, generics, and type safety features online.",
      howToUse: [
        "Write TypeScript code using full type syntax.",
        "Inspect Monaco editor inline type errors and autocomplete recommendations.",
        "Click Run to execute type-checked code and view output.",
      ],
      features: [
        "Monaco VS Code type inference and error highlighting.",
        "Strict mode type checking support.",
        "Instant code snippet execution and log output.",
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
      code: `# Python 3 Online Compiler & Playground
def greet_developer(name, role="Fullstack Engineer"):
    return f"Welcome, {name}! Role: {role}"

# Data structures demonstration
skills = ["Python 3", "Go", "Docker", "PostgreSQL", "Next.js"]

print("⚡ TechWebCode Python Playground")
print(greet_developer("Rajat"))
print("\\nFeatured Skill Set:")

for idx, skill in enumerate(skills, 1):
    print(f"  {idx}. {skill}")

# Math computation example
def fibonacci(n):
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result

print("\\nFirst 10 Fibonacci Numbers:", fibonacci(10))`,
    },
    seo: {
      title: "Python 3 Online Compiler & Playground | TechWebCode",
      description: "Write, run, and test Python 3 code online with TechWebCode's free Python compiler. Monaco editor, zero installation, instant execution output.",
      h1: "Python 3 Online Compiler & Playground",
      keywords: ["Python online compiler", "Python playground", "online Python 3 runner", "Python IDE online"],
    },
    content: {
      overview: "TechWebCode's Python 3 Online Compiler allows software developers, students, and engineers to write, run, and debug Python code instantly in their browser.",
      howToUse: [
        "Type or paste your Python 3 script into the code editor.",
        "Click the Run button or press Ctrl + Enter to execute.",
        "Inspect standard output (stdout) and runtime exception logs in the Terminal window.",
      ],
      features: [
        "Python 3 syntax highlighting and auto-indentation.",
        "Standard library functions and data structures support.",
        "Instant code snippet execution & error logging.",
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
    executionType: "server",
    supportsPreview: false,
    supportsConsole: true,
    supportsMultiTab: false,
    defaultCode: {
      code: `// Java Online Compiler & Execution Sandbox
import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        System.out.println("⚡ TechWebCode Java Online Compiler");
        
        List<String> techStack = Arrays.asList("Java 21", "Spring Boot", "Docker", "Kubernetes", "MySQL");
        System.out.println("Core Enterprise Stack:");
        
        for (int i = 0; i < techStack.size(); i++) {
            System.out.printf("  %d. %s%n", i + 1, techStack.get(i));
        }

        int n = 10;
        System.out.println("\nFactorial of " + n + " = " + factorial(n));
    }

    private static long factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
}`,
    },
    seo: {
      title: "Java Online Compiler & Execution Sandbox | TechWebCode",
      description: "Write, compile, and run Java code online in your browser. Monaco editor with Java class syntax highlighting and instant terminal output.",
      h1: "Java Online Compiler & Execution Sandbox",
      keywords: ["Java online compiler", "Java IDE online", "run Java code online", "Java playground"],
    },
    content: {
      overview: "Write, compile, and execute Java programs online without setting up JDK or IDE configurations locally.",
      howToUse: [
        "Write your Java class with a `public static void main(String[] args)` entry point.",
        "Click Run to compile and execute.",
        "View compiled console output and JVM exception stack traces in the output pane.",
      ],
      features: [
        "Full Java OOP class structure support.",
        "Java Standard Library utility packages support.",
        "Detailed compiler syntax error reporting.",
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
    executionType: "server",
    supportsPreview: false,
    supportsConsole: true,
    supportsMultiTab: false,
    defaultCode: {
      code: `/* C Language Online Compiler */
#include <stdio.h>

void print_header() {
    printf("⚡ TechWebCode C Online Compiler\\n");
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
      title: "C Online Compiler & Code Runner | TechWebCode",
      description: "Write, compile, and execute C language programs online. Fast C code runner with Monaco editor and GCC compilation feedback.",
      h1: "C Online Compiler & Code Runner",
      keywords: ["C online compiler", "online C runner", "C playground", "GCC compiler online"],
    },
    content: {
      overview: "Compile and test C language code online. Test pointers, structs, arrays, memory management, and C standard library functions.",
      howToUse: [
        "Write standard C code containing `int main()`.",
        "Click Run to build and execute.",
        "Review compiler warnings and stdout in the terminal output.",
      ],
      features: [
        "GCC-compatible C compiler runtime setup.",
        "C standard library headers (`stdio.h`, `stdlib.h`, `string.h`) support.",
        "Memory pointers and memory allocation testing.",
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
    executionType: "server",
    supportsPreview: false,
    supportsConsole: true,
    supportsMultiTab: false,
    defaultCode: {
      code: `// C++20 Online Compiler & STL Playground
#include <iostream>
#include <vector>
#include <string>
#include <numeric>
#include <algorithm>

int main() {
    std::cout << "⚡ TechWebCode C++ Online Compiler" << std::endl;

    std::vector<std::string> features = {"STL Vectors", "Lambda Functions", "Smart Pointers", "Templates"};
    std::cout << "\nKey C++ Features:" << std::endl;
    for (const auto& feature : features) {
        std::cout << "  - " << feature << std::endl;
    }

    std::vector<int> nums = {5, 2, 9, 1, 7, 3};
    std::sort(nums.begin(), nums.end());

    std::cout << "\nSorted Numbers: ";
    for (int n : nums) std::cout << n << " ";
    std::cout << std::endl;

    return 0;
}`,
    },
    seo: {
      title: "C++ Online Compiler & STL Playground | TechWebCode",
      description: "Write, compile, and run C++ code online with modern C++20 STL support, Monaco editor, and instant terminal feedback.",
      h1: "C++ Online Compiler & STL Playground",
      keywords: ["C++ online compiler", "online C++ runner", "C++ STL playground", "g++ online"],
    },
    content: {
      overview: "Write and execute C++ programs with Standard Template Library (STL) vectors, algorithms, smart pointers, and templates.",
      howToUse: [
        "Write modern C++ code using `#include <iostream>`.",
        "Click Run to compile with g++.",
        "Inspect standard output and compiler errors.",
      ],
      features: [
        "Modern C++20 standard compiler syntax.",
        "Full C++ Standard Template Library (STL) support.",
        "Fast compilation & instant execution feedback.",
      ],
      exampleSnippets: [],
      faqs: [
        {
          question: "Supports C++ STL vector and map?",
          answer: "Yes! `std::vector`, `std::map`, `std::unordered_map`, `std::algorithm` and other STL utilities work seamlessly.",
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
    executionType: "server",
    supportsPreview: false,
    supportsConsole: true,
    supportsMultiTab: false,
    defaultCode: {
      code: `// Go (Golang) Online Compiler & Playground
package main

import (
	"fmt"
	"time"
)

type Server struct {
	Name string
	Port int
}

func (s Server) String() string {
	return fmt.Sprintf("Server %s listening on port %d", s.Name, s.Port)
}

func main() {
	fmt.Println("⚡ TechWebCode Go Online Playground")

	s := Server{Name: "TechWebCode API", Port: 8080}
	fmt.Println(s)

	fmt.Println("\nGoroutine Concurrency Test:")
	ch := make(chan string)

	go func() {
		time.Sleep(100 * time.Millisecond)
		ch <- "Message received from concurrent goroutine! 🚀"
	}()

	msg := <-ch
	fmt.Println(msg)
}`,
    },
    seo: {
      title: "Go (Golang) Online Compiler & Playground | TechWebCode",
      description: "Write, compile, and run Go (Golang) code online. Fast Go playground with goroutine concurrency testing and Monaco editor.",
      h1: "Go (Golang) Online Compiler & Playground",
      keywords: ["Go online compiler", "Golang playground", "run Go code online", "Go language runner"],
    },
    content: {
      overview: "Compile and test Go (Golang) code online. Test structs, methods, goroutines, channels, and Go standard library packages.",
      howToUse: [
        "Write Go code with `package main` and `func main()`.",
        "Click Run to compile with `go run`.",
        "View stdout and runtime panic stack traces in the terminal.",
      ],
      features: [
        "Go 1.22+ runtime compilation.",
        "Goroutine and channel concurrency support.",
        "Standard Go packages (`fmt`, `time`, `strings`, `encoding/json`).",
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
    executionType: "server",
    supportsPreview: false,
    supportsConsole: true,
    supportsMultiTab: false,
    defaultCode: {
      code: `<?php
// PHP Online Compiler & Script Runner
echo "⚡ TechWebCode PHP Online Playground\\n";
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
      title: "PHP Online Compiler & Script Runner | TechWebCode",
      description: "Write, execute, and test PHP scripts online. Monaco editor with PHP syntax formatting and instant stdout CLI output.",
      h1: "PHP Online Compiler & Script Runner",
      keywords: ["PHP online compiler", "PHP runner online", "PHP playground", "test PHP code online"],
    },
    content: {
      overview: "Write and execute PHP scripts online without requiring a local web server or Apache/Nginx configuration.",
      howToUse: [
        "Write PHP code starting with `<?php` tag.",
        "Click Run to execute the PHP CLI interpreter.",
        "Inspect output string, array prints, and JSON encodings.",
      ],
      features: [
        "PHP 8.2+ modern syntax support.",
        "JSON manipulation and string manipulation functions.",
        "Clean CLI output formatting.",
      ],
      exampleSnippets: [],
      faqs: [
        {
          question: "Which PHP version is running?",
          answer: "The playground uses modern PHP 8.2+ syntax.",
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
    executionType: "server",
    supportsPreview: false,
    supportsConsole: true,
    supportsMultiTab: false,
    defaultCode: {
      code: `// Rust Online Compiler & Memory Safety Sandbox
fn main() {
    println!("⚡ TechWebCode Rust Online Playground");

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
      title: "Rust Online Compiler & Memory Sandbox | TechWebCode",
      description: "Write, compile, and run Rust code online with rustc compiler safety checks, Monaco editor, and instant terminal feedback.",
      h1: "Rust Online Compiler & Memory Sandbox",
      keywords: ["Rust online compiler", "Rust playground", "run Rust online", "rustc compiler online"],
    },
    content: {
      overview: "Compile and execute Rust programs online. Test borrow checker rules, ownership, pattern matching, structs, and Result types.",
      howToUse: [
        "Write Rust code containing `fn main()`.",
        "Click Run to build with `rustc`.",
        "Inspect borrow checker compiler errors or standard stdout.",
      ],
      features: [
        "Rust edition 2021 compiler support.",
        "Borrow checker error messages and type checking.",
        "Pattern matching and memory safety analysis.",
      ],
      exampleSnippets: [],
      faqs: [
        {
          question: "Does it test Rust memory safety and ownership?",
          answer: "Yes! The Rust compiler (`rustc`) checks ownership rules and reports memory lifetime errors in detail.",
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
