
/* For network call responses */
export default class Result {

    constructor(body, response) {
        const { status, headers } = response;
        this.status = status;
        this.headers = headers;
        this.body = body;

    }
}