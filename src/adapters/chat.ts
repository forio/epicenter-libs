import type { GenericScope, GenericSearchOptions, Permit } from '../utils/constants';
import type { RoutingOptions, Page } from '../utils/router';

import Router from '../utils/router';
import { parseFilterInput } from '../utils/filter-parser';

export interface ChatMessageReadOutView {
    senderKey: string;
    receiverKey: string;
    created: string;
    id: string;
    message: string;
}

export interface ChatReadOutView {
    permit: Permit;
    chatKey: string;
    messages: ChatMessageReadOutView[];
    room: string;
    scope: GenericScope;
}


/**
 * Updates the permissions of a chat
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/chat/{CHAT_KEY}`
 *
 * @example
 * import { chatAdapter, ROLE } from 'epicenter-libs';
 * await chatAdapter.updatePermit('0000017dd3bf540e5ada5b1e058f08f20461', {
 *     readLock: ROLE.PARTICIPANT,
 *     writeLock: ROLE.FACILITATOR,
 * });
 *
 * @param chatKey       Key associated with the chat
 * @param permit        Permit object with the updated permissions
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the updated chat
 */
export async function updatePermit(
    chatKey: string,
    permit: Permit,
    optionals: RoutingOptions = {},
): Promise<ChatReadOutView> {
    return new Router()
        .patch(`/chat/${chatKey}`, {
            ...optionals,
            body: { permit },
        }).then(({ body }) => body);
}


/**
 * Creates a chat
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/chat`
 *
 * @example
 * import { chatAdapter, SCOPE_BOUNDARY, ROLE } from 'epicenter-libs';
 * const chat = await chatAdapter.create(
 *      'my-chat-room',
 *      { scopeBoundary: SCOPE_BOUNDARY.GROUP, scopeKey: '00000165ad4e6a3cd22b993340b963820239' },
 *      { readLock: ROLE.PARTICIPANT, writeLock: ROLE.PARTICIPANT }
 * );
 *
 * @param room          Name of the chat
 * @param scope         Scope of the chat; will not accept user scope
 * @param scope.scopeBoundary   Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey    Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param permit        Permissions for the chat
 * @param permit.readLock   Role allowed to read
 * @param permit.writeLock  Role allowed to write
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the newly created chat
 */
export async function create(
    room: string,
    scope: GenericScope,
    permit: Permit,
    optionals: RoutingOptions = {},
): Promise<ChatReadOutView> {
    return new Router()
        .post('/chat', {
            body: {
                scope: {
                    scopeBoundary: scope.scopeBoundary,
                    scopeKey: scope.scopeKey,
                },
                permit,
                room,
            },
            ...optionals,
        }).then(({ body }) => body);
}


/**
 * Gets a chat
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/chat/{CHAT_KEY}`
 *
 * @example
 * import { chatAdapter } from 'epicenter-libs';
 * const chat = await chatAdapter.get('00000165ad4e6a3cd22b993340b963820239');
 *
 * @param chatKey       Key of the associated chat
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the chat
 */
export async function get(
    chatKey: string,
    optionals: RoutingOptions = {},
): Promise<ChatReadOutView> {
    return new Router()
        .get(`/chat/${chatKey}`, optionals)
        .then(({ body }) => body);
}


/**
 * Open search for chats, returns a page
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/chat/search`
 *
 * @example
 * import { chatAdapter } from 'epicenter-libs';
 * const page = await chatAdapter.query({
 *      filter: [
 *          'room|=my-chat-room|my-other-chat|room-three',      // looks for any rooms with the names provided
 *          'scopeBoundary=GROUP',                              // keeps the search within the group scope
 *          'scopeKey=00000165ad4e6a3cd22b993340b963820239',    // used in conjunction with the scopeBoundary
 *          'chatKey=0000017dd3bf540e5ada5b1e058f08f20461',     // searches for a specific chat
 *          'created>=2022-01-03T20:30:53.054Z',                // looks for any chats created after Jan 3rd 2022
 *      ],
 *      sort: ['+chat.created'],    // sort all findings by the 'created' field (ascending)
 *      first: 3,                   // page should start with the 4th item found (defaults to 0)
 *      max: 10,                    // page should only include the first 10 items
 * });
 *
 * @param searchOptions             Search options for the query
 * @param [searchOptions.filter]    Filters for searching
 * @param [searchOptions.sort]      Sorting criteria
 * @param [searchOptions.first]     The starting index of the page returned
 * @param [searchOptions.max]       The number of entries per page
 * @param [optionals]               Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to a page of chats
 */
export async function query(
    searchOptions: GenericSearchOptions,
    optionals: RoutingOptions = {},
): Promise<Page<ChatReadOutView>> {
    const { filter, sort = [], first = 0, max } = searchOptions;
    const searchParams = {
        filter: parseFilterInput(filter),
        sort: sort.join(';') || undefined,
        first, max,
    };
    return await new Router()
        .withSearchParams(searchParams)
        .get('/chat/search', {
            paginated: true,
            ...optionals,
        })
        .then(({ body }) => body);
}


/**
 * Sends a message to a chat
 * Base URL: PUT `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/chat/message/{CHAT_KEY}` or PUT `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/chat/message/{CHAT_KEY}/{USER_KEY}`
 *
 * @example
 * import { chatAdapter } from 'epicenter-libs';
 * // Send a public message to the chat
 * await chatAdapter.sendMessage('0000017dd3bf540e5ada5b1e058f08f20461', 'hello');
 * // Send a private message to a specific user
 * await chatAdapter.sendMessage('0000017dd3bf540e5ada5b1e058f08f20461', 'hello, privately', { userKey: '000001796733eef0842f4d6d960997018a33' });
 *
 * @param chatKey               Key associated with the chat
 * @param message               Message text to send
 * @param [optionals]           Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.userKey]   Key of the user to send the message to. If omitted, will send as a public message
 * @returns promise that resolves to the chat message created
 */
export async function sendMessage(
    chatKey: string,
    message: string,
    optionals: { userKey?: string } & RoutingOptions = {},
): Promise<ChatMessageReadOutView> {
    const { userKey, ...routingOptions } = optionals;
    const uriComponent = userKey ? `/${userKey}` : '';
    return new Router()
        .put(`/chat/message/${chatKey}${uriComponent}`, {
            body: { message },
            ...routingOptions,
        }).then(({ body }) => body);
}


/**
 * Retrieves messages from for a given chat
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/chat/message/{CHAT_KEY}`
 *
 * @example
 * import { chatAdapter } from 'epicenter-libs';
 * // gets the chat message with id: 5
 * const message = await chatAdapter.getMessages('0000017dd3bf540e5ada5b1e058f08f20461', { horizon: 5, maxRecords: 1 });
 * // gets the 10 chat messages starting from id 5 (inclusive)
 * const messages = await chatAdapter.getMessages('0000017dd3bf540e5ada5b1e058f08f20461', { horizon: 5, maxRecords: 10 });
 *
 * @param chatKey                   Key associated with the chat
 * @param [optionals]               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.maxRecords]    Maximum number of messages to get
 * @param [optionals.horizon]       The message ID from which to start with; works backwards so if `maxRecords=20` and `horizon=50`, it will get the 20 messages starting from message ID 50, working backwards (50, 49, 48..., etc.). If this value is omitted the platform assumes it is the most recent message in the chat
 * @returns promise that resolves to the list of chat messages requested
 */
export async function getMessages(
    chatKey: string,
    optionals: {
        maxRecords?: number;
        horizon?: number;
    } & RoutingOptions = {},
): Promise<ChatMessageReadOutView[]> {
    const { maxRecords, horizon, ...routingOptions } = optionals;
    return new Router()
        .withSearchParams({ maxRecords, horizon })
        .get(`/chat/message/${chatKey}`, routingOptions)
        .then(({ body }) => body);
}

/**
 * Retrieves messages for a given user; requires facilitator authentication; works with an admin user
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/chat/message/{CHAT_KEY}/{PSEUDONYM_KEY}`
 *
 * @example
 * import { chatAdapter } from 'epicenter-libs';
 * // gets the chat message with id: 5
 * const message = await chatAdapter.getMessagesForUser('0000017dd3bf540e5ada5b1e058f08f20461', '000001796733eef0842f4d6d960997018a33', { horizon: 5, maxRecords: 1 });
 * // gets the 10 chat messages starting from id 5 (inclusive)
 * const messages = await chatAdapter.getMessagesForUser('0000017dd3bf540e5ada5b1e058f08f20461', '000001796733eef0842f4d6d960997018a33', { horizon: 5, maxRecords: 10 });
 *
 * @param chatKey                   Key associated with the chat
 * @param pseudonymKey             Key associated with the user whose messages are being retrieved
 * @param [optionals]               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.maxRecords]    Maximum number of messages to get
 * @param [optionals.horizon]       The message ID from which to start with; works backwards so if `maxRecords=20` and `horizon=50`, it will get the 20 messages starting from message ID 50, working backwards (50, 49, 48..., etc.). If this value is omitted the platform assumes it is the most recent message in the chat
 * @returns promise that resolves to the list of chat messages requested
 */
export async function getMessagesForUser(
    chatKey: string,
    pseudonymKey: string,
    optionals: {
        maxRecords?: number;
        horizon?: number;
    } & RoutingOptions = {},
): Promise<ChatMessageReadOutView[]> {
    const { maxRecords, horizon, ...routingOptions } = optionals;
    return new Router()
        .withSearchParams({ maxRecords, horizon })
        .get(`/chat/message/${chatKey}/${pseudonymKey}`, routingOptions)
        .then(({ body }) => body);
}

/**
 * Retrieves messages from for a given chat for an admin user; requires support authentication
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/chat/message/all/{CHAT_KEY}`
 *
 * @example
 * import { chatAdapter } from 'epicenter-libs';
 * // gets the chat message with id: 5
 * const message = await chatAdapter.getMessagesAdmin('0000017dd3bf540e5ada5b1e058f08f20461', { horizon: 5, maxRecords: 1 });
 * // gets the 10 chat messages starting from id 5 (inclusive)
 * const messages = await chatAdapter.getMessagesAdmin('0000017dd3bf540e5ada5b1e058f08f20461', { horizon: 5, maxRecords: 10 });
 *
 * @param chatKey                   Key associated with the chat
 * @param [optionals]               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.maxRecords]    Maximum number of messages to get
 * @param [optionals.horizon]       The message ID from which to start with; works backwards so if `maxRecords=20` and `horizon=50`, it will get the 20 messages starting from message ID 50, working backwards (50, 49, 48..., etc.). If this value is omitted the platform assumes it is the most recent message in the chat
 * @returns promise that resolves to the list of chat messages requested
 */
export async function getMessagesAdmin(
    chatKey: string,
    optionals: {
        maxRecords?: number;
        horizon?: number;
    } & RoutingOptions = {},
): Promise<ChatMessageReadOutView[]> {
    const { maxRecords, horizon, ...routingOptions } = optionals;
    return new Router()
        .withSearchParams({ maxRecords, horizon })
        .get(`/chat/message/all/${chatKey}`, routingOptions)
        .then(({ body }) => body);
}

/**
 * Sends a message to a chat as an admin user; requires support authentication
 * Base URL: PUT `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/chat/message/system/{CHAT_KEY}` or PUT `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/chat/message/system/{CHAT_KEY}/{USER_KEY}`
 *
 * @example
 * import { chatAdapter } from 'epicenter-libs';
 * // Send a public message to the chat
 * await chatAdapter.sendMessageAdmin('0000017dd3bf540e5ada5b1e058f08f20461', 'hello');
 * // Send a private message to a specific user
 * await chatAdapter.sendMessageAdmin('0000017dd3bf540e5ada5b1e058f08f20461', 'hello, privately', { userKey: '000001796733eef0842f4d6d960997018a33' });
 *
 * @param chatKey               Key associated with the chat
 * @param message               Message text to send
 * @param [optionals]           Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.userKey]   Key of the user to send the message to. If omitted, will send as a public message
 * @returns promise that resolves to the chat message created
 */
export async function sendMessageAdmin(
    chatKey: string,
    message: string,
    optionals: { userKey?: string } & RoutingOptions = {},
): Promise<ChatMessageReadOutView> {
    const { userKey, ...routingOptions } = optionals;
    const uriComponent = userKey ? `/${userKey}` : '';
    return new Router()
        .put(`/chat/message/system/${chatKey}${uriComponent}`, {
            body: { message },
            ...routingOptions,
        }).then(({ body }) => body);
}
