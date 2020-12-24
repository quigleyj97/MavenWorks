import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { LayoutPart } from "../part/part";
import { StackPanel, StackPanelProps } from "./stackpanel";

import "../../../style/index.scss";
import "./_story_style.scss";

export default {
    title: 'Layout/Stack Panel',
    component: StackPanel,
} as Meta<StackPanelProps>;

// helpers for test layouts
const KittyPart = () => {
    const url = "https://placekitten.com/640/480";
    return (<img src={url} alt={"kitty!"} width="100%" height="100%" />);
};
const MakePart = (title: string, size?: string) => (
    <LayoutPart title={title} stackSize={size} >
        <KittyPart />
    </LayoutPart>
);

const Template: (children: React.ReactChild[]) => Story<StackPanelProps> =
    (children) =>
        (props) => (
            <StackPanel {...props}>
                {children}
            </StackPanel>
        );

export const SingleChild = Template([
    MakePart("Kitty! (default size)")
]);

export const MultipleChildren = Template([
    MakePart("Kitty (default size)"),
    MakePart("Kitty (default size)")
]);

export const HorizontalChildren = Template([
    MakePart("Kitty 1  (default size)"),
    MakePart("Kitty 2  (default size)")
]);
HorizontalChildren.args = {
    direction: "horizontal"
};

export const ComplexLayout = () => (
    <StackPanel direction="horizontal">
        {MakePart("Kitty 1 (100px)", "100px")}
        <StackPanel direction="vertical">
            {MakePart("Kitty 2 (20em)", "20em")}
            {MakePart("Kitty 3! (default size)")}
        </StackPanel>
    </StackPanel>
);