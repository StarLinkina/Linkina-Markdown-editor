import "./Workspace.css";

import { SelectFile, AddFile, UpdateFile, DeleteFile } from "../../services/FileService.js";

import {files, currentFileId} from "../../state.js";
import {Filearea} from "../Filearea";
import {Editarea} from "../Editarea";
import {Extendarea} from "../Extendarea";

export function Workspace() {
    
    //创建workspace组件作为整体容器
    const work_space = document.createElement("div");
    work_space.className = "work_space";

    //创建fileArea组件，传入files和业务函数作为参数
    const file_area = Filearea(files, {
        onSelect: handleSelectFile, 
        onCreate: handleCreateFile, 
        onDelete: handleDeleteFile, 
        onImport: handleImportFile, 
        onExport: handleExportFile
    });
    work_space.append(file_area.element);


    //以下是filearea相关业务
    //选择更新页面内容
    function handleSelectFile(file){
        SelectFile(file.id);
        edit_area.render(file);
    }
    //添加文件
    function handleCreateFile() {
        const title = prompt("请输入笔记标题");
        if (!title) return;
        AddFile(title);
        file_area.render(files);
    }
    //删除文件
    function handleDeleteFile(id) {
        DeleteFile(id);
        file_area.render(files);
    }
    //外部导入文件
    function handleImportFile() {
        
        file_area.render(files);
    }
    //导出文件
    function handleExportFile(id) {
        
    }

    //创建edit_area组件，并传入相关业务作为参数
    const edit_area = Editarea(handleContentChange);
    work_space.append(edit_area.element);

    //以下是editarea相关业务
    //更新页面内容改变file内容
    function handleContentChange(content) {
        UpdateFile(currentFileId, content);
    }

    



    


    work_space.append(Extendarea());

    return work_space;
}