
"use client";

import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // Default to false (desktop-like)

  useEffect(() => {
    setHasMounted(true); // Signal that the component has mounted on the client

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkIsMobile(); // Initial check on client mount
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  // On the server, and for the initial client render before useEffect runs, hasMounted is false.
  // In this case, return the default (false) to ensure consistency with server render.
  // After mounting on the client, hasMounted becomes true, and we return the actual isMobile state.
  return hasMounted ? isMobile : false;
}
