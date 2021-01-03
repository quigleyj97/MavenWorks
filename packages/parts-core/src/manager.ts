import { PartContext } from "./context";
import { ILinkage, NullLinkage } from "./linkage";
import { IPart, IPartMetadata } from "./part";

export class PartManager {
    private parts: Map<string, IPart> = new Map();
    private contextsByPartId: Map<string, PartContext> = new Map();

    public addPart({part, partId, metadata, node, savedOptions}: AddPartArgs) {
        this.assertNoPartWithId(partId);
        let options: Record<string, ILinkage> = {};
        if (savedOptions) {
            options = { ...savedOptions };
        } else {
            for (const {name, default: optDefault} of metadata.options) {
                options[name] = new NullLinkage(optDefault);
            }
        }
        const context = new PartContext(partId, node, options);
        this.contextsByPartId.set(partId, context);
        this.parts.set(partId, part);
        this.initializePart(partId);
    }

    public initializePart(partId: string) {
        const part = this.getPartOrThrow(partId);
        const context = this.getContextOrThrow(partId);
        this.callAndReportError(() => part.initialize(context), context)
            .then(res => {
                if (res) {
                    this.renderPart(partId);
                } else {
                    console.error("Not rendering part " + partId + " due to an error in initalization");
                }
            });
    }

    public renderPart(partId: string) {
        const part = this.getPartOrThrow(partId);
        const context = this.getContextOrThrow(partId);
        const options = context.collectOptionValues();
        this.callAndReportError(() => part.render(options), context)
            .then(res => {
                if (!res) {
                    console.error("Error when rendering part " + partId + ", not setting up update hooks");
                } else {
                    this.setupUpdateHooks(partId);
                }
            });
    }

    private setupUpdateHooks(partId: string) {
        const part = this.getPartOrThrow(partId);
        const context = this.getContextOrThrow(partId);
        const linkageMap = context.getOptions();
        for (const [optionName, linkage] of linkageMap.entries()) {
            linkage.createHook(partId + "." + optionName)
                .subscribe(update => {
                    this.callAndReportError(
                        () => part.onUpdate(optionName, update),
                        context
                    );
                });
        }

    }

    private getPartOrThrow(partId: string) {
        const part = this.parts.get(partId);
        if (part == null) throw Error("Part with ID " + partId + " not found");
        return part;
    }

    private getContextOrThrow(partId: string) {
        const ctx = this.contextsByPartId.get(partId);
        if (ctx == null) throw Error("No context found for part with ID " + partId);
        return ctx;
    }

    private assertNoPartWithId(partId: string) {
        if (this.parts.has(partId)) {
            throw Error("A part already exists with ID " + partId);
        }
    }

    private async callAndReportError(
        fn: (this: void) => void | Promise<void>,
        ctx: PartContext
    ): Promise<boolean> {
        try {
            await fn.call(void 0);
        } catch(err) {
            this.reportError(err, ctx.getPartId());
            return false;
        }
        return true;
    }

    private reportError(err: unknown, partId: string) {
        console.error("Error executing part " + partId);
        console.error(err);
    }
}

interface AddPartArgs {
    part: IPart;
    partId: string;
    metadata: IPartMetadata;
    node: HTMLElement;
    savedOptions?: Record<string, ILinkage>;
}
