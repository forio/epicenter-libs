import './config';
import { showLoading, hideLoading } from './common';
import {
    groupAdapter, authAdapter, presenceAdapter, timeAdapter, leaderboardAdapter,
    Channel, SCOPE_BOUNDARY, PUSH_CATEGORY,
} from 'epicenter';

const session = authAdapter.getLocalSession();

/* Define DOM elements */
const unauthedEl = document.getElementById('unauthed');
const chatFormEl = document.getElementById('chat-form');
const updateLeaderboardEl = document.getElementById('update-leaderboard-form');
const getLeaderboardEl = document.getElementById('get-leaderboard-form');
const scoresEl = document.getElementById('scores');
const tagsEl = document.getElementById('tags');
const filtersEl = document.getElementById('filters');
const leaderboardEl = document.getElementById('leaderboard');
const chatInputEl = document.getElementById('text-box');
const submitEl = document.getElementById('submit');
const timeEl = document.getElementById('time');

const initialize = () => {
    groupAdapter.search({
        filter: [
            // `group.name|=${'wallace-dev-1-oct-2020'}|${'wallace-dev-2-oct-2020'}`,
            'permission.role=PARTICIPANT',
            `user.userKey=${session.userKey}`,
        ],
        // sort: ['+group.name'],
        first: 0,
        max: 2,
    });
    presenceAdapter.connect();
    let waiting = false;
    chatFormEl.onsubmit = (e) => {
        e.preventDefault();
        if (waiting) return;
        const value = chatInputEl.value;
        new Channel({
            scopeBoundary: SCOPE_BOUNDARY.GROUP,
            scopeKey: session.groupKey,
            pushCategory: PUSH_CATEGORY.CHAT,
        }).publish({
            user: session.displayName,
            text: value,
        });
        waiting = true;
        chatInputEl.value = '';
        submitEl.disabled = true;
        submitEl.innerText = 'Sent';
        setTimeout(() => {
            submitEl.disabled = false;
            submitEl.innerText = 'Send';
            waiting = false;
        }, 10);
    };
    timeEl.onclick = (e) => {
        e.preventDefault();
        timeAdapter.get().then((time) => console.log(time));
    };
    updateLeaderboardEl.onsubmit = async(e) => {
        e.preventDefault();
        const inputs = Array.from(updateLeaderboardEl.getElementsByTagName('input'));
        const scores = [];
        Array.from(scoresEl.getElementsByTagName('input')).forEach((inputEl) => {
            if (!inputEl.value) return;
            scores.push({
                name: inputEl.name,
                quantity: parseInt(inputEl.value, 10),
            });
        });
        const tags = [];
        Array.from(tagsEl.getElementsByTagName('select')).forEach((inputEl) => {
            if (inputEl.value === 'none') return;
            tags.push({
                label: inputEl.name,
                content: inputEl.value,
            });
        });
        try {
            showLoading();
            await leaderboardAdapter.update('my-leaderboard', scores, {
                scopeBoundary: SCOPE_BOUNDARY.GROUP,
                scopeKey: session.groupKey,
            }, { tags });
            inputs.forEach((inputEl) => {
                inputEl.value = '';
            });
        } catch (error) {
            console.log('%c Something went wrong', 'font-size: 20px; color: #FB15B9FF;', error);
        } finally {
            hideLoading();
        }
    };
    const renderLeaderboard = (entries) => {
        // Empty leaderboard
        while (leaderboardEl.firstChild) {
            leaderboardEl.firstChild.remove();
        }
        // Repopulate
        entries.forEach((entry) => {
            const LAST_FOUR = -4;
            const user = document.createElement('td');
            user.append(entry.scope.userKey.slice(LAST_FOUR));

            const points = document.createElement('td');
            points.append(entry.scores.find((score) => score.name === 'points')?.quantity ?? '');

            const marketShare = document.createElement('td');
            marketShare.append(entry.scores.find((score) => score.name === 'market-share')?.quantity ?? '');

            const tags = document.createElement('td');
            tags.append((entry.tags ?? []).reduce((t, { content }) => `${t} ${content}`, ''));

            const row = document.createElement('tr');
            row.append(user, points, marketShare, tags);
            leaderboardEl.append(row);
        });
    };

    getLeaderboardEl.onsubmit = async(e) => {
        e.preventDefault();
        const filters = [];
        Array.from(filtersEl.getElementsByTagName('input')).forEach((inputEl) => {
            if (!inputEl.checked) return;
            filters.push(inputEl.value);
        });
        try {
            showLoading();
            const entries = await leaderboardAdapter.get('my-leaderboard', {
                scopeBoundary: SCOPE_BOUNDARY.GROUP,
                scopeKey: session.groupKey,
            }, {
                filter: filters,
                sort: [],
            });
            renderLeaderboard(entries);
        } catch (error) {
            console.log('%c Something went wrong', 'font-size: 20px; color: #FB15B9FF;', error);
        } finally {
            hideLoading();
        }
    };
};

if (!session) {
    unauthedEl.classList.remove('hidden');
} else {
    initialize();
}