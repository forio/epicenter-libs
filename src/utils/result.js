
/* For network call responses */
export default class Result {

    constructor(status, headers, body) {

        this.status = status;
        this.headers = headers;
        this.body = body;

    }
}