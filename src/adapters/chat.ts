import type { GenericScope, Permit } from '../utils/constants';
import type { RoutingOptions } from '../utils/router';
import Router from '../utils/router';

interface ChatMessage {
    senderKey: string,
    receiverKey: string,
    created: string,
    id: string,
    message: string,
}

interface Chat extends GenericScope {
    permit: Permit,
    chatKey: string,
    messages: ChatMessage[],
    room: string,
}

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

export async function create(
    room: string,
    scope: GenericScope,
    permit: Permit,
    optionals: RoutingOptions = {}
): Promise<Chat> {
    return new Router()
        .post('/chat', {
            ...optionals,
            body: {
                scopeBoundary: scope.scopeBoundary,
                scopeKey: scope.scopeKey,
                permit,
                room,
            },
        }).then(({ body }) => body);
}

export async function sendMessage(
    chatKey: string,
    message: string,
    optionals: { userKey?: string } & RoutingOptions = {}
): Promise<ChatMessage> {
    const { userKey, ...routingOptions } = optionals;
    const uriComponent = userKey ? `/${userKey}` : '';
    return new Router()
        .put(`/chat/message/${chatKey}${uriComponent}`, {
            ...routingOptions,
            body: { message },
        }).then(({ body }) => body);
}

export async function getMessages(
    chatKey: string,
    since: number,
    optionals: { maxRecords?: number } & RoutingOptions = {}
): Promise<ChatMessage[]> {
    const { maxRecords, ...routingOptions } = optionals;
    return new Router()
        .withSearchParams({ maxRecords })
        .get(`/chat/message/${chatKey}/${since}`, routingOptions)
        .then(({ body }) => body);
}
