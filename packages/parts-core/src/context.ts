import { IDisposable } from "@mavenomics/coreutils";
import { ILinkage } from "./linkage";
import { IPartContext } from "./part";

export class PartContext implements IPartContext, IDisposable {
    private readonly options: Map<string, ILinkage>;
    private readonly partId: string;
    private readonly node: HTMLElement;

    constructor(partId: string, node: HTMLElement, linkages: Record<string, ILinkage>) {
        this.partId = partId;
        this.node = node;
        this.options = new Map(Object.entries(linkages));
    }

    public getNode() { return this.node; }

    public getPartId() { return this.partId; }

    public getOption(optionName: string): unknown {
        return this.getLinkageOrThrow(optionName).getValue();
    }

    public setOption(optionName: string, value: unknown) {
        this.getLinkageOrThrow(optionName)
            .setValue?.(this.getClientId(optionName), value);
    }

    public collectOptionValues() {
        const optionsBag: Record<string, unknown> = {};
        for (const [optionName, linkage] of this.options.entries()) {
            optionsBag[optionName] = linkage.getValue();
        }
        return optionsBag;
    }

    public getOptions(): Readonly<Map<string, ILinkage>> {
        return this.options;
    }

    public dispose() {
        for (const linkage of this.options.values()) {
            linkage.dispose();
        }
    }

    private getLinkageOrThrow(optionName: string): ILinkage {
        const linkage = this.options.get(optionName);
        if (linkage == null) throw Error("Invalid option name: " + optionName);
        return linkage;
    }

    private getClientId(option: string) {
        return `${this.partId}.${option}`;
    }
}