import sinon from 'sinon';
import chai from 'chai';
import { ACCOUNT, PROJECT, SESSION } from './constants';
chai.use(require('sinon-chai'));

describe('Project APIs', () => {
    const { config, projectAdapter, authAdapter } = epicenter;
    let fakeServer;
    const testedMethods = [];

    config.accountShortName = ACCOUNT;
    config.projectShortName = PROJECT;

    before(() => {
        fakeServer = sinon.fakeServer.create();
        authAdapter.setLocalSession(SESSION);

        fakeServer.respondImmediately = true;
    });

    after(() => {
        fakeServer.restore();
        authAdapter.setLocalSession(undefined);
    });

    describe('projectAdapter.channelsEnabled', () => {
        // TODO -- flesh this out when you get the chance
        testedMethods.push('channelsEnabled');
    });

    describe('projectAdapter.get', () => {
        // TODO -- flesh this out when you get the chance
        testedMethods.push('get');
    });

    describe('projectAdapter.list', () => {
        // TODO -- flesh this out when you get the chance
        testedMethods.push('list');
    });

    it('Should not have any untested methods', () => {
        chai.expect(projectAdapter).to.have.all.keys(...testedMethods);
    });
});
