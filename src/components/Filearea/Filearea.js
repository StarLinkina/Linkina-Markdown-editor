import "./Filearea.css";

import { Button } from "../Button";
import { AddFile } from "../../services/FileService";
import { FileItem } from "../Fileitem";

import new_file from "../../assets/new_file/file-plus.svg";
import save_file from "../../assets/save_file/save.svg";
import import_file from "../../assets/import_file/import.svg";


export function Filearea(files, onSelect) {
    const filearea = document.createElement("aside");
    filearea.className = "file_area";

    //文件功能导航栏
    const filenavbar = document.createElement("nav");
    filenavbar.className = "filenavbar";

    //新建文件
    const new_file_button = Button({image: new_file, alt: "新建文件"});
    filenavbar.append(new_file_button);
    new_file_button.addEventListener("click", () => {
        const title = prompt("请输入笔记标题");
        if (!title) return;
        AddFile(title);
        render(files);
    });
    
    //保存文件
    const save_file_button = Button({image: save_file, alt: "保存文件"});
    filenavbar.append(save_file_button);
    
    //外部导入文件
    const import_file_button = Button({image: import_file, alt: "导入文件"});
    filenavbar.append(import_file_button);
    

    filearea.append(filenavbar);

    // 文件展示列表
    const filedisplay = document.createElement("div");
    filedisplay.className = "file_display";
    files.forEach(file => {
        filedisplay.append(FileItem(file));
    });

    //重新渲染filedisplay
    function render(files){
        filedisplay.replaceChildren();
        files.forEach(file => {
            filedisplay.append(FileItem(file, onSelect));
        });
    }

    filearea.append(filedisplay);

    return{
        element: filearea,
        render
    }
}