import { Button } from "../Button";
import "./Navbar.css";

import panel_left_close from "../../assets/left-sidebar/panel-left-close.svg";
import panel_left_open from "../../assets/left-sidebar/panel-left-open.svg";
import panel_right_close from "../../assets/right-sidebar/panel-right-close.svg";
import panel_right_open from "../../assets/right-sidebar/panel-right-open.svg";


export function Navbar() {
    const nav = document.createElement("nav");
    nav.className = "navbar";

    //关闭右侧状态栏
    const left_sidebar_button = Button({image: panel_left_close, alt: "关闭左侧状态栏"});
    nav.append(left_sidebar_button);

    //关闭右侧状态栏
    const right_sidebar_button = Button({image: panel_right_close, alt: "关闭右侧状态栏"});
    nav.append(right_sidebar_button);


    return nav;    
}