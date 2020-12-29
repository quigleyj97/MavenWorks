import { uuid4 } from "./uuid";

export class CancelError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}

export class CancelToken<T> {
    guid: string;
    promise: Promise<T | undefined>;
    isCanceled: boolean;
    private resolve: ((value?: T | PromiseLike<T>) => void) | undefined;

    constructor() {
        this.promise = new Promise<T | undefined>(res => this.resolve = res);
        this.guid = uuid4();
        this.isCanceled = false;
    }

    onCancel(func: ((value?: T | PromiseLike<T>) => void)) {
        this.promise.then(func);
    }

    cancel() {
        if (!this.isCanceled) {
            this.isCanceled = true;
            this.resolve!(void 0);
        }
    }
}
