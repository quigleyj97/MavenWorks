import { BaseRegionData, LayoutData, LayoutPartData, StackPanelData } from "../types";
import { ILayoutSerde } from "./interface";

export class XmlLayoutSerde implements ILayoutSerde {
    private static readonly VERSION_MAJOR = 0;
    private static readonly VERSION_MINOR = 1;
    private static readonly VERSION_NUMBER = XmlLayoutSerde.VERSION_MAJOR +
        "." + XmlLayoutSerde.VERSION_MINOR;
    private static readonly LAYOUT_TAG = "LAYOUT";
    private static readonly STACKPANEL_TAG = "STACK";
    private static readonly PART_TAG = "PART";

    public loadFromString(data: string): LayoutData {
        const reader = new DOMParser();
        let doc: Document;
        try {
            doc = reader.parseFromString(data, "application/xml");
        }
        catch (err) {
            throw Error("Faled to parse XML: " + err); // nothing better to do
        }
        const errorDoc = doc.getElementsByTagName("parsererror");
        if (errorDoc.length > 0) {
            // There's an error in the document, but the user agent was either
            // able to partially parse it or opted not to throw an error.
            throw new Error("ParserError: " + errorDoc);
        }
        // Return the root element.
        const layout = this.walkXmlTree(doc);
        return {
            root: layout
        };
    }

    public dumpToString(layout: LayoutData): string {
        const doc = new Document();
        const root = doc.createElement(XmlLayoutSerde.LAYOUT_TAG);
        root.setAttribute("version", XmlLayoutSerde.VERSION_NUMBER);

        const rootStack = this.makeXmlNode(doc, layout.root);
        root.appendChild(rootStack);
        doc.appendChild(root);

        const serializer = new XMLSerializer();
        return serializer.serializeToString(doc);
    }

    private makeXmlNode(doc: XMLDocument, region: BaseRegionData) {
        let node: Element;
        switch (region.type) {
            case 'layout-part':
                node = this.makePartXmlNode(doc, region);
                break;
            case 'stack-panel':
                node = this.makeStackXmlNode(doc, region);
                break;
        }
        return node;
    }

    private makePartXmlNode(doc: XMLDocument, region: LayoutPartData): Element {
        const node = doc.createElement(XmlLayoutSerde.PART_TAG);
        node.setAttribute("title", region.title);
        node.setAttribute("id", region.id);
        node.setAttribute("showTitlebar", ""+region.showTitlebar);
        return node;
    }

    private makeStackXmlNode(doc: XMLDocument, region: StackPanelData): Element {
        const node = doc.createElement(XmlLayoutSerde.STACKPANEL_TAG);
        node.setAttribute("direction", region.direction);
        for (let i = 0; i < region.children.length; i++) {
            const childRegion = region.children[i];
            const childNode = this.makeXmlNode(doc, childRegion);
            childNode.setAttribute("stackSize", region.stackSizes[i]);
            node.appendChild(childNode);
        }
        return node;
    }

    private walkXmlTree(xmldoc: XMLDocument) {
        const root = xmldoc.children[0];
        if (root == null || root.tagName.toLocaleUpperCase() != XmlLayoutSerde.LAYOUT_TAG) {
            throw new Error("Invalid root element: " + root);
        }
        const version = root.getAttribute("version");
        this.checkVersionString(version);
        return this.visitXmlNode(root.children[0]);
    }

    private checkVersionString(version: string | null) {
        if (version == null) {
            console.warn("Version missing, proceeding with parse anyway");
            return;
        }
        // since it's declared, check it
        const [major, minor] = version.split(".");
        if (!Number.isInteger(+major) || !Number.isInteger(+minor)) {
            throw Error("Invalid version string: " + version)
        }
        if (
            +major > XmlLayoutSerde.VERSION_MAJOR ||
            +minor > XmlLayoutSerde.VERSION_MINOR
        ) {
            throw Error(
                "Layout version too new: " + version + " is greater than " +
                XmlLayoutSerde.VERSION_NUMBER
            );
        }
    }

    private visitXmlNode(node: Element): BaseRegionData;
    private visitXmlNode(node: Element, parentRegion: StackPanelData): void;
    private visitXmlNode(node: Element, parentRegion?: StackPanelData) {
        const tagName = node.tagName.toUpperCase();
        let region: BaseRegionData;
        switch (tagName) {
            case XmlLayoutSerde.STACKPANEL_TAG:
                region = this.visitStackElement(node);
                break;
            case XmlLayoutSerde.PART_TAG:
                region = this.visitPartElement(node);
                break;
            default:
                region = this.visitUnknownElement(node);
                break;
        }
        if (parentRegion) {
            parentRegion.children.push(region);
            parentRegion.stackSizes.push(node.getAttribute("stackSize") ?? "1");
            return;
        } else {
            return region;
        }
    }

    private visitUnknownElement(node: Element): BaseRegionData {
        return {
            type: 'layout-part',
            id: '###error-part',
            title: 'Error: Unknown layout region: ' + node.tagName,
            showTitlebar: true
        };
    }

    private visitStackElement(node: Element): BaseRegionData {
        let direction = node.getAttribute("direction");
        if (direction != 'horizontal' && direction != 'vertical' && direction != null) {
            console.warn("Invalid direction for stack panel: " + direction);
            console.warn(node);
            direction = null;
        }
        const region: StackPanelData = {
            type: 'stack-panel',
            children: [],
            direction: direction ?? 'horizontal',
            stackSizes: []
        };
        for (const child of node.children) {
            this.visitXmlNode(child, region);
        }
        return region;
    }

    private visitPartElement(node: Element): BaseRegionData {
        let id = node.getAttribute("id") ?? "###error-part";
        let title = node.getAttribute("title") ?? "";
        let showTitlebar = this.stringToBool(
            node.getAttribute("showTitlebar") ?? "true"
        );

        return {
            type: 'layout-part',
            id,
            title,
            showTitlebar
        };
    }

    private stringToBool(str: string): boolean {
        switch (str.toLowerCase()) {
            case "t":
            case "true":
            case "1":
                return true;
            case "f":
            case "false":
            case "0":
                return false;
        }
        console.warn("Cannot easily map " + str + " to a boolean value, assuming falsy");
        return false;
    }
}