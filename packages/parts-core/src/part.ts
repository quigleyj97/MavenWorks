import { IDisposable } from "@mavenomics/coreutils";

export interface IPart extends IDisposable {
    /**
     * Given the part context, setup first-time state for this part.
     *
     * Parts are initialized after they have been assigned a DOM node. Parts
     * should use this time to perform any one-time actions, such as fetching
     * static resources, starting web workers, or setting up a visualization.
     *
     * If this function returns a promise, the engine will wait for that promise
     * to resolve before continuing. Otherwise, render will be invoked on the
     * next VM turn.
     *
     * @param {IPartContext} context
     * @return {*}  {(void | Promise<void>)}
     * @memberof IPart
     */
    initialize(context: IPartContext): void | Promise<void>;

    /**
     * Given the current values of all options, render the part
     *
     * This is typically called once after initialization, but may be called
     * multiple times as a result of user action (eg, to try to clear a bug or
     * get updated data that isn't modelled in bindings).
     *
     * Like `initialize()`, if this function returns a promise, the engine will
     * wait on it before continuing.
     *
     * @param {Record<string, unknown>} options The current values of thge options
     * @return {*}  {(void | Promise<void>)}
     * @memberof IPart
     */
    render(options: Record<string, unknown>): void | Promise<void>;

    /**
     * Called whenever a binding has updated.
     *
     * Binding updates happen either as a result of user action (setting values
     * in the UI) or engine action (updating a global, re-calculating a query,
     * etc.)
     *
     * Like `initialize` and `render`, this function may return a promise,
     * though updates in this function should be as fast as possible as they may
     * be called frequently or expected to quickly give feedback to the user
     * (eg, setting a slider bound to another slider should result in both
     * seeming to update in lock-step)
     *
     * @param {string} option The name of the option that was updated
     * @param {unknown} value The new value that the option took on
     * @return {*}  {(void | Promise<void>)}
     * @memberof IPart
     */
    onUpdate(option: string, value: unknown): void | Promise<void>;
}

export interface IPartContext {
    /** Get the HTML node assigned to this part */
    getNode(): HTMLElement;
    /** Get the unique part ID assigned to this part */
    getPartId(): string;
    /** Get the current value of an option */
    getOption(name: string): unknown;
    /** Set the value of an option, if possible.
     *
     * One-way bindings (like query bindings) will not allow parts to set their
     * values. A part should still update itself, however.
     */
    setOption(name: string, value: unknown): void;
}

export interface IPartMetadata {
    options: {
        name: string;
        default?: unknown;
    }[];
}
