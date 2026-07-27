import "./Workspace.css";

import { selectFile } from "../../services/fileService.js";

import { markdownFiles, currentFileId } from "../../state.js";
import { createFileArea } from "../FileArea";
import { createDocumentArea } from "../DocumentArea";
import { createExtendArea } from "../ExtendArea";
import { createWorkspaceLayout } from "./workspaceLayout.js";
import { createWorkspaceFileActions } from "./workspaceFileActions.js";

export function createWorkspace() {
    const workspaceElement = document.createElement("div");
    workspaceElement.className = "workspace";

    const workspaceLayout = createWorkspaceLayout(workspaceElement);

    function handleFileSelect(markdownFile) {
        selectFile(markdownFile.id);
        fileArea.render(markdownFiles, currentFileId);
        documentArea.render(markdownFile);
    }

    const fileActions = createWorkspaceFileActions({
        onFileSelect: handleFileSelect,
        onFileListRender: (files, selectedFileId = null) => {
            fileArea.render(files, selectedFileId);
        },
        onCurrentFileClear: () => {
            documentArea.clear();
        }
    });

    const fileArea = createFileArea(markdownFiles, {
        onSelect: handleFileSelect,
        onCreate: fileActions.createFile,
        onDelete: fileActions.deleteFile,
        onImport: fileActions.importFile,
        onExport: fileActions.exportFile,
        onCollapse: () => workspaceLayout.collapse("file")
    });

    const documentArea = createDocumentArea({
        onContentChange: fileActions.updateFileContent
    });
    documentArea.clear();

    const extendArea = createExtendArea({
        onCollapse: () => workspaceLayout.collapse("extend")
    });

    workspaceLayout.mount({
        fileArea: fileArea.element,
        documentArea: documentArea.element,
        extendArea
    });

    return workspaceElement;
}
