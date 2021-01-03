export interface IPart {
    initialize(context: IPartContext): void | Promise<void>;
    render(options: Record<string, unknown>): void | Promise<void>;
    onUpdate(option: string, value: unknown): void | Promise<void>;
}

export interface IPartContext {
    getNode(): HTMLElement;
    getPartId(): string;
    getOption(name: string): unknown;
    setOption(name: string, value: unknown): void;
}

export interface IPartMetadata {
    options: {
        name: string;
        default?: unknown;
    }[];
}
