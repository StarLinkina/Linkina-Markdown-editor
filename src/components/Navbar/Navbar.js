import { createButton } from "../Button";
import "./Navbar.css";

import panelLeftClose from "../../assets/left-sidebar/panel-left-close.svg";
import panelRightClose from "../../assets/right-sidebar/panel-right-close.svg";

export function createNavbar() {
    const navbarElement = document.createElement("nav");
    navbarElement.className = "navbar";

    // 关闭左侧栏
    const leftSidebarButtonElement = createButton({ image: panelLeftClose, alt: "关闭左侧状态栏" });
    navbarElement.append(leftSidebarButtonElement);

    // 关闭右侧栏
    const rightSidebarButtonElement = createButton({ image: panelRightClose, alt: "关闭右侧状态栏" });
    navbarElement.append(rightSidebarButtonElement);

    return navbarElement;
}
