"use client";
import {useEffect, useState} from "react";
import {createPortal} from "react-dom";

export function ModalPortal({children}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    children,
    document.getElementById("modal-root") || document.body
  );
}
