import "./Filearea.css";

import { Button } from "../Button";
import { AddFile } from "../../services/FileService";

import new_file from "../../assets/new_file/file-plus.svg";
import save_file from "../../assets/save_file/save.svg";
import import_file from "../../assets/import_file/import.svg";


export function Filearea() {
    const filearea = document.createElement("aside");
    filearea.className = "file_area";

    const filenavbar = document.createElement("nav");
    filenavbar.className = "filenavbar";

    //新建文件
    const new_file_button = Button({image: new_file, alt: "新建文件"});
    filenavbar.append(new_file_button);
    new_file_button.addEventListener("click", () => {
        const title = prompt("请输入笔记标题");
        if (!title) return;
        AddFile(title);
    });
    
    //保存文件
    const save_file_button = Button({image: save_file, alt: "保存文件"});
    filenavbar.append(save_file_button);
    
    //外部导入文件
    const import_file_button = Button({image: import_file, alt: "导入文件"});
    filenavbar.append(import_file_button);

    filearea.append(filenavbar);

    const text = document.createElement("h1");
    text.textContent = "test";

    filearea.append(text);

    return filearea;
}