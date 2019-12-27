export const version = VERSION;

export { default as config } from './config.js';
export { default as identification } from './identification.js';
export { default as errorManager } from './error-manager.js';
export { default as channelManager } from './channel-manager.js';
export { default as Channel } from './channel.js';

import * as _account from './account.js';
import * as _project from './project.js';
import * as _authentication from './authentication.js';
import * as _presence from './presence.js';
import * as _utility from './utility.js';
import * as _run from './run.js';

export const account = _account;
export const project = _project;
export const authentication = _authentication;
export const presence = _presence;
export const utility = _utility;
export const run = _run;

