// @ts-check
/// <reference types="node" />
/// <reference types="jest" />
/* eslint-env node, jest */
/* global global, TextEncoder, TextDecoder, jest */

/// <reference types="node" />
/* eslint-env node, jest */

import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;


