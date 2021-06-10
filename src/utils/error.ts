
/* Generic throwable error */
export default class EpicenterError extends Error {

    constructor(message: string) {

        super(message);

    }
}