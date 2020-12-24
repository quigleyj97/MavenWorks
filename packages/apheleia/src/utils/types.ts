type DataType = 'layout-part' | 'stack-panel';

interface LayoutPartData {
    type: 'layout-part';
    title: string;
    showTitlebar: boolean;
}

interface StackPanelData {
    type: 'stack-panel';
    children: BaseRegionData[];
}

type BaseRegionData = LayoutPartData | StackPanelData;
