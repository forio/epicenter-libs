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

document.getElementById('create-task').addEventListener('click', (event) => {
    event.preventDefault();
    const name = 'test-task-increment';
    const payload = {
        method: 'GET',
        url: 'http://bbc3-69-143-204-30.ngrok.io/increment',
    };
    const trigger = {
        minutes: 1,
        hours: 0,
        days: 0,
        objectType: 'offset',
    };
    taskAdapter.create(scope, name, payload, trigger);
    // taskID: 0000017c1470ec86ea4ddf435aeebc5ac43d
});

document.getElementById('delete-task').addEventListener('click', (event) => {
    event.preventDefault();
    const taskId = document.getElementById('taskId').value;
    taskAdapter.destroy(taskId);
});