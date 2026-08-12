"use client";

import React, { useState, useEffect } from "react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolInput from "@/components/tool/ToolInput";
import ToolOutput from "@/components/tool/ToolOutput";
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
      <ToolHeader
        title={tool.name || "SQL Query Formatter"}
        description={tool.description || "Beautify and format SQL queries with proper clause indentations and capitalized keywords."}
      />

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
    </div>
  );
}
