import "./Workspace.css";

import { selectFile } from "../../services/fileService.js";
import {
    retryPendingFilesSave,
    subscribeToFilePersistence
} from "../../services/filePersistence.js";

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

    // 选中文件，涉及两个区域的render
    function handleFileSelect(markdownFile) {
        selectFile(markdownFile.id);
        fileArea.render(markdownFiles, currentFileId);
        documentArea.render(markdownFile);
    }

    // 文件相关操作
    const fileActions = createWorkspaceFileActions({
        onFileSelect: handleFileSelect,
        onFileListRender: (files, selectedFileId = null) => {
            fileArea.render(files, selectedFileId);
        },
        onCurrentFileClear: () => {
            documentArea.clear();
        }
    });

    //三个主区域
    const fileArea = createFileArea(markdownFiles, {
        onSelect: handleFileSelect,
        onCreate: fileActions.createFile,
        onDelete: fileActions.deleteFile,
        onImport: fileActions.importFile,
        onExport: fileActions.exportFile,
        onCollapse: () => workspaceLayout.collapse("file")
    });

    const documentArea = createDocumentArea({
        onContentChange: fileActions.updateFileContent,
        onSaveRetry: retryPendingFilesSave,
        onExportCurrentFile: () => fileActions.exportFile(currentFileId)
    });

    subscribeToFilePersistence(documentArea.renderPersistenceState);

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
