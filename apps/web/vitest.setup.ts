import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock EventSource for Server-Sent Events in test environment
global.EventSource = class EventSource {
  url: string;
  withCredentials: boolean;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  readyState = 1;
  CONNECTING = 0;
  OPEN = 1;
  CLOSED = 2;

  constructor(url: string, eventSourceInitDict?: EventSourceInit) {
    this.url = url;
    this.withCredentials = Boolean(eventSourceInitDict?.withCredentials);
  }

  close() {
    this.readyState = 2;
  }
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return true;
  }
} as any;
