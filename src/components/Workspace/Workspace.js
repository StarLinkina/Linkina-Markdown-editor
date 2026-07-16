import "./Workspace.css";

import { SelectFile, AddFile, UpdateFile, DeleteFile, ImportFile } from "../../services/FileService.js";

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
        const title = prompt("请输入笔记标题")?.trim(); //防止文件名为" "的文件存在
        if (!title) return;
        const file = AddFile(title);
        file_area.render(files);
        handleSelectFile(file);
    }
    //删除文件
    function handleDeleteFile(id) {
        const isCurrentFile = currentFileId === id; //检测删除的文件是否是当前打开的文件

        //删除且重载
        DeleteFile(id);
        file_area.render(files);

        //若是当前打开的文件
        if (isCurrentFile) {
            SelectFile(null); //设置现在状态为未选中文件
            edit_area.render(null); //重载编辑区
        }
    }
    //外部导入文件
    async function handleImportFile(sourcefile) {
        //异步的，读取sourcefile的内容
        const content = await sourcefile.text();
        //使用导入业务导入这个文件
        const file = ImportFile(sourcefile.name, content);
        file_area.render(files);
        handleSelectFile(file);
    }
    //导出文件
    function handleExportFile(id) {
        //找文件
        const file = files.find(file => file.id === id);
        if (!file) return;
        //创建blob对象
        const blob = new Blob([file.content], {type: "text/markdown;charset=utf-8"});
        //创建临时下载url
        const url = URL.createObjectURL(blob);
        //创建a组件用于下载，并将url绑定在a上
        const link = document.createElement("a");
        link.href = url;
        link.download = `${file.title || "未命名笔记"}.md`;
        //加上link
        document.body.append(link);
        link.click();
        link.remove(); //再去掉link
        //用完需移除url，防止占用太多内存
        URL.revokeObjectURL(url);
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