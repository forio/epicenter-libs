import EpicenterError from './error';

interface ErrorBody {
    status?: number,
    message: string,
    information?: {
        code: string,
        [key: string]: unknown,
    },
    cause?: unknown,
}


/* For failed network calls */
export default class Fault extends EpicenterError {
    status?: number;
    information?: Record<string, unknown>;
    cause?: unknown;

    constructor(body: ErrorBody, response?: Response) {
        super(
            body.message,
            body.information?.code
        );

        const { information, message, cause, status } = body;
        this.status = status ?? response?.status;
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