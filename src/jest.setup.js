// @ts-check
/// <reference types="node" />
/// <reference types="jest" />
/* eslint-env node, jest */
/* global global */

import { jest } from '@jest/globals';
// @ts-expect-error Node.js global in browser context
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Node.js globals for browser context
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: query.includes('dark'),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    currentTarget: window,
    __proto__: EventTarget.prototype,
  })),
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