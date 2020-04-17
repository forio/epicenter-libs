
/* For failed network calls */
export default class Fault extends Error {

    constructor(body, response) {

        super();
        const { status } = response;
        const { information, message, cause } = body;
        this.status = status;
        this.message = message;

        if (information) {
            const { code, ...rest } = information;
            this.code = code;
            this.information = rest;
        }
        if (cause) {
            this.cause = new Fault(cause);
        }
    }
}