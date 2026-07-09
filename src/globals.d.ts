/* eslint-disable @typescript-eslint/no-explicit-any */
type FIXME = any;

type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | { [key: string]: JSONValue };

interface JSONObject {
    [k: string]: JSONValue;
}

type JSONArray = Array<JSONValue>;

/* Build-time constants injected by @rollup/plugin-replace (shipped bundles)
 * and Vite's `define` (tests). See src/epicenter.ts. */
declare const __VERSION__: string;
declare const __BUILD__: string;
declare const __DATE__: string;
