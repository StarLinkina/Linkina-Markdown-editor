import {
    FILE_LOAD_STATUS,
    saveFiles
} from "../utils/storage.js";

const SAVE_DELAY = 400;

export const FILE_PERSISTENCE_STATUS = {
    SAVING: "saving",
    SAVED: "saved",
    ERROR: "error"
};

export const FILE_PERSISTENCE_OPERATION = {
    LOAD: "load",
    SAVE: "save"
};

let saveTimerId = null;
let pendingMarkdownFiles = null;
let hasUnsavedChanges = false;
let isWriteBlocked = false;
let persistenceState = {
    status: FILE_PERSISTENCE_STATUS.SAVED,
    error: null
};

const stateListeners = new Set();

function publishState(nextState) {
    persistenceState = nextState;
    stateListeners.forEach(listener => listener(persistenceState));
}

function publishSavingState() {
    publishState({
        status: FILE_PERSISTENCE_STATUS.SAVING,
        error: null
    });
}

function clearSaveTimer() {
    if (saveTimerId === null) return;

    clearTimeout(saveTimerId);
    saveTimerId = null;
}

function createBlockedSaveResult() {
    return {
        success: false,
        error: persistenceState.error
    };
}

function persistPendingFiles() {
    if (isWriteBlocked) return createBlockedSaveResult();

    if (!hasUnsavedChanges || !pendingMarkdownFiles) {
        return {
            success: true,
            error: null
        };
    }

    if (persistenceState.status !== FILE_PERSISTENCE_STATUS.SAVING) {
        publishSavingState();
    }

    const result = saveFiles(pendingMarkdownFiles);

    if (result.success) {
        hasUnsavedChanges = false;
        pendingMarkdownFiles = null;
        publishState({
            status: FILE_PERSISTENCE_STATUS.SAVED,
            error: null
        });
        return result;
    }

    publishState({
        status: FILE_PERSISTENCE_STATUS.ERROR,
        error: {
            ...result.error,
            operation: FILE_PERSISTENCE_OPERATION.SAVE
        }
    });
    return result;
}

export function initializeFilePersistence(fileLoadResult) {
    clearSaveTimer();
    pendingMarkdownFiles = null;
    hasUnsavedChanges = false;
    isWriteBlocked = fileLoadResult.status === FILE_LOAD_STATUS.ERROR;

    if (isWriteBlocked) {
        publishState({
            status: FILE_PERSISTENCE_STATUS.ERROR,
            error: {
                ...fileLoadResult.error,
                operation: FILE_PERSISTENCE_OPERATION.LOAD
            }
        });
        return;
    }

    publishState({
        status: FILE_PERSISTENCE_STATUS.SAVED,
        error: null
    });
}

export function subscribeToFilePersistence(listener) {
    stateListeners.add(listener);
    listener(persistenceState);

    return () => {
        stateListeners.delete(listener);
    };
}

export function scheduleFilesSave(markdownFiles) {
    pendingMarkdownFiles = markdownFiles;
    hasUnsavedChanges = true;
    clearSaveTimer();

    if (isWriteBlocked) return;

    publishSavingState();
    saveTimerId = setTimeout(() => {
        saveTimerId = null;
        persistPendingFiles();
    }, SAVE_DELAY);
}

export function saveFilesImmediately(markdownFiles) {
    pendingMarkdownFiles = markdownFiles;
    hasUnsavedChanges = true;
    clearSaveTimer();
    return persistPendingFiles();
}

export function flushPendingFilesSave() {
    clearSaveTimer();
    return persistPendingFiles();
}

export function retryPendingFilesSave() {
    return flushPendingFilesSave();
}
