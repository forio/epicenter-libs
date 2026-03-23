import fetch from 'cross-fetch';

import type { RoutingOptions } from '../utils/router';
import { Router, identification, config } from '../utils';

export type TemplateDirectory = 'DATA' | 'MODEL';

// ──────────────────────────────────────────────
// Data Points
// ──────────────────────────────────────────────

export interface NDataPoint {
    n?: number | null;
}

export interface XYDataPoint {
    x?: number | null;
    y?: number | null;
}

// ──────────────────────────────────────────────
// Chart Series
// ──────────────────────────────────────────────

export interface BarSeriesShadow {
    objectType: 'bar';
    name?: string;
    data?: NDataPoint[] | null;
}

export interface AreaSeriesShadow {
    objectType: 'area';
    name?: string;
    data?: NDataPoint[] | null;
}

export interface LineSeriesShadow {
    objectType: 'line';
    name?: string;
    data?: NDataPoint[] | null;
}

export interface PieSeriesShadow {
    objectType: 'pie';
    name?: string;
    data?: NDataPoint[] | null;
}

export interface ScatterSeriesShadow {
    objectType: 'scatter';
    name?: string;
    data?: XYDataPoint[] | null;
}

export interface YSeriesShadow {
    objectType: 'y';
    name?: string;
    data?: number[] | null;
}

export interface XYSeriesShadow {
    objectType: 'xy';
    name?: string;
    data?: XYDataPoint[] | null;
}

export type SeriesShadow =
    | BarSeriesShadow
    | AreaSeriesShadow
    | LineSeriesShadow
    | PieSeriesShadow
    | ScatterSeriesShadow
    | YSeriesShadow
    | XYSeriesShadow;

// ──────────────────────────────────────────────
// Chart, Table, Picture
// ──────────────────────────────────────────────

export interface ChartShadow {
    name?: string;
    categories?: unknown[] | null;
    series?: SeriesShadow[] | null;
}

export interface TableShadow {
    name?: string;
    header?: unknown;
    data?: unknown[] | null;
}

export interface PictureShadow {
    name?: string;
    data?: BinaryData;
}

// ──────────────────────────────────────────────
// Binary Data
// ──────────────────────────────────────────────

export interface BinaryData {
    encoding: 'HEX' | 'BASE_64';
    data: unknown;
    encryption?: 'AES' | null;
    name?: string | null;
    content_type?: string | null;
    contentType?: unknown;
}

// ──────────────────────────────────────────────
// Environment, Slide, Document
// ──────────────────────────────────────────────

export interface EnvironmentShadow {
    parameters?: Record<string, unknown> | null;
    charts?: ChartShadow[] | null;
    tables?: TableShadow[] | null;
    pictures?: PictureShadow[] | null;
}

export interface SlideShadow {
    /** Slide number (1-based) */
    number?: number;
    environment?: EnvironmentShadow;
}

export interface DocumentShadow {
    output?: string;
    environment?: EnvironmentShadow;
    slides?: SlideShadow[] | null;
}


/**
 * Generates a PowerPoint file from a template and returns it as binary data (JSON-encoded)
 * Base URL: PUT `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/powerpoint/{TEMPLATE_DIRECTORY}/{TEMPLATE_PATH}`
 *
 * @example
 * import { powerpointAdapter } from 'epicenter-libs';
 * const binaryData = await powerpointAdapter.generate('MODEL', 'en-US-debrief-template.pptx', {
 *     output: 'debrief-slides.pptx',
 *     environment: {},
 *     slides: [
 *         {
 *             number: 1,
 *             environment: {
 *                 tables: [{ name: 'Leaderboard', data: [['Rank', 'Name', 'Score']] }],
 *             },
 *         },
 *     ],
 * });
 *
 * @param templateDirectory     Directory where the template is stored: 'DATA' or 'MODEL'
 * @param templatePath          Path to the template file within the directory
 * @param document              Document shadow defining the output filename, environment, and slides
 * @param [optionals]           Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the generated PowerPoint as BinaryData
 */
export async function generate(
    templateDirectory: TemplateDirectory,
    templatePath: string,
    document: DocumentShadow,
    optionals: RoutingOptions = {},
): Promise<BinaryData> {
    return new Router()
        .put(`/powerpoint/${templateDirectory}/${templatePath}`, {
            body: document,
            ...optionals,
        }).then(({ body }) => body);
}


/**
 * Generates a PowerPoint file from a template and returns it as a streaming response.
 * Useful for downloading the generated file directly.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/powerpoint/{TEMPLATE_DIRECTORY}/{TEMPLATE_PATH}`
 *
 * @example
 * import { powerpointAdapter } from 'epicenter-libs';
 * const response = await powerpointAdapter.stream('MODEL', 'en-US-debrief-template.pptx', {
 *     output: 'debrief-slides.pptx',
 *     environment: {},
 *     slides: [],
 * });
 * const blob = await response.blob();
 *
 * @param templateDirectory     Directory where the template is stored: 'DATA' or 'MODEL'
 * @param templatePath          Path to the template file within the directory
 * @param document              Document shadow defining the output filename, environment, and slides
 * @param [optionals]           Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the raw Response for streaming/blob handling
 */
export async function stream(
    templateDirectory: TemplateDirectory,
    templatePath: string,
    document: DocumentShadow,
    optionals: RoutingOptions = {},
): Promise<Response> {
    const { server, accountShortName, projectShortName, useProjectProxy, query, headers: headersOverride, authorization, includeAuthorization } = optionals;
    const url = new Router().getURL(`/powerpoint/${templateDirectory}/${templatePath}`, {
        server,
        accountShortName,
        projectShortName,
        useProjectProxy,
        query,
    });

    const headers: Record<string, string> = {
        'Content-type': 'application/json; charset=UTF-8',
        ...headersOverride,
    };

    if (includeAuthorization !== false) {
        const { session } = identification;
        if (!headers.Authorization) {
            if (session) headers.Authorization = `Bearer ${session.token}`;
            if (authorization) headers.Authorization = authorization;
            if (config.authOverride) headers.Authorization = config.authOverride;
        }
    }

    return fetch(url.toString(), {
        method: 'POST',
        cache: 'no-cache',
        redirect: 'follow',
        headers,
        body: JSON.stringify(document),
    });
}
