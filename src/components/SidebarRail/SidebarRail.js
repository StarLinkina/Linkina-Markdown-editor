import "./SidebarRail.css";

import { createButton } from "../Button";

export function createSidebarRail({ side, image, alt, onExpand }) {
    const sidebarRailElement = document.createElement("aside");
    sidebarRailElement.className = `sidebar-rail sidebar-rail--${side}`;

    const expandButtonElement = createButton({ image, alt });
    expandButtonElement.classList.add("sidebar-rail__expand-button");
    expandButtonElement.addEventListener("click", onExpand);

    sidebarRailElement.append(expandButtonElement);

    return sidebarRailElement;
}