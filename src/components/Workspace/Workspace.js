import "./Workspace.css";

import {Filearea} from "../Filearea";
import {Editarea} from "../Editarea";
import {Extendarea} from "../Extendarea";

export function Workspace() {
    
    const workspace = document.createElement("div");
    workspace.className = "workspace";

    workspace.append(Filearea());
    workspace.append(Editarea());
    workspace.append(Extendarea());

    return workspace;
}