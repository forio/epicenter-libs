import type { RoutingOptions } from '../utils/router';
import type { TaskTriggerCreateInView } from './task';

import { Router } from '../utils';

export type OperatingSystem = 'LINUX' | 'MAC' | 'WINDOWS';

export type WorkerShape =
    | 'GS' | 'GM' | 'GL' | 'GXL' | 'G2XL' | 'G4XL'
    | 'ML' | 'MXL' | 'M2XL' | 'M4XL'
    | 'CL' | 'CXL' | 'C2XL' | 'C4XL';

export type ScaleFlavor = 'PROCESS' | 'DOCKER' | 'JVM' | 'WSDL';

export interface ScaleCreateInView {
    active: boolean;
    initialWorkerCount: number;
    additionalWorkerLimit: number;
    flavors?: ScaleFlavor[];
}

export interface ScaleReadOutView {
    active?: boolean | null;
    initialWorkerCount?: number | null;
    additionalWorkerLimit?: number | null;
    flavors?: ScaleFlavor[] | null;
    test?: boolean | null;
    shape?: WorkerShape | null;
    operatingSystem?: OperatingSystem | null;
}

export interface ScaleDocketPayloadCreateInView {
    objectType: 'scale';
    scale: ScaleCreateInView;
    operatingSystem: OperatingSystem;
    workerShape: WorkerShape;
    test?: boolean;
}

export interface ScaleDocketPayloadReadOutView {
    objectType: 'scale';
    scale?: ScaleReadOutView | null;
    operatingSystem?: OperatingSystem | null;
    workerShape?: WorkerShape | null;
    test?: boolean | null;
}

export type DocketPayloadCreateInView = ScaleDocketPayloadCreateInView;
export type DocketPayloadReadOutView = ScaleDocketPayloadReadOutView;

export interface DocketReadOutView {
    docketKey?: string | null;
    date?: string | null;
    payload?: DocketPayloadReadOutView | null;
    ttlMinutes?: number | null;
    complete?: boolean | null;
    error?: string | null;
    attempts?: number | null;
}


/**
 * Creates a new docket entry, scheduling a deferred operation for later execution.
 * Requires `support` level authorization.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/docket`
 *
 * @example
 * import { docketAdapter } from 'epicenter-libs';
 * const docket = await docketAdapter.create(
 *     {
 *         objectType: 'scale',
 *         operatingSystem: 'LINUX',
 *         workerShape: 'GS',
 *         scale: {
 *             active: true,
 *             initialWorkerCount: 1,
 *             additionalWorkerLimit: 4,
 *             flavors: ['DOCKER'],
 *         },
 *     },
 *     { objectType: 'date', value: '2026-06-01T00:00:00Z' },
 *     '2026-05-20T00:00:00Z',
 *     { ttlMinutes: 60 },
 * );
 *
 * @param payload                   Docket payload describing the operation to schedule
 * @param trigger                   Trigger describing when the operation should fire
 *                                  (cron, date, or offset)
 * @param date                      ISO-8601 date string indicating when the docket is scheduled
 * @param [optionals]               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.ttlMinutes]    Time-to-live in minutes for the docket entry (minimum 2)
 * @returns promise that resolves to the newly created docket
 */
export async function create(
    payload: DocketPayloadCreateInView,
    trigger: TaskTriggerCreateInView,
    date: string,
    optionals: {
        ttlMinutes?: number;
    } & RoutingOptions = {},
): Promise<DocketReadOutView> {
    const { ttlMinutes, ...routingOptions } = optionals;
    return await new Router()
        .post('/docket', {
            body: { payload, trigger, date, ttlMinutes },
            ...routingOptions,
        })
        .then(({ body }) => body);
}
