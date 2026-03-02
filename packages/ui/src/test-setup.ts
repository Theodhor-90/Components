import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, expect } from 'vitest';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore vitest-axe has incomplete type exports for NodeNext resolution
import * as matchers from 'vitest-axe/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

// jsdom does not implement ResizeObserver; stub it for components that depend on it (e.g. Radix Slider)
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

// jsdom does not implement pointer capture methods; stub them for Radix primitives
if (typeof HTMLElement.prototype.hasPointerCapture === 'undefined') {
  HTMLElement.prototype.hasPointerCapture = function () {
    return false;
  };
}
if (typeof HTMLElement.prototype.setPointerCapture === 'undefined') {
  HTMLElement.prototype.setPointerCapture = function () {};
}
if (typeof HTMLElement.prototype.releasePointerCapture === 'undefined') {
  HTMLElement.prototype.releasePointerCapture = function () {};
}
