import { LayoutData } from "../types";

/** An interface for a layout SERializer and DEserializer */
export interface ILayoutSerde {
    loadFromString(data: string): LayoutData;

    dumpToString(layout: LayoutData): string;
}
