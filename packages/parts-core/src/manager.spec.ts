import { AsyncTools } from "@mavenomics/coreutils";
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

describe("PartManager", () => {
    test("#constructor", () => {
        expect(() => {
            const mgr = makePartManager();
            mgr.dispose();
        }).not.toThrow();
    });

    test("#addPart", async () => {
        const mgr = makePartManager();
        const part = makePartMock()
        mgr.addPart({
            part,
            partId: TEST_PART_ID,
            metadata: { options: [] },
            node: makeNode()
        });
        expect(mgr.getPartById(TEST_PART_ID)).toBe(part);
        expect(part.initialize).toHaveBeenCalled();
        // we expect initialize to have been called right away, but render will
        // be another tick
        await AsyncTools.wait();
        expect(part.render).toHaveBeenCalled();
        expect(part.onUpdate).not.toHaveBeenCalled();
        part.dispose();
        mgr.dispose();
    });
});
