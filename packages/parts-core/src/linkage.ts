import { Observable, Subject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { IDisposable } from "@mavenomics/coreutils";

export interface ILinkage extends IDisposable {
    getValue(): unknown;
    setValue?(clientId: string, value: unknown): void;
    createHook(clientId: string): Observable<unknown>;
}

/** A special case bi-directional linkage that maps to no linkage at all */
export class NullLinkage implements ILinkage, IDisposable {
    private value: unknown;
    private onUpdate: Subject<{clientId: string, value: unknown}> = new Subject();

    constructor(value: unknown) {
        this.value = value;
        this.onUpdate.subscribe(i => {
            this.value = i.value;
        });
    }

    getValue(): unknown {
        return this.value;
    }

    setValue(clientId: string, value: unknown) {
        this.onUpdate.next({clientId, value});
    }

    createHook(clientId: string): Observable<unknown> {
        return this.onUpdate.pipe(
            filter(i => i.clientId != clientId),
            map(i => i.value)
        );
    }

    dispose() {
        this.onUpdate.complete();
    }
}