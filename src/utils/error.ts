
/* Generic throwable error */
export default class EpicenterError extends Error {
    code?: string;
    constructor(message?: string, code?: string) {
        super(message);
        this.code = code;
    }
}
