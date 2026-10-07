"use client";

import React from "react";
import PlaygroundPageContainer from "./PlaygroundPageContainer";
import { LANGUAGES } from "./languages.config";

export default function CodePlayground() {
  return <PlaygroundPageContainer languageConfig={LANGUAGES.html} />;
}
