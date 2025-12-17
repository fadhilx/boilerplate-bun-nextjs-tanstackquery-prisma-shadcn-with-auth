import { test as base, expect } from "@playwright/test";

// For now, let's just use the base test without database cleanup
// The database will be cleaned when you run dev:test or start:test
export const test = base;
export { expect };
