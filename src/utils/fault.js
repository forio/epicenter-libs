
/* For failed network calls */
export default class Fault extends Error {

    constructor(status, error) {

        super();

        const { information, message, cause } = error;
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