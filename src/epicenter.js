/* Epicenter Libs -- 0.0.0 */
export const version = '0.0.0';

export { default as config } from './config.js';
export { default as identification } from './identification.js';
export { default as errorManager } from './error-manager.js';
export { default as channelManager } from './channel-manager.js';
export { default as Channel } from './channel.js';

import * as accountModule from './account.js';
import * as authenticationModule from './authentication.js';
import * as presenceModule from './presence.js';
import * as utilityModule from './utility.js';
import * as runModule from './run.js';

export const account = accountModule;
export const authentication = authenticationModule;
export const presence = presenceModule;
export const utility = utilityModule;
export const run = runModule;

