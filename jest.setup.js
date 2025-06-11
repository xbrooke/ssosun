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



