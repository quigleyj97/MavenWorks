import * as React from "react";

import "./_titlebar.scss";

export interface TitlebarProps {
    /** The text to display in this titlebar */
    text: string;
    /** Whether this titlebar is active (render prominently) or inactive */
    isActive: boolean;
    /** Fired whenever the titlebar is tapped or clicked */
    onClick: (this: void) => void;
    /** Fired whenever the titlebar is double-tapped or double-clicked */
    onDblClick: (this: void) => void;
    /** Fired whenever the titlebar close button is tapped or clicked */
    onClose: (this: void) => void;
}

export const Titlebar: React.FC<TitlebarProps> = ({
    text,
    isActive=false,
    onClick,
    onDblClick,
    onClose,
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
            <span className="title-text aph-display-text h3">{text}</span>
            <button className="title-close material-icons md-18" onClick={(ev) => {
                ev.stopPropagation();
                onClose.call(void 0);
            }}>
                close
            </button>
        </div>
    );
}