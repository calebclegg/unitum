"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.use = void 0;
const use = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.use = use;
