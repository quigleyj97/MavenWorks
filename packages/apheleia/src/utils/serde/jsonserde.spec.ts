import * as fs from "fs";
import { LayoutData } from "../types";
import { JsonLayoutSerde } from "./jsonserde";

const TEST_FILE = fs.readFileSync("./testdata/layout.json", "utf8");

const TEST_LAYOUT: LayoutData = {
    root: {
        type: 'stack-panel',
        children: [{
            type: 'layout-part',
            showTitlebar: false,
            title: 'test-part',
            id: 'test-part'
        }],
        stackSizes: [
            "200px"
        ],
        direction: 'vertical'
    }
};

describe("JsonLayoutSerde tests", () => {
    let layoutSerde = new JsonLayoutSerde();

    test("loadFromString", () => {
        expect(layoutSerde.loadFromString(TEST_FILE)).toMatchSnapshot();
    });

    test("dumpToString", () => {
        expect(layoutSerde.dumpToString(TEST_LAYOUT)).toMatchSnapshot();
    });
});
