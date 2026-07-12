import { Button } from "../Button";
import "./Navbar.css";

import panel_left_close from "../../assets/left-sidebar/panel-left-close.svg";
import panel_left_open from "../../assets/left-sidebar/panel-left-open.svg";
import panel_right_close from "../../assets/right-sidebar/panel-right-close.svg";
import panel_right_open from "../../assets/right-sidebar/panel-right-open.svg";
import new_file from "../../assets/new_file/file-plus.svg";
import save_file from "../../assets/save_file/save.svg";
import import_file from "../../assets/import_file/import.svg";


export function Navbar() {
    const nav = document.createElement("nav");
    nav.className = "navbar";

    const left_sidebar_button = Button({image: panel_left_close, alt: "关闭左侧状态栏"});
    nav.append(left_sidebar_button);

    const new_file_button = Button({image: new_file, alt: "新建文件"});
    nav.append(new_file_button);

    const save_file_button = Button({image: save_file, alt: "保存文件"});
    nav.append(save_file_button);

    const import_file_button = Button({image: import_file, alt: "导入文件"});
    nav.append(import_file_button);

    const right_sidebar_button = Button({image: panel_right_close, alt: "关闭右侧状态栏"});
    nav.append(right_sidebar_button);


    return nav;    
}