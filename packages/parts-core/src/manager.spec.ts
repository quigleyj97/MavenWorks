import { AsyncTools } from "@mavenomics/coreutils";
import { Subject } from "rxjs";
import { ILinkage, NullLinkage } from "./linkage";
import { PartManager } from "./manager";
import { IPart } from "./part";

const TEST_PART_ID = "test-part-1";

function makePartMock() {
    return {
        initialize: jest.fn(),
        render: jest.fn(),
        onUpdate: jest.fn(),
        dispose: jest.fn()
    } as IPart;
}

function makePartManager() {
    return new PartManager();
}

function makeNode() {
    return document.createElement("div");
}

function makePartManagerWithPart() {
    const mgr = makePartManager();
    const part = makePartMock()
    mgr.addPart({
        part,
        partId: TEST_PART_ID,
        metadata: { options: [] },
        node: makeNode()
    });
    return [mgr, part] as const;
}

describe("PartManager", () => {
    test("#constructor", () => {
        expect(() => {
            const mgr = makePartManager();
            mgr.dispose();
        }).not.toThrow();
    });

    test("#addPart", async () => {
        const [mgr, part] = makePartManagerWithPart();
        expect(mgr.getPartById(TEST_PART_ID)).toBe(part);
        expect(part.initialize).toHaveBeenCalled();
        // we expect initialize to have been called right away, but render will
        // be another tick
        await AsyncTools.wait();
        expect(part.render).toHaveBeenCalled();
        expect(part.onUpdate).not.toHaveBeenCalled();
        mgr.dispose();
    });

    test("#getPartById", () => {
        const [mgr, part] = makePartManagerWithPart();
        expect(mgr.getPartById(TEST_PART_ID)).toEqual(part);
        mgr.dispose();
    });

    test("#dispose should dispose parts as well", () => {
        const [mgr, part] = makePartManagerWithPart();
        mgr.dispose();
        expect(part.dispose).toHaveBeenCalled();
    });

    test("Initialization error should prevent render from getting called", async () => {
        const part = makePartMock();
        (part.initialize as jest.Mock<any, any>).mockImplementation(() => {
            throw Error("bad initialize");
        });
        const mgr = makePartManager();
        mgr.addPart({
            part,
            partId: TEST_PART_ID,
            metadata: { options: [] },
            node: makeNode()
        });
        expect(part.initialize).toHaveBeenCalled();
        // wait a tick to drain the microtask queue- see #addPart test for details
        await AsyncTools.wait();
        expect(part.render).not.toHaveBeenCalled();
        expect(part.onUpdate).not.toHaveBeenCalled();
        mgr.dispose();
    });

    test("Part with options should dispose options when manager is disposed", async () => {
        // this subject is just to make the interface correct
        const test_subj = new Subject();
        const option = {
            _subj: new Subject(),
            createHook: jest.fn(() => test_subj),
            dispose: jest.fn(() => test_subj.complete()),
            getValue: () => 42,
            setValue: jest.fn()
        } as ILinkage;
        const part = makePartMock();
        const mgr = makePartManager();
        mgr.addPart({
            part,
            partId: TEST_PART_ID,
            metadata: { options: [ { name: "foo" } ] },
            savedOptions: { foo: option },
            node: makeNode()
        });
        await AsyncTools.wait();
        mgr.dispose();
        expect(option.dispose).toHaveBeenCalled();
    });

    test("Part with options should update when options change", async () => {
        const option = new NullLinkage(42);
        const part = makePartMock();
        const mgr = makePartManager();
        mgr.addPart({
            part,
            partId: TEST_PART_ID,
            metadata: { options: [ { name: "foo" } ] },
            savedOptions: { foo: option },
            node: makeNode()
        });
        await AsyncTools.wait();
        expect(part.render).toHaveBeenCalledWith({ foo: 42 });
        option.setValue("TEST RUNNER", 24);
        await AsyncTools.wait();
        expect(part.onUpdate).toHaveBeenCalledWith("foo", 24);
        mgr.dispose();
    });

    test("Part with options should not update when #render fails", async () => {
        const option = new NullLinkage(42);
        const part = makePartMock();
        (part.render as jest.Mock<any, any>).mockImplementation(() => {
            throw Error("bad render");
        });
        const mgr = makePartManager();
        mgr.addPart({
            part,
            partId: TEST_PART_ID,
            metadata: { options: [ { name: "foo" } ] },
            savedOptions: { foo: option },
            node: makeNode()
        });
        await AsyncTools.wait();
        expect(part.render).toHaveBeenCalledWith({ foo: 42 });
        option.setValue("TEST RUNNER", 24);
        await AsyncTools.wait();
        expect(part.onUpdate).not.toHaveBeenCalled();
        mgr.dispose();
    });
});
