import "./Filearea.css";

import { Button } from "../Button";
import { FileItem } from "../Fileitem";

import new_file from "../../assets/new_file/file-plus.svg";
import save_file from "../../assets/save_file/save.svg";
import import_file from "../../assets/import_file/import.svg";


export function Filearea(files, {onSelect, onCreate, onDelete, onImport, onExport}) {
    const file_area = document.createElement("aside");
    file_area.className = "file_area";

    //文件功能导航栏
    const file_toolbar = document.createElement("nav");
    file_toolbar.className = "file_toolbar";
    //新建文件按钮
    const create_file_button = Button({image: new_file, alt: "新建文件"});
    file_toolbar.append(create_file_button);
    create_file_button.addEventListener("click", () => {onCreate()});
    //外部导入文件按钮
    const import_file_button = Button({image: import_file, alt: "导入文件"});
    file_toolbar.append(import_file_button);
    import_file_button.addEventListener("click", () => {onImport()})
    file_area.append(file_toolbar);

    // 文件展示列表
    const file_display = document.createElement("div");
    file_display.className = "file_display";
    //首次渲染file_display
    files.forEach(file => {
        file_display.append(FileItem(file, {onSelect, onDelete, onExport}));
    });
    file_area.append(file_display);


    //重新渲染file_display的函数
    function render(files){
        file_display.replaceChildren();
        files.forEach(file => {
            file_display.append(FileItem(file, {onSelect, onDelete, onExport}));
        });
    }

    

    return{
        element: file_area,
        render
    }
}