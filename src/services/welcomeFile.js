import { createMarkdownFile } from "../models/markdownFile.js";
import { FILE_LOAD_STATUS } from "../utils/storage.js";
import {
    FILE_PERSISTENCE_STATUS,
    saveFilesImmediately,
    subscribeToFilePersistence
} from "./filePersistence.js";

const WELCOME_STORAGE_KEY = "LINKINA-WELCOME-SHOWN";

function markWelcomeShown() {
    try {
        localStorage.setItem(WELCOME_STORAGE_KEY, "true");
    } catch {
        // 引导标记写入失败不影响已保存的文件。
    }
}

export function initializeWelcomeFile(fileLoadResult, content) {
    if (fileLoadResult.status === FILE_LOAD_STATUS.ERROR) return null;

    try {
        if (localStorage.getItem(WELCOME_STORAGE_KEY) === "true") return null;
    } catch {
        return null;
    }

    const markdownFiles = fileLoadResult.files;

    // 已有文件或修复过的存储属于已有数据，不自动插入引导。
    if (markdownFiles.length > 0 || fileLoadResult.status === FILE_LOAD_STATUS.REPAIRED) {
        markWelcomeShown();
        return null;
    }

    const welcomeFile = createMarkdownFile("欢迎使用 Linkina");
    welcomeFile.content = content;
    markdownFiles.push(welcomeFile);

    const result = saveFilesImmediately(markdownFiles);

    if (result.success) {
        markWelcomeShown();
    } else {
        // 当前状态为保存失败；重试或后续文件操作保存成功后再补记。
        const unsubscribe = subscribeToFilePersistence(state => {
            if (state.status !== FILE_PERSISTENCE_STATUS.SAVED) return;

            markWelcomeShown();
            unsubscribe();
        });
    }

    return welcomeFile;
}
