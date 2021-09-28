import './config';
import { taskAdapter, authAdapter, SCOPE_BOUNDARY } from 'epicenter';

const session = authAdapter.getLocalSession();

if (!session) {
    window.location = '/login.html';
}

const scope = {
    scopeBoundary: SCOPE_BOUNDARY.GROUP,
    scopeKey: session.groupKey,
};

const pseudonymKey = '0000017c1470ec86ea4ddf435aeebc5abfb1';

document.getElementById('create-task').addEventListener('click', (event) => {
    event.preventDefault();
    const taskName = document.getElementById('task-name').value;
    const defaultName = 'test-task-increment';
    const payload = {
        method: 'GET',
        url: '/increment',
    };
    const trigger = {
        minutes: 1,
        hours: 0,
        days: 0,
        objectType: 'offset',
    };
    const cronTrigger = {
        value: '1 * * * * ?', //triggers every minute
        objectType: 'cron',
    };
    const optionals = {

    };
    taskAdapter.create(scope, taskName ?? defaultName, payload, cronTrigger);
    // taskID: 0000017c1470ec86ea4ddf435aeebc5ac43d
});

document.getElementById('delete-task').addEventListener('click', (event) => {
    event.preventDefault();
    const taskId = document.getElementById('taskId').value;
    taskAdapter.destroy(taskId);
});

document.getElementById('get-task').addEventListener('click', (event) => {
    event.preventDefault();
    const taskId = document.getElementById('taskId').value;
    taskAdapter.get(taskId);
});

document.getElementById('get-task-history').addEventListener('click', (event) => {
    event.preventDefault();
    const taskId = document.getElementById('taskId').value;
    taskAdapter.getHistory(taskId);
});

document.getElementById('get-task-in').addEventListener('click', (event) => {
    event.preventDefault();
    taskAdapter.getTaskIn(scope);
});

document.getElementById('get-task-in-2').addEventListener('click', (event) => {
    event.preventDefault();
    taskAdapter.getTaskIn(scope, { pseudonymKey });
});