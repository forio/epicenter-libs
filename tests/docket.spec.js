import { describe, it, expect, beforeEach } from 'vitest';
import {
    createFetchMock,
    docketAdapter,
    GENERIC_OPTIONS,
    OK_CODE,
    getAuthHeader,
    testedMethods,
    getFunctionKeys,
} from './common.js';

const SCALE_PAYLOAD = {
    objectType: 'scale',
    operatingSystem: 'LINUX',
    workerShape: 'GS',
    scale: {
        active: true,
        initialWorkerCount: 1,
        additionalWorkerLimit: 4,
        flavors: ['DOCKER'],
    },
};

const DATE_TRIGGER = {
    objectType: 'date',
    value: '2026-06-01T00:00:00Z',
};

const SCHEDULE_DATE = '2026-05-20T00:00:00Z';
const TTL_MINUTES = 30;
const CRON_HOURS = 2;
const CRON_MINUTES = 30;

const DOCKET_READ_OUT = {
    docketKey: '00000168bad586135710e2d9104c12846820',
    date: SCHEDULE_DATE,
    payload: {
        objectType: 'scale',
        operatingSystem: 'LINUX',
        workerShape: 'GS',
        scale: {
            active: true,
            initialWorkerCount: 1,
            additionalWorkerLimit: 4,
            flavors: ['DOCKER'],
        },
        test: false,
    },
    ttlMinutes: 60,
    complete: false,
    error: null,
    attempts: 0,
};

describe('docketAdapter', () => {
    let fetchMock;
    beforeEach(() => {
        fetchMock = createFetchMock({
            '/docket': { body: DOCKET_READ_OUT, status: OK_CODE },
        });
    });

    describe('create', () => {
        it('should make a POST request to /docket', async () => {
            await docketAdapter.create(SCALE_PAYLOAD, DATE_TRIGGER, SCHEDULE_DATE, GENERIC_OPTIONS);
            testedMethods.add('create');

            const req = fetchMock.capturedRequests[0];
            expect(req.method).toBe('POST');
            expect(req.url).toContain('/docket');
        });

        it('should include the account and project in the URL', async () => {
            await docketAdapter.create(SCALE_PAYLOAD, DATE_TRIGGER, SCHEDULE_DATE, GENERIC_OPTIONS);
            const req = fetchMock.capturedRequests[0];
            expect(req.url).toContain(GENERIC_OPTIONS.accountShortName);
            expect(req.url).toContain(GENERIC_OPTIONS.projectShortName);
        });

        it('should include auth header', async () => {
            await docketAdapter.create(SCALE_PAYLOAD, DATE_TRIGGER, SCHEDULE_DATE, {
                ...GENERIC_OPTIONS,
                authorization: 'Bearer mytoken',
            });
            const req = fetchMock.capturedRequests[0];
            expect(getAuthHeader(req.requestHeaders)).toBe('Bearer mytoken');
        });

        it('should include payload, trigger, and date in the request body', async () => {
            await docketAdapter.create(SCALE_PAYLOAD, DATE_TRIGGER, SCHEDULE_DATE, GENERIC_OPTIONS);
            const req = fetchMock.capturedRequests[0];
            const body = JSON.parse(req.requestBody);
            expect(body.payload).toEqual(SCALE_PAYLOAD);
            expect(body.trigger).toEqual(DATE_TRIGGER);
            expect(body.date).toBe(SCHEDULE_DATE);
        });

        it('should include ttlMinutes in the request body when provided', async () => {
            await docketAdapter.create(SCALE_PAYLOAD, DATE_TRIGGER, SCHEDULE_DATE, {
                ...GENERIC_OPTIONS,
                ttlMinutes: TTL_MINUTES,
            });
            const req = fetchMock.capturedRequests[0];
            const body = JSON.parse(req.requestBody);
            expect(body.ttlMinutes).toBe(TTL_MINUTES);
        });

        it('should accept cron triggers', async () => {
            const cronTrigger = { objectType: 'cron', value: '0 0 * * *' };
            await docketAdapter.create(SCALE_PAYLOAD, cronTrigger, SCHEDULE_DATE, GENERIC_OPTIONS);
            const req = fetchMock.capturedRequests[0];
            const body = JSON.parse(req.requestBody);
            expect(body.trigger).toEqual(cronTrigger);
        });

        it('should accept offset triggers', async () => {
            const offsetTrigger = { objectType: 'offset', minutes: CRON_MINUTES, hours: CRON_HOURS };
            await docketAdapter.create(SCALE_PAYLOAD, offsetTrigger, SCHEDULE_DATE, GENERIC_OPTIONS);
            const req = fetchMock.capturedRequests[0];
            const body = JSON.parse(req.requestBody);
            expect(body.trigger).toEqual(offsetTrigger);
        });

        it('should return the created docket', async () => {
            const result = await docketAdapter.create(SCALE_PAYLOAD, DATE_TRIGGER, SCHEDULE_DATE, GENERIC_OPTIONS);
            expect(result.docketKey).toBe(DOCKET_READ_OUT.docketKey);
            expect(result.complete).toBe(false);
        });

        it('should preserve the full response shape', async () => {
            const result = await docketAdapter.create(SCALE_PAYLOAD, DATE_TRIGGER, SCHEDULE_DATE, GENERIC_OPTIONS);
            expect(result).toEqual(DOCKET_READ_OUT);
        });

        it('should omit ttlMinutes from the body when not provided', async () => {
            await docketAdapter.create(SCALE_PAYLOAD, DATE_TRIGGER, SCHEDULE_DATE, GENERIC_OPTIONS);
            const req = fetchMock.capturedRequests[0];
            const body = JSON.parse(req.requestBody);
            expect(body.ttlMinutes).toBeUndefined();
        });

        it('should preserve the test flag on the scale payload', async () => {
            const testPayload = { ...SCALE_PAYLOAD, test: true };
            await docketAdapter.create(testPayload, DATE_TRIGGER, SCHEDULE_DATE, GENERIC_OPTIONS);
            const req = fetchMock.capturedRequests[0];
            const body = JSON.parse(req.requestBody);
            expect(body.payload.test).toBe(true);
        });
    });

    it('should have tests for all exported functions', () => {
        const allFunctions = getFunctionKeys(docketAdapter);
        const untestedMethods = [...allFunctions].filter((method) => !testedMethods.has(method));
        expect(untestedMethods).toEqual([]);
    });
});
