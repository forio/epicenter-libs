

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