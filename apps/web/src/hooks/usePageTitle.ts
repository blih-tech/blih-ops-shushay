/**
 * Sets the browser tab title for client-side pages.
 * Usage: usePageTitle("Users | Admin") in any client component.
 */
import { useEffect } from "react";

const BRAND = "Blih";

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | ${BRAND}`;
    return () => {
      document.title = BRAND;
    };
  }, [title]);
}
