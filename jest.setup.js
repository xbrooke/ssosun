// @ts-check
/// <reference types="node" />
/// <reference types="jest" />
/* eslint-env node, jest */
/* global global */

import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// @ts-expect-error Node.js global in browser context
global.TextEncoder = TextEncoder;
// @ts-expect-error Node.js global in browser context
global.TextDecoder = TextDecoder;



// jest.setup.ts
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
