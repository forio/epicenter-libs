import type { GenericScope, Permit } from 'utils/constants';
import type { RoutingOptions, Page, GenericSearchOptions } from 'utils/router';
import Router from 'utils/router';

interface ChatMessage {
    senderKey: string,
    receiverKey: string,
    created: string,
    id: string,
    message: string,
}

interface Chat {
    permit: Permit,
    chatKey: string,
    messages: ChatMessage[],
    room: string,
    scope: GenericScope,
}

/**
 * Updates the permissions of a chat
 * @param chatKey       Key associated with the chat
 * @param permit        Permit object with the updated permissions
 * @param [optionals]   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @returns the newly updated chat
 */
export async function updatePermit(
    chatKey: string,
    permit: Permit,
    optionals: RoutingOptions = {}
): Promise<Chat> {
    return new Router()
        .patch(`/chat/${chatKey}`, {
            ...optionals,
            body: { permit },
        }).then(({ body }) => body);
}

/**
 * Creates a chat
 * @example
 * import { chatAdapter, SCOPE_BOUNDARY, ROLE } from 'epicenter';
 * chatAdapter.create(
 *      'my-chat-room',
 *      { scopeBoundary: SCOPE_BOUNDARY.GROUP, scopeKey: '00000165ad4e6a3cd22b993340b963820239' },
 *      { readLock: ROLE.PARTICIPANT, writeLock: ROLE.PARTICIPANT }
 * );
 * @param room          Name of the chat
 * @param scope         Scope of the chat; will not accept user scope
 * @param permit        Permissions for the chat
 * @param [optionals]   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @returns The chat created
 */
export async function create(
    room: string,
    scope: GenericScope,
    permit: Permit,
    optionals: RoutingOptions = {}
): Promise<Chat> {
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
 * @example
 * epicenter.chatAdapter.get('00000165ad4e6a3cd22b993340b963820239');
 * @param chatKey       Key of the associated chat
 * @param [optionals]   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @returns The chat corresponding with the provided key
 */
export async function get(
    chatKey: string,
    optionals: RoutingOptions = {}
): Promise<Chat> {
    return new Router()
        .get(`/chat/${chatKey}`, optionals)
        .then(({ body }) => body);
}


/**
 * Open search for chats, returns a page
 * @example
 * epicenter.chatAdapter.query({
 *      filter: [
 *          'room|=my-chat-room|my-other-chat|room-three',      // looks for any rooms with the names provided
 *          'scopeBoundary=GROUP',                              // keeps the search within the group scope
 *          // 'scopeKey=00000165ad4e6a3cd22b993340b963820239', // used in conjunction with the scopeBoundary
 *          // 'chatKey=0000017dd3bf540e5ada5b1e058f08f20461',  // searches for a specific chat
 *          // 'accountShortName=acme',                         // specifies the account, typically unnecessary
 *          // 'projectShortName=simulations',                  // specifies the project, typically unnecessary
 *          // 'groupName=my-group-name',                       // search based on group name
 *          // 'episodeName=my-episode-name',                   // search based on episode name
 *          'created>=2022-01-03T20:30:53.054Z',                // looks for any chats created after Jan 3rd 2022
 *      ],
 *      sort: ['+chat.created'],    // sort all findings by the 'created' field (ascending)
 *      first: 3,                   // page should start with the 4th item found (defaults to 0)
 *      max: 10,                    // page should only include the first 10 items
 * });
 * @param searchOptions Search options -- for more on Epicenter search options go [here](NOOP link)
 * @param [optionals]   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @returns A page for the list of chats found
 */
export async function query(
    searchOptions: GenericSearchOptions,
    optionals: RoutingOptions = {}
): Promise<Page<Chat>> {
    const { filter = [], sort = [], first = 0, max } = searchOptions;
    const searchParams = {
        filter: filter.join(';') || undefined,
        sort: sort.join(';') || undefined,
        first, max,
    };
    return await new Router()
        .withSearchParams(searchParams)
        .get('/chat', {
            paginated: true,
            ...optionals,
        })
        .then(({ body }) => body);
}

/**
 * Sends a message to a chat
 * @example
 * epicenter.chatAdapter.sendMessage('0000017dd3bf540e5ada5b1e058f08f20461', 'hello');
 * epicenter.chatAdapter.sendMessage('0000017dd3bf540e5ada5b1e058f08f20461', 'hello, privately', { userKey: '000001796733eef0842f4d6d960997018a33' });
 * @param chatKey               Key associated with the chat
 * @param message               Message text to send
 * @param [optionals]           Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.userKey]   Key of the user to send the message to. If omitted, will send as a public message
 * @returns The chat message created
 */
export async function sendMessage(
    chatKey: string,
    message: string,
    optionals: { userKey?: string } & RoutingOptions = {}
): Promise<ChatMessage> {
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
 * @example
 * // gets the chat message with id: 5
 * epicenter.chatAdapter.getMessages('0000017dd3bf540e5ada5b1e058f08f20461', { horizon: 5, maxRecords: 1 });
 * // gets the 10 chat messages starting from id 5 (inclusive)
 * epicenter.chatAdapter.getMessages('0000017dd3bf540e5ada5b1e058f08f20461', { horizon: 5, maxRecords: 10 });
 * @param chatKey                   Key associated with the chat
 * @param [optionals]               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.maxRecords]    Maximum number of messages to get
 * @param [optionals.horizon]       The message ID from which to start with; works backwards so if `maxRecords=20` and `horizon=50`, it will get the 20 messages starting from message ID 50, working backwards (50, 49, 48..., etc.). If this value is omitted the platform assumes it is the most recent message in the chat
 * @returns The list chat messages requested
 */
export async function getMessages(
    chatKey: string,
    optionals: {
        maxRecords?: number,
        horizon?: number,
    } & RoutingOptions = {}
): Promise<ChatMessage[]> {
    const { maxRecords, horizon, ...routingOptions } = optionals;
    return new Router()
        .withSearchParams({ maxRecords, horizon })
        .get(`/chat/message/${chatKey}`, routingOptions)
        .then(({ body }) => body);
}
