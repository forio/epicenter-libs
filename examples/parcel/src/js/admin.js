import './config';
import { taskAdapter, authAdapter, SCOPE_BOUNDARY, somebodyAdapter } from 'epicenter-libs';
// Use below to import from local build
// import { taskAdapter, authAdapter, SCOPE_BOUNDARY, somebodyAdapter } from 'epicenter';

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
    const dateTrigger = {
        value: '2021-11-29T13:30:30-04:00',
        objectType: 'date',
    };
    const optionals = {

    };
    taskAdapter.create(scope, taskName ?? defaultName, payload, dateTrigger);
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

document.getElementById('create-somebody').addEventListener('click', (event) => {
    event.preventDefault();
    const email = 'test4@test.com';
    const optionals = {
        givenName: 'Test',
        familyName: 'McTest',
    };
    console.log('sombodye', somebodyAdapter);
    somebodyAdapter.create(email, optionals);
});

document.getElementById('search-somebody').addEventListener('click', (event) => {
    event.preventDefault();
    somebodyAdapter.query({
        filter: [
            'email|=test4@test.com|test2@test.com',         // looks for any rooms with the names provided
            // 'givenName=Person',                              // used in conjunction with the scopeBoundary
            // 'familyName=PersonLastName',  // searches for a specific chat
            // 'accountId=0000017dd3bf540e5ada5b1e058f08f20461',  // searches for a specific accountId
            // 'accountShortName=acme',                         // specifies the account, typically unnecessary
            // 'projectShortName=simulations',                  // specifies the project, typically unnecessary

        ],
        sort: ['-somebody.email'],    // sort all findings by the 'created' field (ascending)
        // first: 3,                   // page should start with the 4th item found (defaults to 0)
        // max: 10,                    // page should only include the first 10 items
        count: false,               // If set to true this will return the number of somebodies that match the search
    });
});