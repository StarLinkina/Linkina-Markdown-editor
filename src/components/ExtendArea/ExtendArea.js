import "./ExtendArea.css";

import { createButton } from "../Button";

import panelRightClose from "../../assets/right-sidebar/panel-right-close.svg";

export function createExtendArea({ onCollapse }) {
    const extendAreaElement = document.createElement("aside");
    extendAreaElement.className = "extend-area";

    const extendToolbarElement = document.createElement("div");
    extendToolbarElement.className = "extend-toolbar";

    const collapseExtendAreaButtonElement = createButton({
        image: panelRightClose,
        alt: "收起扩展区"
    });
    collapseExtendAreaButtonElement.addEventListener("click", onCollapse);
    extendToolbarElement.append(collapseExtendAreaButtonElement);

    const extendContentElement = document.createElement("div");
    extendContentElement.className = "extend-content";

    extendAreaElement.append(extendToolbarElement, extendContentElement);

    return extendAreaElement;
}
