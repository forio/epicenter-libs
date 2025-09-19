import { describe, it, expect, afterAll } from 'vitest';
import { ACCOUNT, PROJECT } from './common';

describe('Global Configuration', () => {
    const { config } = epicenter;

    afterAll(() => {
        config.setContext({
            accountShortName: ACCOUNT,
            projectShortName: PROJECT,
            useProjectProxy: false,
        });
    });

    it('Should be able to detect test site is using localhost', () => {
        expect(config.isLocal()).toBe(true);
    });

    it('Should initialize with the proper protocol and host in a test environment', () => {
        expect(config.apiProtocol).toBe('https');
        expect(config.apiHost).toBe('forio.com');
    });

    it('Should accept config object via setContext', () => {
        config.setContext({
            apiProtocol: 'http',
            apiHost: 'localhost',
            useProjectProxy: true,
            accountShortName: 'account',
            projectShortName: 'project',
        });

        expect(config.apiProtocol).toBe('http');
        expect(config.apiHost).toBe('localhost');
        expect(config.useProjectProxy).toBe(true);
        expect(config.accountShortName).toBe('account');
        expect(config.projectShortName).toBe('project');

        config.setContext({
            useProjectProxy: false,
        });

        expect(config.useProjectProxy).toBe(false);
    });

    it('Should ignore sets for apiProtocol when setting values that aren\'t http', () => {
        config.apiProtocol = 'anything else';
        expect(config.apiProtocol).not.toBe('anything else');

        config.setContext({
            apiProtocol: 'anything else',
        });
        expect(config.apiProtocol).not.toBe('anything else');
    });

    it('Should ignore sets for apiVersion', () => {
        config.apiVersion = 100;
        expect(config.apiVersion).not.toBe(100);

        config.setContext({
            apiVersion: 100,
        });
        expect(config.apiVersion).not.toBe(100);
    });
});
