/* eslint-disable @typescript-eslint/no-explicit-any */
type FIXME = any;

type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | {[key: string]: JSONValue};

interface JSONObject {
    [k: string]: JSONValue
}

type JSONArray = Array<JSONValue>;