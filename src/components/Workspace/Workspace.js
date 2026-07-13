import "./Workspace.css";

import {files} from "../../state.js";
import {Filearea} from "../Filearea";
import {Editarea} from "../Editarea";
import {Extendarea} from "../Extendarea";

export function Workspace() {
    
    const workspace = document.createElement("div");
    workspace.className = "workspace";

    const fileArea = Filearea(files);
    workspace.append(fileArea.element);
    workspace.append(Editarea());
    workspace.append(Extendarea());

    return workspace;
}