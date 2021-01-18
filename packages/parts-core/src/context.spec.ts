import { PartContext } from "./context";
import { ILinkage, NullLinkage } from "./linkage";

const TEST_PART_ID = "test_part_id";
const TEST_OPTION_1_ID = "foo";
const TEST_OPTION_1_VAL = 42;
const TEST_OPTION_2_ID = "bar";
const TEST_OPTION_2_VAL = "hello";

function makeNode() {
    return document.createElement("div");
}

function makeOptions() {
    return {
        [TEST_OPTION_1_ID]: new NullLinkage(TEST_OPTION_1_VAL),
        [TEST_OPTION_2_ID]: new NullLinkage(TEST_OPTION_2_VAL)
    }
}

function makeContext(node: HTMLElement, options: Record<string, ILinkage>) {
    return new PartContext(TEST_PART_ID, node, options);
}

function makeContextDefault() {
    return makeContext(makeNode(), makeOptions());
}

describe("Context", () => {
    test("#constructor", () => {
        const ctx = makeContextDefault();
        expect(ctx).toBeDefined();
        ctx.dispose();
    });

    test("#dispose", () => {
        const ctx = makeContextDefault();
        ctx.dispose();
        ctx.setOption(TEST_OPTION_1_ID, 24);
        expect(ctx.getOption(TEST_OPTION_1_ID)).toEqual(TEST_OPTION_1_VAL);
    });

    test("#getPartId", () => {
        const ctx = makeContextDefault();
        expect(ctx.getPartId()).toEqual(TEST_PART_ID);
        ctx.dispose();
    });

    test("#getOption", () => {
        const ctx = makeContextDefault();
        expect(ctx.getOption(TEST_OPTION_2_ID)).toEqual(TEST_OPTION_2_VAL);
        ctx.dispose();
    });

    test("#setOption", () => {
        const ctx = makeContextDefault();
        ctx.setOption(TEST_OPTION_2_ID, "world!");
        expect(ctx.getOption(TEST_OPTION_2_ID)).toEqual("world!");
        ctx.dispose();
    });

    test("#collectOptionValues", () => {
        const ctx = makeContextDefault();
        const values = ctx.collectOptionValues();
        expect(values).toEqual<Record<string, unknown>>({
            [TEST_OPTION_1_ID]: TEST_OPTION_1_VAL,
            [TEST_OPTION_2_ID]: TEST_OPTION_2_VAL
        });
        ctx.dispose();
    });
});
