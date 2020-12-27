
import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { LayoutRenderer, LayoutRendererProps } from "./renderer";
import "../../../style/index.scss";
import { XmlLayoutSerde } from "../../utils";

export default {
    title: 'Layout/Renderer',
    component: LayoutRenderer,
} as Meta<LayoutRendererProps>;

const TEST_LAYOUT = `<Layout version="0.1">
<Stack>
    <Part id="input_1"
        title="Input" />
    <Part id="output_grid"
        title="SlickGrid"
        showTitlebar="false" />
    <Stack direction="vertical">
        <Part id="slider_range" title="Range" stackSize="3.5em" />
        <Part id="spinner" title="Category" stackSize="3.5em" />
        <Part id="filler" title="Fill the rest" />
    </Stack>
</Stack>
</Layout>
`;

const KittyPart = () => {
    const url = "https://placekitten.com/640/480";
    return (<img src={url} alt={"kitty!"} width="100%" height="100%" />);
}

const KittyPartRenderer = (id: string) => (<KittyPart />);

const serde = new XmlLayoutSerde();
const layout = serde.loadFromString(TEST_LAYOUT);

export const SampleLayout: Story<LayoutRendererProps> = (props) => {
    return (<LayoutRenderer {...props}></LayoutRenderer>)
}
SampleLayout.args = {
    layout,
    partGenerator: KittyPartRenderer,
    activePartId: "spinner"
}