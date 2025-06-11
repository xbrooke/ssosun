// @ts-check
/// <reference types="node" />
/// <reference types="jest" />
/* eslint-env node, jest */

import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// @ts-ignore
global.TextEncoder = TextEncoder;
// @ts-ignore 
global.TextDecoder = TextDecoder;



// Mock matchMedia with full MediaQueryList implementation
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  // @ts-ignore
  value: jest.fn().mockImplementation(query => {
    const mql = {
      matches: query.includes('dark'), // mock prefers dark mode
      media: query,
      onchange: null,
      // @ts-ignore
      addListener: jest.fn(), // deprecated but still used in some libs
      // @ts-ignore
      removeListener: jest.fn(), // deprecated
      // @ts-ignore
      addEventListener: jest.fn((type, listener) => {
        // Store the listener for testing purposes
        mql._listener = listener;
      }),
      // @ts-ignore
      removeEventListener: jest.fn((type, listener) => {
        if (mql._listener === listener) {
          mql._listener = undefined;
        }
      }),
      // @ts-ignore
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