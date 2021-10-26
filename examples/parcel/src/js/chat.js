import './config';
import { authAdapter, chatAdapter, ROLE, SCOPE_BOUNDARY } from 'epicenter';
const session = authAdapter.getLocalSession();

/* Define DOM elements */
const unauthedEl = document.getElementById('unauthed');
const chatroomListingsEl = document.getElementById('chatroom-listings');
const chatCreateEl = document.getElementById('chat-create');
const chatroomNameEl = document.getElementById('chatroom-name');

/* Internal state */
const chatrooms = [];

const renderChatrooms = () => {
    chatroomListingsEl.innerHTML = '';
    chatrooms.forEach((chat) => {
        const listing = document.createElement('li');
        listing.innerText = chat.room;
        chatroomListingsEl.append(listing);
    });
};

const initialize = () => {
    chatCreateEl.onclick = async(e) => {
        const scope = {
            scopeBoundary: SCOPE_BOUNDARY.GROUP,
            scopeKey: session.groupKey,
        };
        const permit = {
            readLock: ROLE.PARTICIPANT,
            writeLock: ROLE.PARTICIPANT,
        };
        const roomName = chatroomNameEl.value;
        const chat = await chatAdapter.create(roomName, scope, permit);
        chatrooms.push(chat);
        renderChatrooms();
    };
};

if (!session) {
    unauthedEl.classList.remove('hidden');
} else {
    initialize();
}