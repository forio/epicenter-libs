import { Router } from "utils/index";

/**
 * Sends an email to an individual user; available to participants
 *
 * Base URL: POST `https://forio.com/api/v3/{accountShortName}/{projectShortName}/email/user/{groupKey}/{pseudonymKey}`
 *
 * @memberof emailAdapter
 * @example
 *
 * epicenter.emailAdapter.sendEmail(groupKey, pseudonymKey, subject, {
 *      subject: 'Please sign in to the sim!',
 *      body: 'Your grade has been updated. Login to check it out!',
 * });
 *
 * @param {object}  groupKey                        The groupKey in which the email target user exists
 * @param {string}  pseudonymKey                    The unique userKey for the email target user
 * @param {string}  subject                         The subject line for the email.
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @param {string}  [optionals.familyNameFirst]     Specifies whether email target's family name will come before their given name. Defaults to false.
 * @param {string}  [optionals.html]                Whether to treat the body as HTML (true) or as plain text (false). Defaults to false.
 * @param {string}  [optionals.body]                The content of the email.
 * @param {string}  [optionals.attachments]         An array of (binary) objects to include as attachments.
 *      @param {string}  [binaryObject.encoding]             An array of (binary) objects to include as attachments.
 *      @param {string}  [binaryObject.data]                 An array of (binary) objects to include as attachments.
 *      @param {string}  [binaryObject.name]                 An array of (binary) objects to include as attachments.
 *      @param {string}  [binaryObject.encryption]           An array of (binary) objects to include as attachments.
 *      @param {string}  [binaryObject.contentType]          An array of (binary) objects to include as attachments.
 * @returns {undefined}                             Returns a 204 for successfully sending the email or a 400 for an invalid request
 */
export async function sendEmail(
    groupKey: string,
    pseudonymKey: string,
    subject: string,
    optionals: GenericAdapterOptions & {familyNameFirst: string, html: boolean, body: string, attachments: Array} = {}
) {
    const { accountShortName, projectShortName, server, familyNameFirst, html, body, attachments, } =
        optionals;
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/email/user/${groupKey}/${pseudonymKey}`, {
            body: {
                familyNameFirst,
                html,
                body,
                attachments,
            },
        })
        .then(({ body }) => body);
}
