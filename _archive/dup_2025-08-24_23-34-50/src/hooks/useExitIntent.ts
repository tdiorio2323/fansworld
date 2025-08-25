"use client";
import { useEffect, useState } from "react";

export function useExitIntent(delayMs = 800) {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    let armed = false;
    const timer = setTimeout(() => armed = true, delayMs);
    
    const onMouseOut = (e: MouseEvent) => {
      if (!armed) return;
      if (e.clientY <= 0) setShow(true);
    };
    
    document.addEventListener("mouseout", onMouseOut);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [delayMs]);
  
  return { show, setShow };
}