import { LayoutData } from "../types";
import { ILayoutSerde } from "./interface";

interface Data {
    version: {
        major: number,
        minor: number
    },
    layout: LayoutData;
};

export class JsonLayoutSerde implements ILayoutSerde {
    private static readonly VERSION_MAJOR = 0;
    private static readonly VERSION_MINOR = 1;

    public loadFromString(data: string): LayoutData {
        let root: Data;
        try {
            root = JSON.parse(data) as Data;
        } catch (err) {
            throw Error("Failed to deserialize JSON layout: " + err);
        }
        // for now just trust that it's layout data
        // TODO: implement a validation scheme like io-ts
        if (
            root.version.major > JsonLayoutSerde.VERSION_MAJOR ||
            root.version.minor > JsonLayoutSerde.VERSION_MINOR
        ) {
            throw Error("Data version exceeds this version");
        }
        return root.layout;
    }

    dumpToString(layout: LayoutData): string {
        return JSON.stringify({
            version: {
                major: JsonLayoutSerde.VERSION_MAJOR,
                minor: JsonLayoutSerde.VERSION_MINOR
            },
            layout: layout
        });
    }

}