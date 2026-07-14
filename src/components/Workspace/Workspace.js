import "./Workspace.css";

import { selectNote } from "../../services/FileService.js";

import {files} from "../../state.js";
import {Filearea} from "../Filearea";
import {Editarea} from "../Editarea";
import {Extendarea} from "../Extendarea";

export function Workspace() {
    
    const workspace = document.createElement("div");
    workspace.className = "workspace";

    const fileArea = Filearea(files, handleSelectFile);
    const editArea = Editarea();

    function handleSelectFile(file){
        selectNote(file.id);
        editArea.render(file);
    }

    workspace.append(fileArea.element);



    workspace.append(editArea.element);
    workspace.append(Extendarea());

    return workspace;
}