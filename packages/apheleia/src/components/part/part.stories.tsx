import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { LayoutPart, LayoutPartProps } from "./part";

import "../../../style/index.scss";

export default {
    title: 'Layout/Layout Part',
    component: LayoutPart,
} as Meta<LayoutPartProps>;

const KittyPart = () => {
    const url = "https://placekitten.com/640/480";
    return (<img src={url} alt={"kitty!"} width="100%" height="100%" />);
}

const Template: Story<LayoutPartProps> = (props) => (
    <LayoutPart {...props}>
        <KittyPart />
    </LayoutPart>
);

export const InactivePart = Template.bind({});
InactivePart.args = {
    isActive: false,
    isTitlebarHidden: false,
    title: "Kitty! (640x480)"
};

export const ActivePart = Template.bind({});
ActivePart.args = {
    isActive: true,
    isTitlebarHidden: false,
    title: "Kitty! (640x480)"
};

export const PartWithHiddenTitlebar = Template.bind({});
PartWithHiddenTitlebar.args = {
    isActive: false,
    isTitlebarHidden: true,
    title: "Kitty! (640x480)"
};
