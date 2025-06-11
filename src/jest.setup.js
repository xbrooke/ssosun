// @ts-check
/// <reference types="node" />
/* eslint-env node, jest */
/* global global */

import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
