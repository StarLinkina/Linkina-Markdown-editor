import "./Workspace.css";

import { SelectFile, UpdateFile } from "../../services/FileService.js";

import {files, currentFileId} from "../../state.js";
import {Filearea} from "../Filearea";
import {Editarea} from "../Editarea";
import {Extendarea} from "../Extendarea";

export function Workspace() {
    
    const workspace = document.createElement("div");
    workspace.className = "workspace";

    const fileArea = Filearea(files, handleSelectFile);
    const editArea = Editarea(handleContentChange);

    //选择更新页面内容
    function handleSelectFile(file){
        SelectFile(file.id);
        editArea.render(file);
    }

    //更新页面内容改变file内容
    function handleContentChange(content) {
        UpdateFile(currentFileId, content);
    }

    workspace.append(fileArea.element);



    workspace.append(editArea.element);
    workspace.append(Extendarea());

    return workspace;
}