import { Observable } from "rxjs";

/**
 * An interface representing an object with teardown logic.
 *
 * Classes should only implement this interface if they have state that must be
 * cleaned up; like a worker thread, Observable, socket connection, etc. They
 * should also make it clear in their documentation and tests that the class
 * must be disposed.
 *
 * If a class implements this interface, then instantiators _must_ `dispose()`
 * that instance as soon as they are done with it.
 *
 * @export
 * @interface IDisposable
 */
export interface IDisposable {
    /**
     * Tear down any state that this object holds.
     *
     * @memberof IDisposable
     */
    dispose(): void;
}

/**
 * Staleness refers to some missing state that a parent should know about, but can't respond to immediately.
 * Staleness can be set by an external component, and includes an event for reacting to staleness.
 *
 * Staleness should not re-emit if the implementor is already stale.
 *
 * @deprecated New code should not use this interface.
 */
export interface IStaleable {
    readonly isStale: boolean;
    readonly OnStale: Observable<void>;
    setFresh(): void;
    setStale(): void;
}

/**
 * Dirtiness is closely tied to staleness, but is specific to models. Unlike staleness, dirtiness can only
 * be set by the implementor.
 *
 * Dirtiness should not re-emit if the implementor is already dirty.
 *
 * @deprecated New code should not use this interface
 */
export interface IDirtyable {
    readonly isDirty: boolean;
    readonly OnDirty: Observable<void>;
    setClean(): void;
}
