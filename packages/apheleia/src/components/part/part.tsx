import * as React from "react";
import { Titlebar } from "../titlebar/titlebar";

import "./_part.scss";

export interface LayoutPartProps {
    /** The title to display for this region */
    title?: string;
    /** Whether this region is active (render prominently) or inactive.
     *
     * An 'active' region is what region the user is interacting with, or most
     * recently interacted with. This is meant to help direct a user's attention
     * back to the task they were working on after a context-loss (such as an
     * external distraction), and clarify where their actions will apply if they
     * use a keyboard shortcut or command.
     */
    isActive?: boolean;
    /** Whether to hide the titlebar */
    isTitlebarHidden?: boolean;
    /** Called whenever the close button on this region is clicked */
    onClose?: (this: void) => void;
    /** Called whenever this region should become the 'active' region
     * 
     * This is taken to mean one of the following events:
     * 
     *  - click on titlebar
     *  - pointerdown anywhere in content that bubbles up to this region
     *  - focusin anywhere in content that bubbles up to this region
     */
    onBecomeActive?: (this: void) => void;
}

/**
 * An atomic, singular part of a dashboard.
 * 
 * "Part" in the layout engine just means any non-layout-region. There is no
 * actual coupling to DashboardParts.
 * 
 * The part to be laid out should be provided as a single child- this part will
 * throw an error if you provide more or less than 1 child.
 */
export const LayoutPart: React.FC<LayoutPartProps> = ({
    isActive = false,
    isTitlebarHidden = false,
    title = "",
    children,
    onBecomeActive,
    onClose
}) => {
    const fireOnBecomeActive = () => {
        if (isActive) return;
        return void onBecomeActive?.call(void 0);
    };
    const part = React.Children.only(children);
    const titlebarProps = {
        isActive, 
        text: title,
        onClose,
        onClick: fireOnBecomeActive
    };
    const classList = ["aph-layoutpart"];
    if (isTitlebarHidden) {
        classList.push("hide-titlebar");
    }
    // NOTE: We use onFocus instead of onFocusIn, because React events aren't
    // 1:1 with DOM events. Specifically, blur/focus _bubble_ in React, and
    // therefore React does not expose any sort of focusin/focusout handler.
    // cf. https://github.com/facebook/react/issues/6410
    return (<div className={classList.join(" ")}>
        <Titlebar {...titlebarProps} />
        <div className="child"
            onFocus={fireOnBecomeActive}
            onPointerDown={fireOnBecomeActive}>{part}</div>
    </div>);
}
