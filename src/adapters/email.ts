import type { RoutingOptions } from '../utils/router';
import { Router } from 'utils/index';

export enum ENCODING {
    HEX = 'HEX',
    BASE_64 = 'BASE_64',
}

/**
 * Sends an email to an individual user; requires following authentication levels:
 * - /email/user/{groupKey}/{userKey} - PARTICIPANT
 * - /email/user/{groupKey}/{userKey}/from/{from} - REVIEWER
 * - /email/user/{groupKey}/{userKey}/from/{from}/{replyTo} - REVIEWER
 * - /email/user/{groupKey}/{userKey}/as/{fromUserKey} - REVIEWER
 * @example
 * // Sends an email with a smiley face png attachment
 * const groupKey = epicenter.authAdapter.getLocalSession().groupKey;
 * const subject = 'check out this drawing!';
 * const emailBody = 'I hope you enjoy this smiley face!';
 * const attachments = [{
 *      encoding: 'BASE_64',
 *      name: 'testPic',
 *      contentType: 'image/png',
 *      data: 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAIxJREFUWEdjZBhgwDjA9jMQ5YAvzmb/efaewquWGDXYPDvqgNEQGA2B0RAYGiFAy+KaqBAYdcDICgFQtQryMaHql1qhgjURklu3IzuKWDNwOoCSUCAlFHFmQ2J9gB4VpFgO0kvVZhaplhPlAJgPCSVKciwn6ACY5TDD8aV8Qg7EpXe0KB4NgdEQGA0BAF7VgCFTeobfAAAAAElFTkSuQmCC',
 * }];
 *
 * // Sends an email to the address associated with the provided user key, sender will be seen as "System"
 * epicenter.emailAdapter.sendEmail(groupKey, '000001796733eef0842f4d6d960997018a3b', subject, emailBody, { attachments });
 * // Sends an email to the address associated with the provided user key, sender will be seen as be the address provided by the "from" field
 * epicenter.emailAdapter.sendEmail(groupKey, '000001796733eef0842f4d6d960997018a3b', subject, emailBody, { attachments, from: 'sender@test.com' });
 * // Sends an email to the address defined at "replyTo", sender will be seen as be the address provided by the "from" field
 * epicenter.emailAdapter.sendEmail(groupKey, '000001796733eef0842f4d6d960997018a3b', subject, emailBody, { attachments, from: 'sender@test.com', replyTo: 'receiver@test.com' });
 * // Sends an email to the address associated with the provided user key, sender will be seen as the user associated with the "fromUserKey"
 * epicenter.emailAdapter.sendEmail(groupKey, '000001796733eef0842f4d6d960997018a3b', subject, emailBody, { attachments, fromUserKey: '000001796733eef0842f4d6d960997018a33' });
 * @param groupKey                              The groupKey in which the email target user exists
 * @param userKey                               The unique userKey for the email target user
 * @param subject                               The subject line for the email.
 * @param emailBody                             The body for the email
 * @param [optionals]                           Optional parameters
 * @param [optionals.familyNameFirst]           Specifies whether email target's family name will come before their given name. Defaults to false.
 * @param [optionals.html]                      Whether to treat the body as HTML (true) or as plain text (false). Defaults to false.
 * @param [optionals.from]                      The email address from which the message will appear to have been sent from. Will be overriden by fromUserKey.
 * @param [optionals.replyTo]                   The email address that will be replyed to by the recipient. Must be used in conjunction with optionals.from.
 * @param [optionals.fromUserKey]               The userKey from which the email will appear to have been sent. The default response address will also be this email.
 * @param [optionals.attachments]               An array of (binary) objects to include as attachments. All four properties must be included.
 * @param [optionals.attachments[].encoding]    A string specifying the encoding method. See ENCODING for possible values.
 * @param [optionals.attachments[].data]        A string containing the data for the attachment.
 * @param [optionals.attachments[].name]        A string containing the name of the attachment.
 * @param [optionals.attachments[].contentType] A string specifying the attachment MIME Type.
 * @returns undefined indicating success
 */
export async function sendEmail(
    groupKey: string,
    userKey: string,
    subject: string,
    emailBody: string,
    optionals: {
        familyNameFirst?: string;
        html?: boolean;
        from?: string;
        replyTo?: string;
        fromUserKey?: string;
        attachments?: {
            encoding: keyof typeof ENCODING;
            data: string;
            name: string;
            contentType: string;
        }[];
    } & RoutingOptions = {},
): Promise<void> {
    const {
        accountShortName,
        projectShortName,
        server,
        familyNameFirst,
        html,
        from,
        replyTo,
        fromUserKey,
        attachments,
        ...routingOptions
    } = optionals;

    let fromString = '';
    if (fromUserKey) {
        fromString += `/as/${fromUserKey}`;
    } else if (from) {
        fromString += `/from/${from}`;
        if (replyTo) {
            fromString += `/${replyTo}`;
        }
    }

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/email/user/${groupKey}/${userKey}${fromString}`, {
            body: {
                subject,
                body: emailBody,
                familyNameFirst,
                html,
                attachments,
            },
            ...routingOptions,
        })
        .then(({ body }) => body);
}

/**
 * Sends an email to an individual admin (someone with epicenter account); Requires support level authentication
 * @param adminKey                              The unique adminKey for the email target
 * @param subject                               The subject line for the email.
 * @param emailBody                             The body for the email
 * @param [optionals]                           Optional parameters
 * @param [optionals.familyNameFirst]           Specifies whether email target's family name will come before their given name. Defaults to false.
 * @param [optionals.html]                      Whether to treat the body as HTML (true) or as plain text (false). Defaults to false.
 * @param [optionals.attachments]               An array of (binary) objects to include as attachments. All four properties must be included.
 * @param [optionals.attachments[].encoding]    A string specifying the encoding method. See ENCODING for possible values.
 * @param [optionals.attachments[].data]        A string containing the data for the attachment.
 * @param [optionals.attachments[].name]        A string containing the name of the attachment.
 * @param [optionals.attachments[].contentType] A string specifying the attachment MIME Type.
 * @returns undefined indicating success
 */
export async function sendEmailToAdmin(
    adminKey: string,
    subject: string,
    emailBody: string,
    optionals: {
        familyNameFirst?: string;
        html?: boolean;
        attachments?: {
            encoding: keyof typeof ENCODING;
            data: string;
            name: string;
            contentType: string;
        };
    } & RoutingOptions = {},
): Promise<void> {
    const {
        accountShortName,
        projectShortName,
        server,
        familyNameFirst,
        html,
        attachments,
        ...routingOptions
    } = optionals;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/email/admin/${adminKey}`, {
            body: {
                subject,
                body: emailBody,
                familyNameFirst,
                html,
                attachments,
            },
            ...routingOptions,
        })
        .then(({ body }) => body);
}
