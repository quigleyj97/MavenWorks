import * as React from "react";

import "./_titlebar.scss";

export interface TitlebarProps {
    /** The text to display in this titlebar */
    text: string;
    /** Fired whenever the titlebar is tapped or clicked */
    onClick: (this: void) => void;
    /** Fired whenever the titlebar is double-tapped or double-clicked */
    onDblClick: (this: void) => void;
    /** Whether this titlebar is active (render prominently) or inactive */
    isActive: boolean;
}

export const Titlebar: React.FC<TitlebarProps> = ({
    text,
    onClick,
    onDblClick,
    isActive=false
}) => {
    const classList = ["aph-titlebar"];

    if (isActive) {
        classList.push("active");
    } else {
        classList.push("inactive");
    }

    return (<div className={classList.join(" ")}
        onClick={() => onClick.call(void 0)}
        onDoubleClick={() => onDblClick.call(void 0)}>
            <span className="aph-display-text h3">{text}</span>
        </div>
    );
}