import * as accountModule from './account.js';
import * as authenticationModule from './authentication.js';
import * as channelModule from './channel.js';
import * as utilityModule from './utility.js';

export const account = accountModule;
export const authentication = authenticationModule;
export const channel = channelModule;
export const utility = utilityModule;

if (typeof window !== 'undefined') {
    window.epicenter = {
        account,
        authentication,
        channel,
        utility,
    };
}