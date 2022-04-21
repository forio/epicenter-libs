import './config';
import { authAdapter, chatAdapter, ROLE, SCOPE_BOUNDARY, PUSH_CATEGORY, Channel, groupAdapter } from 'epicenter';
import { showLoading, hideLoading } from './common';
const session = authAdapter.getLocalSession();

/* Define DOM elements */
const unauthedEl = document.getElementById('unauthed');
const chatroomListingsEl = document.getElementById('chatroom-listings');
const chatCreateEl = document.getElementById('chat-create');
const chatroomNameEl = document.getElementById('chatroom-name');
const chatroomEl = document.getElementById('chatroom');
const addListingEl = document.getElementById('add-listing');
const chatKeyEl = document.getElementById('chat-key');
const messageFormEl = document.getElementById('message-form');
const messageInputEl = document.getElementById('message');
const whisperFormEl = document.getElementById('whisper-form');
const whisperInputEl = document.getElementById('whisper');
const whisperUserEl = document.getElementById('whisper-user');
const roomQueryInputEl = document.getElementById('room-query');
const findRoomEl = document.getElementById('find-room');
const roomFindingsEl = document.getElementById('room-findings');

/* Internal state */
const scope = {
    scopeBoundary: SCOPE_BOUNDARY.GROUP,
    scopeKey: session.groupKey,
};
const chatrooms = [

];
const colors = {};
let currentChat;

/* Utilities */
const SIX = 6;
const toChatroomString = (chat) => {
    return `${chat.room || 'N/A'} (${chat.chatKey.slice(-SIX)})`;
};
const getRandomColor = (senderKey) => {
    if (!colors[senderKey]) {
        const RGB_MAX = 165; // should be 256, but I want to exclude brighter values
        const RED = Math.floor(Math.random() * RGB_MAX);
        const GREEN = Math.floor(Math.random() * RGB_MAX);
        const BLUE = Math.floor(Math.random() * RGB_MAX);
        colors[senderKey] = `rgb(${RED}, ${GREEN}, ${BLUE})`;
    }
    return colors[senderKey];
};


/* Rendering (HTML DOM handling) functions */
const renderNewMessage = ({ id, senderKey, receiverKey, message }) => {
    const existingEl = document.getElementById(`msg-${id}`);
    // Do nothing for private messages
    if (receiverKey && (
        receiverKey !== session.userKey &&
        senderKey !== session.userKey
    )) return undefined;
    // Do nothing the element exists (trust that it will be properly updated by other parts of the UI)
    if (existingEl) return existingEl;

    const messageEl = document.createElement('span');
    messageEl.classList.add('message');
    if (id === 'system') {
        messageEl.classList.add('message--system');
    } else {
        messageEl.style.setProperty('color', getRandomColor(senderKey));
        messageEl.classList.add(`message--${senderKey === session.userKey ? 'you' : 'peer'}`);
    }
    if (receiverKey) {
        messageEl.style.setProperty('color', 'limegreen');
        const suffix = senderKey === session.userKey ?
            `to ${receiverKey.slice(-SIX)}` :
            `from ${senderKey.slice(-SIX)}`;
        messageEl.innerText = `${message} (${suffix})`;
    } else {
        messageEl.innerText = message;
    }
    if (!id) {
        messageEl.classList.add('message--ephemoral');
    } else {
        messageEl.setAttribute('id', `msg-${id}`);
    }
    chatroomEl.append(messageEl);
    messageEl.scrollIntoView({ behavior: 'smooth' });
    return messageEl;
};

const renderCurrentChat = async() => {
    if (!currentChat) return;
    chatroomEl.innerHTML = '';
    const headingMessageEl = document.createElement('span');
    headingMessageEl.classList.add('message', 'message--system');
    renderNewMessage({
        id: 'system',
        message: `Viewing room: ${toChatroomString(currentChat)}`,
    });
    showLoading();
    const messages = await chatAdapter.getMessages(currentChat.chatKey);
    hideLoading();
    messages.reverse().forEach((message) => {
        renderNewMessage(message);
    });
    await new Channel({
        ...scope,
        pushCategory: PUSH_CATEGORY.CHAT,
    }).subscribe(async(data) => {
        if (data.content.chatMessage.senderKey !== session.userKey) {
            if (data.type === 'BROADCAST') {
                renderNewMessage(data.content.chatMessage);
            } else if (data.type === 'TARGETED') {
                const privateMessage = (await chatAdapter.getMessages(
                    currentChat.chatKey,
                    {
                        horizon: data.content.chatMessage.id,
                        maxRecords: 1,
                    },
                ))[0];
                renderNewMessage(privateMessage);
            }
        }

    });
};

const renderListing = (chat) => {
    const listingEl = document.createElement('li');
    const anchorEl = document.createElement('a');
    anchorEl.innerText = toChatroomString(chat);
    anchorEl.classList.add('link-button');
    anchorEl.onclick = () => {
        currentChat = chat;
        renderCurrentChat();
    };
    listingEl.append(anchorEl);
    return listingEl;
};

const renderChatrooms = () => {
    chatroomListingsEl.innerHTML = '';
    if (chatrooms.length === 0) {
        chatroomListingsEl.innerText = 'None found.';
        return;
    }
    chatrooms.forEach((chat) => {
        const listing = renderListing(chat);
        chatroomListingsEl.append(listing);
    });
};

const renderUserOptions = async() => {
    showLoading();
    const group = await groupAdapter.get({ augment: 'MEMBERS' });
    whisperUserEl.innerHTML = '';
    group.members.forEach(({ user, role }) => {
        const { userKey, displayName } = user;
        if (
            role.toUpperCase() !== 'PARTICIPANT' ||
            userKey === session.userKey
        ) {
            return;
        }
        const optionEl = document.createElement('option');
        optionEl.value = userKey;
        optionEl.innerText = displayName;
        whisperUserEl.append(optionEl);
    });
    hideLoading();
};


const initialize = () => {
    /* Attach event listeners */
    chatCreateEl.onclick = async() => {
        showLoading();
        const permit = {
            readLock: ROLE.PARTICIPANT,
            writeLock: ROLE.PARTICIPANT,
        };
        const roomName = chatroomNameEl.value;
        chatroomNameEl.value = '';
        const chat = await chatAdapter.create(roomName, scope, permit);
        chatrooms.push(chat);
        renderChatrooms();
        hideLoading();
    };
    addListingEl.onclick = async() => {
        showLoading();
        const chatKey = chatKeyEl.value;
        const chat = await chatAdapter.get(chatKey);
        if (!chatrooms.find((c) => c.chatKey === chat.chatKey)) {
            chatrooms.push(chat);
        }
        renderChatrooms();
        hideLoading();
    };
    messageFormEl.onsubmit = async(e) => {
        e.preventDefault();
        const yourMessage = messageInputEl.value;
        if (!yourMessage || !currentChat) return;
        messageInputEl.value = '';
        const newMessageEl = renderNewMessage({
            message: yourMessage,
            senderKey: session.userKey,
        });
        const serializedMessage = await chatAdapter.sendMessage(currentChat.chatKey, yourMessage);
        newMessageEl.setAttribute('id', `msg-${serializedMessage.id}`);
        newMessageEl.classList.remove('message--ephemoral');
    };

    whisperFormEl.onsubmit = async(e) => {
        e.preventDefault();
        const yourMessage = whisperInputEl.value;
        const whisperUser = whisperUserEl.value;
        if (!yourMessage || !currentChat) return;
        whisperInputEl.value = '';
        const newMessageEl = renderNewMessage({
            message: yourMessage,
            senderKey: session.userKey,
            receiverKey: whisperUser,
        });
        const serializedMessage = await chatAdapter.sendMessage(currentChat.chatKey, yourMessage, { userKey: whisperUser });
        newMessageEl.setAttribute('id', `msg-${serializedMessage.id}`);
        newMessageEl.classList.remove('message--ephemoral');
    };

    findRoomEl.onclick = async(e) => {
        e.preventDefault();
        const room = roomQueryInputEl.value;
        if (!room) return;
        showLoading();
        const rooms = await chatAdapter.query({ filter: [`room=${room}`]});
        // await chatAdapter.query({ filter: [`groupName=${groupName}`, `episodeName=${episodeName}`]});
        hideLoading();
    };

    /* Render */
    renderChatrooms();
    renderUserOptions();
};

if (!session) {
    unauthedEl.classList.remove('hidden');
} else {
    initialize();
}