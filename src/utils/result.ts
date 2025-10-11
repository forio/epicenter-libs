

/* For network call responses */
export default class Result {
    status;
    headers;
    body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(body: any, response: Response) {
        const { status, headers } = response;
        this.status = status;
        this.headers = headers;
        this.body = body;
    }
}