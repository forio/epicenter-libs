/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

interface Response {
    status: number,
    headers: Headers,
}

/* For network call responses */
export default class Result {
    status;
    headers;
    body;

    constructor(body: any, response: Response) {
        const { status, headers } = response;
        this.status = status;
        this.headers = headers;
        this.body = body;
    }
}