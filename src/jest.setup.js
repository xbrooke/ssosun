// @ts-check
/// <reference types="node" />
/// <reference types="jest" />
/* eslint-env node, jest */
/* global global */

import '@testing-library/jest-dom';
import { jest, beforeAll } from '@jest/globals';
import { TextEncoder, TextDecoder } from 'util';

// @ts-expect-error Node.js global in browser context
global.TextEncoder = TextEncoder;
// @ts-expect-error Node.js global in browser context
global.TextDecoder = TextDecoder;



// Mock matchMedia with full MediaQueryList implementation
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: query.includes('dark'), // mock prefers dark mode
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated but still used in some libs
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    currentTarget: window,
    // Add missing properties to fully implement MediaQueryList interface
    __proto__: EventTarget.prototype,
  })),
});

// Remove duplicate mock implementation
// The mock is already defined above

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});