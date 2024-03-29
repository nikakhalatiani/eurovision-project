import { TouchSensor } from "@dnd-kit/core";

/**
 * An extended "TouchSensor" that prevent some
 * interactive html element(button, input, textarea, select, option...) from dragging
 */
export class SmartTouchSensor extends TouchSensor {
    static activators = [
        {
            eventName: "onTouchDown" as any,
            handler: ({ nativeEvent: event }: any) => {
                if (
                    !event.isPrimary ||
                    event.button !== 0 ||
                    isInteractiveElement(event.target as Element)
                ) {
                    return false;
                }

                return true;
            },
        },
    ];
}

function isInteractiveElement(element: Element | null) {
    const interactiveElements = [
        "button",
        "input",
        "textarea",
        "select",
        "option",
    ];
    if (
        element?.tagName &&
        interactiveElements.includes(element.tagName.toLowerCase())
    ) {
        return true;
    }

    return false;
}