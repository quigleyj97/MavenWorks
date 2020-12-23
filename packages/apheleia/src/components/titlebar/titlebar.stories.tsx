import * as React from "react";
import { Meta, Story } from "@storybook/react";
import { Titlebar, TitlebarProps } from "./titlebar";

import "../../../style/index.scss";

export default {
    title: 'Layout/Primitives',
    component: Titlebar,
} as Meta<TitlebarProps>;


const Template: Story<TitlebarProps> = (props) => (<Titlebar {...props} />);

export const BasicTitlebar = Template.bind({});
BasicTitlebar.args = {
    text: "OHLC for $AMZN from 11/04/19-12/22/20"
}

export const ActiveTitlebar = Template.bind({});
ActiveTitlebar.args = {
    text: "OHLC for $AMZN from 11/04/19-12/22/20",
    isActive: true
}