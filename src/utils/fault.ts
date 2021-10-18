
interface ErrorBody {
    message: string,
    information?: {
        code: string,
    },
    cause?: unknown,
}


/* For failed network calls */
export default class Fault extends Error {
    status?: number;
    code?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    information?: Record<string, any>;
    cause?: unknown;

    constructor(body: ErrorBody, response: Response) {

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
            this.cause = cause;
        }
    }
}