"use client";

import React from "react";

export interface ToolPageContextValue {
  inToolPageLayout: boolean;
  toolSlug?: string;
  isClientSide?: boolean;
}

export const ToolPageContext = React.createContext<ToolPageContextValue>({
  inToolPageLayout: false,
});

export const useToolPage = () => React.useContext(ToolPageContext);

