/* eslint-disable no-new-func */
export const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
export const isNode = new Function('try {return (typeof process !== "undefined") && (typeof process.versions.node !== "undefined")}catch(e){return false;}');


export const last = (strOrArr: string | Array<unknown>): unknown => strOrArr[strOrArr.length - 1];
export const prefix = (pre: string, str: string): string => str.startsWith(pre) ? str : `${pre}${str}`;

// Escape string for safe use in RegExp
export const escapeRegExp = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
