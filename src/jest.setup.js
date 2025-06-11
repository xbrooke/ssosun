// @ts-check
/// <reference types="node" />
/// <reference types="jest" />
/* eslint-env node, jest */
/* global global */

import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import { TextEncoder, TextDecoder } from 'util';

// @ts-expect-error Node.js global in browser context
global.TextEncoder = TextEncoder;
// @ts-expect-error Node.js global in browser context
global.TextDecoder = TextDecoder;



// Mock matchMedia with full MediaQueryList implementation
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  // @ts-expect-error Mock implementation differs from actual type
  value: jest.fn().mockImplementation(query => {
    const mql = {
      matches: query.includes('dark'), // mock prefers dark mode
      media: query,
      onchange: null,
      // @ts-expect-error Deprecated API but needed for testing
      addListener: jest.fn(), // deprecated but still used in some libs
      // @ts-expect-error Deprecated API but needed for testing
      removeListener: jest.fn(), // deprecated
      // @ts-expect-error Custom mock implementation
      addEventListener: jest.fn((type, listener) => {
        // Store the listener for testing purposes
        mql._listener = listener;
      }),
      // @ts-expect-error Custom mock implementation
      removeEventListener: jest.fn((type, listener) => {
        if (mql._listener === listener) {
          mql._listener = undefined;
        }
      }),
      // @ts-expect-error Custom mock implementation
      dispatchEvent: jest.fn((event) => {
        if (mql._listener && event.type === 'change') {
          mql._listener(event);
        }
        return true;
      }),
    };
    return mql;
  }),
});

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