import { IDisposable } from "@mavenomics/coreutils";
import { GlobalValue } from "./global";

export class GlobalsService implements IDisposable {
    private globals: Map<string, GlobalValue> = new Map();

    constructor(initialValues?: Record<string, unknown>) {
        if (initialValues) {
            for (const [name, value] of Object.entries(initialValues)) {
                const globalValue = new GlobalValue(value);
                this.globals.set(name, globalValue);
            }
        }
    }

    public dispose() {
        for (const name of this.globals.keys()) {
            this.getGlobal(name).dispose();
        }
        this.globals.clear();
    }

    public getValue(name: string) {
        const variable = this.getGlobal(name);
        return variable.getValue();
    }

    public setValue(name: string, clientId: string, value: unknown) {
        this.getGlobal(name).setValue(clientId, value);
    }

    public createHook(name: string, clientId: string) {
        return this.getGlobal(name).createHook(clientId);
    }

    private getGlobal(name: string) {
        const variable = this.globals.get(name);
        if (variable == null) throw Error("Invalid global name: " + name);
        return variable
    }
}