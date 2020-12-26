import * as fs from "fs";
import { LayoutData } from "../types";
import { XmlLayoutSerde } from "./xmlserde"

const TEST_FILE = fs.readFileSync("./testdata/layout.xml", "utf8");

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

describe("XmlLayoutSerde", () => {
    const serde = new XmlLayoutSerde();

    test("rejects too-new-version", () => {
        const TEST_DOC = `<Layout version="1000.1000"></Layout>`;
        expect(() => serde.loadFromString(TEST_DOC)).toThrowError("Layout version too new");
    });

    test("parses doc", () => {
        expect(serde.loadFromString(TEST_FILE)).toMatchSnapshot();
    });

    test("serializes layout", () => {
        expect(serde.dumpToString(TEST_LAYOUT)).toMatchSnapshot();
    })
})