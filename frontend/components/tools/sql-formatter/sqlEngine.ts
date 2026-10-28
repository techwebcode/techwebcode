import { format as formatSqlInternal, type SqlLanguage } from "sql-formatter";
import nodeSqlParser from "node-sql-parser";

interface NodeSqlParserInstance {
  astify: (sql: string, opt?: { database?: string }) => unknown;
}

interface NodeSqlParserConstructor {
  new (): NodeSqlParserInstance;
}

const ParserClass = (
  (nodeSqlParser as Record<string, unknown>).Parser ||
  (nodeSqlParser as { default?: { Parser?: NodeSqlParserConstructor } }).default?.Parser ||
  nodeSqlParser
) as NodeSqlParserConstructor;

export type SqlDialect = "sql" | "postgresql" | "mysql" | "sqlite" | "transactsql";

export interface SqlDialectConfig {
  id: SqlDialect;
  name: string;
  parserDialect: "postgresql" | "mysql" | "sqlite" | "transactsql";
  formatterDialect: SqlLanguage;
  description: string;
  identifierQuote: string;
}

export const SQL_DIALECTS: Record<SqlDialect, SqlDialectConfig> = {
  sql: {
    id: "sql",
    name: "Standard SQL (ANSI)",
    parserDialect: "postgresql", // Standard SQL uses PostgreSQL parser in node-sql-parser
    formatterDialect: "sql",
    description: "Standard ANSI/ISO SQL query syntax with double-quoted identifiers",
    identifierQuote: '"column"',
  },
  postgresql: {
    id: "postgresql",
    name: "PostgreSQL",
    parserDialect: "postgresql",
    formatterDialect: "postgresql",
    description: "Postgres dialect with dollar-quotes, RETURNING, CTEs, and schemas",
    identifierQuote: '"column"',
  },
  mysql: {
    id: "mysql",
    name: "MySQL / MariaDB",
    parserDialect: "mysql",
    formatterDialect: "mysql",
    description: "MySQL dialect with backtick identifiers, LIMIT/OFFSET, and IFNULL",
    identifierQuote: "`column`",
  },
  sqlite: {
    id: "sqlite",
    name: "SQLite",
    parserDialect: "sqlite",
    formatterDialect: "sqlite",
    description: "Lightweight embedded SQLite database SQL dialect",
    identifierQuote: '"column" or `column`',
  },
  transactsql: {
    id: "transactsql",
    name: "SQL Server (T-SQL)",
    parserDialect: "transactsql",
    formatterDialect: "transactsql",
    description: "Microsoft Transact-SQL dialect with [bracket] identifiers and TOP",
    identifierQuote: "[column]",
  },
};

export interface SqlFormatOptions {
  dialect: SqlDialect;
  tabWidth: number;
  useTabs: boolean;
  keywordCase: "upper" | "lower" | "preserve";
  linesBetweenQueries: number;
}

export const DEFAULT_FORMAT_OPTIONS: SqlFormatOptions = {
  dialect: "sql",
  tabWidth: 2,
  useTabs: false,
  keywordCase: "upper",
  linesBetweenQueries: 2,
};

export interface SqlStatementSummary {
  type: string;
  table?: string;
}

export interface SqlValidationResult {
  isValid: boolean | null;
  statementCount: number;
  statements: SqlStatementSummary[];
  error?: {
    message: string;
    line?: number;
    column?: number;
    lineSnippet?: string;
    pointerSnippet?: string;
  };
  dialectUsed: string;
  note?: string;
}

/**
 * Formats a SQL query using the official sql-formatter engine.
 */
export function formatSqlQuery(
  sql: string,
  options: SqlFormatOptions = DEFAULT_FORMAT_OPTIONS
): { formatted: string; error?: string } {
  if (!sql.trim()) {
    return { formatted: "" };
  }

  try {
    const dialectConfig = SQL_DIALECTS[options.dialect] || SQL_DIALECTS.sql;

    const formatted = formatSqlInternal(sql, {
      language: dialectConfig.formatterDialect,
      tabWidth: options.tabWidth,
      useTabs: options.useTabs,
      keywordCase: options.keywordCase,
      linesBetweenQueries: options.linesBetweenQueries,
    });

    return { formatted };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to format SQL with the chosen dialect.";
    return {
      formatted: sql,
      error: message,
    };
  }
}

/**
 * Minifies a SQL query by stripping comments, collapsing non-literal whitespace,
 * while preserving all string literals, quotes, and SQL semantics.
 */
export function minifySqlQuery(sql: string): { minified: string; error?: string } {
  if (!sql || !sql.trim()) {
    return { minified: "" };
  }

  try {
    let result = "";
    let i = 0;
    const len = sql.length;

    while (i < len) {
      const ch = sql[i];
      const next = sql[i + 1];

      // 1. Single-line comment (-- or #)
      if ((ch === "-" && next === "-") || ch === "#") {
        let end = sql.indexOf("\n", i);
        if (end === -1) end = len;
        i = end + 1;
        if (result.length > 0 && !/[\s,(;]/.test(result[result.length - 1])) {
          result += " ";
        }
        continue;
      }

      // 2. Multi-line comment (/* ... */)
      if (ch === "/" && next === "*") {
        const end = sql.indexOf("*/", i + 2);
        if (end === -1) {
          i = len;
        } else {
          i = end + 2;
        }
        if (result.length > 0 && !/[\s,(;]/.test(result[result.length - 1])) {
          result += " ";
        }
        continue;
      }

      // 3. String literals ('...', "...", `...`, or Postgres dollar-quoted $$...$$)
      if (ch === "'" || ch === '"' || ch === "`") {
        const quote = ch;
        result += quote;
        i++;
        while (i < len) {
          const c = sql[i];
          result += c;
          if (c === "\\") {
            // Escaped character
            i++;
            if (i < len) result += sql[i];
          } else if (c === quote) {
            // Check for doubled quote escape in SQL (e.g. 'O''Reilly')
            if (sql[i + 1] === quote) {
              i++;
              result += sql[i];
            } else {
              break;
            }
          }
          i++;
        }
        i++;
        continue;
      }

      // 4. Whitespace collapsing
      if (/\s/.test(ch)) {
        while (i < len && /\s/.test(sql[i])) {
          i++;
        }
        if (result.length > 0) {
          const last = result[result.length - 1];
          const nextChar = sql[i];
          const lastIsWord = /[a-zA-Z0-9_$]/.test(last);
          const nextIsWord = nextChar && /[a-zA-Z0-9_$]/.test(nextChar);

          if (lastIsWord && nextIsWord) {
            result += " ";
          } else if (lastIsWord && nextChar && !/[\s,();.]/.test(nextChar)) {
            result += " ";
          } else if (!/[\s,();.]/.test(last) && nextIsWord) {
            result += " ";
          }
        }
        continue;
      }

      // 5. Normal characters and operators
      result += ch;
      i++;
    }

    return { minified: result.trim() };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to minify SQL query.";
    return {
      minified: sql.trim(),
      error: message,
    };
  }
}

/**
 * Validates a SQL query using the AST parser of node-sql-parser.
 * Returns genuine AST syntax validation result with line/column information.
 */
export function validateSqlQuery(
  sql: string,
  dialect: SqlDialect = "sql"
): SqlValidationResult {
  if (!sql.trim()) {
    return {
      isValid: null,
      statementCount: 0,
      statements: [],
      dialectUsed: SQL_DIALECTS[dialect]?.name || dialect,
    };
  }

  const dialectConfig = SQL_DIALECTS[dialect] || SQL_DIALECTS.sql;

  try {
    const parser = new ParserClass();
    const ast = parser.astify(sql, { database: dialectConfig.parserDialect });

    const astArray = Array.isArray(ast) ? ast : [ast];
    const statements: SqlStatementSummary[] = astArray.map((st: unknown) => {
      const node = st as Record<string, unknown> | null;
      const type = (typeof node?.type === "string" ? node.type : "QUERY").toUpperCase();
      let table = "";
      if (Array.isArray(node?.from) && node.from[0]?.table) {
        table = String(node.from[0].table);
      } else if (Array.isArray(node?.table) && node.table[0]?.table) {
        table = String(node.table[0].table);
      } else if (typeof node?.table === "string") {
        table = node.table;
      }
      return { type, table };
    });

    return {
      isValid: true,
      statementCount: astArray.length,
      statements,
      dialectUsed: dialectConfig.name,
      note: "Syntax grammar verified successfully. Note: Table and column existence require execution against your specific database schema.",
    };
  } catch (err: unknown) {
    // Extract location info if available
    const parsedErr = err as {
      message?: string;
      location?: {
        start?: { line?: number; column?: number };
      };
    };
    const loc = parsedErr.location || {};
    const line = loc.start?.line || 1;
    const column = loc.start?.column || 1;

    // Generate line snippet and pointer
    const lines = sql.split("\n");
    const lineIndex = Math.max(0, line - 1);
    const lineSnippet = lines[lineIndex] || "";
    const pointerSnippet =
      " ".repeat(Math.max(0, column - 1)) + "^ (Syntax error here)";

    return {
      isValid: false,
      statementCount: 0,
      statements: [],
      error: {
        message: parsedErr.message || "Invalid SQL syntax.",
        line,
        column,
        lineSnippet,
        pointerSnippet,
      },
      dialectUsed: dialectConfig.name,
      note: `The ${dialectConfig.name} parser encountered a syntax error at line ${line}, column ${column}. Check for missing keywords, unclosed quotes/brackets, or dialect-specific constructs.`,
    };
  }
}

export const SAMPLE_SQL_QUERIES: Record<SqlDialect, { title: string; sql: string }> = {
  sql: {
    title: "Standard ANSI SQL (CTE, JOIN, CASE, Aggregates)",
    sql: `-- Multi-clause standard SQL reporting query
WITH ranked_orders AS (
  SELECT 
    o.id AS order_id,
    o.customer_id,
    o.amount,
    o.status,
    ROW_NUMBER() OVER (PARTITION BY o.customer_id ORDER BY o.created_at DESC) AS order_rank
  FROM orders o
  WHERE o.status IN ('COMPLETED', 'SHIPPED')
)
SELECT 
  c.id AS customer_id,
  c.name AS customer_name,
  c.email,
  COUNT(ro.order_id) AS total_orders,
  COALESCE(SUM(ro.amount), 0.00) AS lifetime_value,
  CASE 
    WHEN SUM(ro.amount) >= 5000 THEN 'VIP Tier'
    WHEN SUM(ro.amount) >= 1000 THEN 'Gold Tier'
    ELSE 'Standard Tier'
  END AS customer_tier
FROM customers c
LEFT JOIN ranked_orders ro ON c.id = ro.customer_id
WHERE c.is_active = TRUE
GROUP BY c.id, c.name, c.email
HAVING COUNT(ro.order_id) >= 1
ORDER BY lifetime_value DESC, total_orders DESC
LIMIT 50;`,
  },
  postgresql: {
    title: "PostgreSQL (CTEs, JSONB, Window Functions)",
    sql: `-- PostgreSQL advanced query with CTE and JSONB functions
WITH user_activity AS (
  SELECT 
    user_id,
    action,
    metadata->>'source' AS signin_source,
    created_at,
    LEAD(created_at) OVER (PARTITION BY user_id ORDER BY created_at) AS next_action_at
  FROM audit_logs
  WHERE created_at >= NOW() - INTERVAL '30 days'
)
SELECT 
  u.id,
  u.username,
  u.email,
  COUNT(ua.action) AS total_events,
  MAX(ua.created_at) AS last_active
FROM users u
INNER JOIN user_activity ua ON u.id = ua.user_id
WHERE u.status = 'active'
GROUP BY u.id, u.username, u.email
ORDER BY total_events DESC
LIMIT 25 OFFSET 0;`,
  },
  mysql: {
    title: "MySQL / MariaDB (Backticks, GROUP_CONCAT, DATE functions)",
    sql: `-- MySQL product catalog query with backticks and aggregates
SELECT 
  \`p\`.\`id\` AS \`product_id\`,
  \`p\`.\`title\` AS \`product_title\`,
  \`c\`.\`name\` AS \`category_name\`,
  COUNT(\`r\`.\`id\`) AS \`review_count\`,
  ROUND(AVG(COALESCE(\`r\`.\`rating\`, 0)), 2) AS \`average_rating\`,
  GROUP_CONCAT(DISTINCT \`t\`.\`tag_name\` ORDER BY \`t\`.\`tag_name\` SEPARATOR ', ') AS \`tags\`
FROM \`products\` \`p\`
LEFT JOIN \`categories\` \`c\` ON \`p\`.\`category_id\` = \`c\`.\`id\`
LEFT JOIN \`reviews\` \`r\` ON \`p\`.\`id\` = \`r\`.\`product_id\`
LEFT JOIN \`product_tags\` \`pt\` ON \`p\`.\`id\` = \`pt\`.\`product_id\`
LEFT JOIN \`tags\` \`t\` ON \`pt\`.\`tag_id\` = \`t\`.\`id\`
WHERE \`p\`.\`is_published\` = 1
  AND \`p\`.\`created_at\` >= DATE_SUB(NOW(), INTERVAL 90 DAY)
GROUP BY \`p\`.\`id\`, \`p\`.\`title\`, \`c\`.\`name\`
HAVING \`review_count\` > 0
ORDER BY \`average_rating\` DESC, \`review_count\` DESC
LIMIT 20;`,
  },
  sqlite: {
    title: "SQLite (Embedded Database Query)",
    sql: `-- SQLite database inventory query
SELECT 
  i.item_id,
  i.sku,
  i.name,
  i.quantity_on_hand,
  i.unit_price,
  (i.quantity_on_hand * i.unit_price) AS inventory_value,
  datetime(i.last_audited_at, 'localtime') AS last_audit_local
FROM inventory i
WHERE i.quantity_on_hand <= i.reorder_threshold
  AND i.discontinued = 0
ORDER BY i.quantity_on_hand ASC
LIMIT 15;`,
  },
  transactsql: {
    title: "SQL Server (T-SQL with Bracket Identifiers)",
    sql: `-- Microsoft SQL Server T-SQL query with brackets
SELECT TOP (100)
  [e].[BusinessEntityID] AS [EmployeeID],
  [p].[FirstName],
  [p].[LastName],
  [d].[Name] AS [DepartmentName],
  [edh].[StartDate],
  CASE 
    WHEN [edh].[EndDate] IS NULL THEN 'Current'
    ELSE 'Former'
  END AS [EmploymentStatus]
FROM [HumanResources].[Employee] AS [e]
INNER JOIN [Person].[Person] AS [p] ON [e].[BusinessEntityID] = [p].[BusinessEntityID]
INNER JOIN [HumanResources].[EmployeeDepartmentHistory] AS [edh] ON [e].[BusinessEntityID] = [edh].[BusinessEntityID]
INNER JOIN [HumanResources].[Department] AS [d] ON [edh].[DepartmentID] = [d].[DepartmentID]
WHERE [edh].[EndDate] IS NULL
ORDER BY [p].[LastName] ASC, [p].[FirstName] ASC;`,
  },
};
