import { IDisposable } from "@mavenomics/coreutils";
import { Subject } from "rxjs";
import { filter, map } from "rxjs/operators"

export class GlobalValue implements IDisposable {
    private onChange: Subject<IGlobalChange>;
    private currentValue: unknown;

    public constructor(initialValue?: unknown) {
        this.onChange = new Subject();
        this.onChange.subscribe(i => {
            this.currentValue = i.value;
        });
        this.currentValue = initialValue;
    }

    public createHook(clientId: string) {
        return this.onChange.pipe(
            filter(change => change.clientId !== clientId),
            map(change => change.value)
        );
    }

    public setValue(clientId: string, value: unknown) {
        this.onChange.next({
            clientId,
            value
        });
    }

    public getValue() {
        return this.currentValue;
    }

    public dispose() {
        this.onChange.complete();
    }
}

interface IGlobalChange {
    clientId: string;
    value: unknown;
}
