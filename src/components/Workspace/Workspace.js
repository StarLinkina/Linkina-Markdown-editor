import "./Workspace.css";

import {Filearea} from "../Filearea";
import {Editarea} from "../Editarea";
import {Extendarea} from "../Extendarea";

export function Workspace() {
    
    const Workspace = document.createElement("div");
    Workspace.className = "workspace";

    Workspace.append(Filearea());
    Workspace.append(Editarea());
    Workspace.append(Extendarea());

    return Workspace;
}