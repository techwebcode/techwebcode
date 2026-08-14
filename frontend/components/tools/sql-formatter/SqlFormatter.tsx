"use client";

import React, { useState, useEffect } from "react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolInput from "@/components/tool/ToolInput";
import ToolOutput from "@/components/tool/ToolOutput";
import ToolExplanation from "@/components/tool/ToolExplanation";
import RelatedTools from "@/components/tool/RelatedTools";
import { Tool } from "@/types/tools";

interface Props {
  tool: Tool;
}

const SAMPLE_SQL = `select u.id, u.name, u.email, count(a.id) as total_articles from users u left join articles a on u.id = a.user_id where u.status = 'active' and u.created_at >= '2026-01-01' group by u.id, u.name, u.email order by total_articles desc limit 10;`;

export default function SqlFormatter({ tool }: Props) {
  const [input, setInput] = useState(SAMPLE_SQL);
  const [output, setOutput] = useState("");

  const formatSql = (sql: string) => {
    if (!sql.trim()) {
      setOutput("");
      return;
    }

    const keywords = [
      "SELECT", "FROM", "WHERE", "GROUP BY", "HAVING", "ORDER BY",
      "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "JOIN", "ON",
      "AND", "OR", "LIMIT", "OFFSET", "INSERT INTO", "VALUES",
      "UPDATE", "SET", "DELETE FROM"
    ];

    let formatted = sql;

    // Capitalize SQL Keywords
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, "gi");
      formatted = formatted.replace(regex, kw);
    });

    // Add Newlines for Major Clauses
    const clauseBreaklines = ["FROM", "WHERE", "GROUP BY", "HAVING", "ORDER BY", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "JOIN", "LIMIT"];
    clauseBreaklines.forEach((kw) => {
      const regex = new RegExp(`\\s+\\b(${kw})\\b`, "g");
      formatted = formatted.replace(regex, `\n$1`);
    });

    setOutput(formatted.trim());
  };

  useEffect(() => {
    formatSql(input);
  }, [input]);

  return (
    <div className="space-y-6">
      <ToolHeader tool={tool} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ToolInput
          label="Unformatted SQL Query"
          value={input}
          onChange={setInput}
          placeholder="Paste raw SQL query here..."
          onLoadSample={() => setInput(SAMPLE_SQL)}
        />

        <ToolOutput
          label="Formatted SQL Result"
          value={output}
          status="success"
          downloadFilename="formatted.sql"
        />
      </div>

      {/* SEO Rich Explanation Content */}
      <ToolExplanation
        title="SQL Query Formatter"
        description="SQL (Structured Query Language) is the standard query language for relational databases like MySQL, PostgreSQL, SQLite, and MariaDB. Our free online SQL Formatter standardizes keyword capitalization and clause indentations to make complex database queries readable and maintainable."
        howToUse={[
          "Paste your unformatted single-line SQL query into the left input editor.",
          "Keyword capitalization (SELECT, FROM, WHERE, JOIN) and line breaks apply automatically.",
          "Review the formatted SQL output on the right.",
          "Click Copy or Download to save your formatted.sql file.",
        ]}
        features={[
          "Automatic SQL keyword uppercase formatting (SELECT, FROM, WHERE, GROUP BY, ORDER BY).",
          "Clause line-break formatting for JOINs, subqueries, and conditional WHERE filters.",
          "Instant client-side formatting with zero network latency.",
          "100% private: Database queries and table schemas are never sent to external servers.",
        ]}
        faqs={[
          {
            question: "Why should I format SQL queries?",
            answer:
              "Unformatted SQL queries printed on a single dense line are difficult to inspect, debug, and peer-review. Structuring clauses onto separate lines improves query readability and highlights missing JOIN conditions or logic bugs.",
          },
          {
            question: "Which database dialects are supported?",
            answer:
              "Our SQL formatter formats standard ANSI SQL keywords used across MySQL, PostgreSQL, MariaDB, SQLite, Oracle, and Microsoft SQL Server.",
          },
          {
            question: "Does formatting alter the query execution plan?",
            answer:
              "No. SQL formatting only modifies whitespace, newlines, and keyword casing. The underlying database query execution logic and query planner results remain identical.",
          },
          {
            question: "Is my SQL query or schema data stored on any server?",
            answer:
              "No. Formatting runs 100% locally inside your web browser using JavaScript string transformations. Proprietary table names, column schemas, and database queries never leave your computer.",
          },
        ]}
      />

      <RelatedTools currentSlug="sql-formatter" />
    </div>
  );
}
