import type { TouchEvent } from "react";
import { TouchSensor } from "@dnd-kit/core";
import type { TouchSensorOptions } from "@dnd-kit/core";

/**
 * An extended "TouchSensor" that prevent some
 * interactive html element(button, input, textarea, select, option...) from dragging
 */
export class SmartTouchSensor extends TouchSensor {
  static activators: typeof TouchSensor.activators = [
    {
      eventName: "onTouchStart",
      handler: (
        { nativeEvent: event }: TouchEvent,
        { onActivation }: TouchSensorOptions
      ) => {
        if (event.touches.length > 1 || isInteractiveElement(event.target as Element)) {
          return false;
        }

        onActivation?.({ event });
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
