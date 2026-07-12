import { Button } from "../Button";
import "./Navbar.css";
import panel_left_close from "../../assets/left-sidebar/panel-left-close.svg";
import new_file from "../../assets/new_file/file-plus.svg";

export function Navbar() {
    const nav = document.createElement("nav");
    nav.className = "navbar";

    const sidebar_button = Button({image: panel_left_close, alt: "关闭左侧状态栏"});
    nav.append(sidebar_button);

    const new_file_button = Button({image: new_file, alt: "新建文件"});
    nav.append(new_file_button);

    

    return nav;    
}