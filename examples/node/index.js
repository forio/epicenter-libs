
const { authAdapter, config } = require('epicenter');
const env = Object.assign({}, require('./env.json'), process.env);

config.accountShortName = 'harvard-test';
config.projectShortName = 'project-management';

authAdapter.login({ secretKey: env.APP_CLIENT_SECRET })
    .then((session) => {
        console.log('Success logging in', session);
    })
    .catch((error) => {
        console.log(error, JSON.stringify(error));
    });
