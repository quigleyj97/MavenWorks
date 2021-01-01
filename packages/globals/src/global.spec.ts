import { Observable } from "rxjs";
import { GlobalValue } from "./global"

describe("GlobalValue", () => {
    test("#constructor", () => {
        expect(() => {
            const value = new GlobalValue();
            value.dispose();
        }).not.toThrow();
    });

    test("#dispose calling multiple times", () => {
        expect(() => {
            const value = new GlobalValue();
            value.dispose();
            value.dispose();
        }).not.toThrow();
    });

    test("Get value without any updates", () => {
        const val = new GlobalValue(42);
        expect(val.getValue()).toEqual(42);
        val.dispose();
    });

    test("Get value after an update", () => {
        const val = new GlobalValue(24);
        expect(val.getValue()).toEqual(24);
        val.setValue("TEST", 42);
        expect(val.getValue()).toEqual(42);
        val.dispose();
    });

    test("createHook should produce an observable that fires on updates", () => {
        const val = new GlobalValue(24);
        const obs = val.createHook("TEST_1");
        expect(obs).toBeInstanceOf(Observable);
        const sink = jest.fn();
        obs.subscribe(sink);
        val.setValue("TEST_2", 42);
        expect(sink).toHaveBeenCalledWith(42);
        val.dispose();
    });

    test("createHook observables should not repeat back to the original client", () => {
        const val = new GlobalValue(24);
        const obs = val.createHook("TEST_1");
        expect(obs).toBeInstanceOf(Observable);
        const sink = jest.fn();
        obs.subscribe(sink);
        val.setValue("TEST_1", 42);
        expect(sink).not.toHaveBeenCalled();
        val.dispose();
    });
});
