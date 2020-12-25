export interface LayoutPartData {
    type: 'layout-part';
    title: string;
    showTitlebar: boolean;
    id: string;
}

export interface StackPanelData {
    type: 'stack-panel';
    direction: 'horizontal' | 'vertical';
    children: BaseRegionData[];
    stackSizes: string[];
}

export type BaseRegionData = LayoutPartData | StackPanelData;

export interface LayoutData {
    root: BaseRegionData;
}
