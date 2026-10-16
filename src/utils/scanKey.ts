import { KeyboardEvent } from "react";

export function scanKey(e: KeyboardEvent<HTMLInputElement>, fn: () => void) {
  if (e.key === "Enter") {
    e.preventDefault();
    fn();
  }
}
