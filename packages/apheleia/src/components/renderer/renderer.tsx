import * as React from "react";
import { BaseRegionData, LayoutData, LayoutPartData, StackPanelData } from "../../utils/types";
import { LayoutPart } from "../part/part";
import { StackPanel } from "../stack/stackpanel";

export interface LayoutRendererProps {
    partGenerator: (id: string) => React.ReactNode;
    layout: LayoutData;
    activePartId: string | null;
    onPartActivated: (partId: string) => void;
}

function renderRegion(
    region: BaseRegionData,
    props: LayoutRendererProps,
    extraProps?: object,
) {
    switch (region.type) {
        case "stack-panel":
            return renderStackPanel(region, props, extraProps);
        case "layout-part":
            return renderPart(region, props, extraProps);
    }
}

function renderStackPanel(
    region: StackPanelData,
    props: LayoutRendererProps,
    extraProps?: object
) {
    const children = region.children.map((child, i) => {
        const stackSize = region.stackSizes[i];
        return renderRegion(child, props, { stackSize, key: ""+i });
    });
    return (<StackPanel direction={region.direction} {...extraProps}>
        { children }
    </StackPanel>);
}

function renderPart(
    region: LayoutPartData,
    {activePartId, onPartActivated, partGenerator}: LayoutRendererProps,
    extraProps?: object
) {
    return (<LayoutPart isActive={activePartId == region.id}
        onBecomeActive={onPartActivated.bind(void 0, region.id)}
        isTitlebarHidden={!region.showTitlebar}
        title={region.title}
        {...extraProps}>
            {partGenerator(region.id)}
        </LayoutPart>
    );
}

export const LayoutRenderer: React.FC<LayoutRendererProps> = ({
    partGenerator,
    layout,
    activePartId,
    onPartActivated
}) => {
    return renderRegion(layout.root, {
        partGenerator, layout, activePartId, onPartActivated
    });
}
