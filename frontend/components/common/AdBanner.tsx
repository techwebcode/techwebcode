"use client";

import React, { useEffect } from "react";

interface AdBannerProps {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal";
  responsive?: boolean;
  className?: string;
}

export default function AdBanner({
  slot = "1234567890",
  format = "auto",
  responsive = true,
  className = "",
}: AdBannerProps) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      // Ignore AdSense script load errors
    }
  }, []);

  return (
    <div className={`my-8 flex flex-col items-center justify-center border border-border/40 bg-muted/20 rounded-xl p-4 text-center overflow-hidden min-h-[120px] ${className}`}>
      <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-2 select-none">
        Advertisement
      </span>

      {/* AdSense Unit */}
      <ins
        className="adsbygoogle w-full"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-0000000000000000"}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
