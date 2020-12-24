import * as React from "react";

import "./_stack.scss";

declare module 'react' {
    interface DOMAttributes<T> {
        stackSize?: string;
    }
}

const StackDirections = ['horizontal', 'vertical'] as const;
type StackDirection = typeof StackDirections[number];

const SizingStrategies = ['static', 'flex'] as const;
type SizingStrategy = typeof SizingStrategies[number];

const SizingUnits = ['none', 'px', 'pt', 'em', 'rem'] as const;
type SizingUnit = typeof SizingUnits[number];

interface ChildSize {
    parameter: number;
    unit: SizingUnit;
    strategy: SizingStrategy;
}

const DEFAULT_SIZING_STRATEGY = Object.freeze({
    parameter: 1,
    unit: 'none' as const,
    strategy: 'flex' as const
});

function getSizeOfChild(component: React.ReactNode): Readonly<ChildSize> {
    if (!React.isValidElement(component)) {
        return DEFAULT_SIZING_STRATEGY;
    }
    const declared_size = component.props.stackSize;
    if (declared_size == null) {
        return DEFAULT_SIZING_STRATEGY;
    }
    if (!Number.isNaN(+declared_size)) {
        return {
            parameter: +declared_size,
            unit: 'none' as const,
            strategy: 'flex' as const
        };
    }
    // try to parse out the parameter
    for (const unit of SizingUnits) {
        if (declared_size.endsWith(unit)) {
            let parameter = +declared_size.substr(0, declared_size.length - unit.length);
            if (Number.isNaN(parameter)) {
                throw Error(
                    `Invalid size for StackPanel child: ${declared_size} is not ` +
                    `a number. Element: ${component}`
                );
            }
            return {
                parameter,
                unit,
                strategy: 'static' as const
            };
        }
    }

    throw Error(
        `Invalid size for StackPanel child: ${declared_size} is not a number ` +
        `or does not use a supported unit. Element: ${component}`
    );
}

function getStyleForChild(child: React.ReactNode) {
    const size = getSizeOfChild(child);
    const style: React.CSSProperties = {};
    switch (size.strategy) {
        case 'flex':
            // see this post for why this is important
            // https://css-tricks.com/flex-grow-is-weird/
            // stack panels should be stupid-simple and predictable
            style["flexBasis"] = "0px";
            style["flexShrink"] = 0;
            style["flexGrow"] = size.parameter;
            break;
        case 'static':
            style["flexBasis"] = "" + size.parameter + size.unit;
            style["flexShrink"] = 0;
            style["flexGrow"] = 0;
    }
    return style;
}

export interface StackPanelProps {
    direction?: StackDirection
}

export const StackPanel: React.FC<StackPanelProps> = ({
    children,
    direction
}) => {
    direction = direction ?? 'vertical';
    if (!StackDirections.includes(direction)) {
        throw Error("Invalid StackPanel layout direction: " + direction);
    }
    const classList = ["aph-stackpanel", direction];
    return (
        <div className={classList.join(" ")}>
            { React.Children.map(children, (child) => (
                <div className={`stack-child`} style={getStyleForChild(child)}>
                    {child}
                </div>
            )) }
        </div>
    )
}
