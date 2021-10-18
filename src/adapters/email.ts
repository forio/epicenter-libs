import { Router } from 'utils/index';

enum ENCODING {
    HEX = 'HEX',
    BASE_64 = 'BASE_64',
}

enum ENCRYPTION {
    AES = 'AES',
}

/**
 * Sends an email to an individual user; available to participants
 *
 * Base URL: POST `https://forio.com/api/v3/{accountShortName}/{projectShortName}/email/user/{groupKey}/{pseudonymKey}`
 *
 * @memberof emailAdapter
 * @example
 * //Sends an email with a smiley face png attachment
 * const subject = "check out this drawing!"
 * const emailBody = "I hope you enjoy this smiley face!"
 * const optionals = {
 *      attachments: [{
 *           encoding: 'BASE_64',
 *           name: 'testPic',
 *           contentType: 'image/png',
 *           data: 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAIxJREFUWEdjZBhgwDjA9jMQ5YAvzmb/efaewquWGDXYPDvqgNEQGA2B0RAYGiFAy+KaqBAYdcDICgFQtQryMaHql1qhgjURklu3IzuKWDNwOoCSUCAlFHFmQ2J9gB4VpFgO0kvVZhaplhPlAJgPCSVKciwn6ACY5TDD8aV8Qg7EpXe0KB4NgdEQGA0BAF7VgCFTeobfAAAAAElFTkSuQmCC',
 *      }]
 * }
 * 
 * epicenter.emailAdapter.sendEmail(groupKey, pseudonymKey, subject, emailBody, optionals);
 *
 * @param {object}  groupKey                        The groupKey in which the email target user exists
 * @param {string}  pseudonymKey                    The unique userKey for the email target user
 * @param {string}  subject                         The subject line for the email.
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @param {boolean}  [optionals.familyNameFirst]    Specifies whether email target's family name will come before their given name. Defaults to false.
 * @param {boolean}  [optionals.html]               Whether to treat the body as HTML (true) or as plain text (false). Defaults to false.
 * @param {string}  [optionals.body]                The content of the email.
 * @param {Array}  [optionals.attachments]          An array of (binary) objects to include as attachments. All four properties must be included.
 *      @param {string}  [binaryObject.encoding]             A string specifying the encoding method. See ENCODING for possible values.
 *      @param {string}  [binaryObject.data]                 A string containing the data for the attachment.
 *      @param {string}  [binaryObject.name]                 A string containing the name of the attachment.
 *      @param {string}  [binaryObject.contentType]          A string specifying the attachment MIME Type. 
 * @returns {undefined}                             Returns a 204 for successfully sending the email or a 400 for an invalid request
 */
export async function sendEmail(
    groupKey: string,
    pseudonymKey: string,
    subject: string,
    emailBody: string,
    optionals: {
        familyNameFirst?: string, 
        html?: boolean, 
        body?: string, 
        attachments?: {
            encoding: keyof typeof ENCODING,
            data: string,
            name: string,
            encryption: keyof typeof ENCRYPTION,
            contentType: string,
        }
    } & GenericAdapterOptions = {}
) {
    const { accountShortName, projectShortName, server, familyNameFirst, html, attachments } =
        optionals;
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/email/user/${groupKey}/${pseudonymKey}`, {
            body: {
                subject,
                body: emailBody,
                familyNameFirst,
                html,
                attachments,
            },
        })
        .then(({ body }) => body);
}
