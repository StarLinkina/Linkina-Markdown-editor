import { createFileId } from "../models/markdownFile.js";

const STORAGE_KEY = "MARKDOWN-FILES";
const DEFAULT_FILE_TITLE = "未命名笔记";
const MARKDOWN_FILE_FIELDS = [
    "id",
    "title",
    "content",
    "createTime",
    "updateTime"
];

export const FILE_LOAD_STATUS = {
    OK: "ok",
    REPAIRED: "repaired",
    ERROR: "error"
};

export const FILE_LOAD_ERROR_TYPE = {
    STORAGE_UNAVAILABLE: "storage-unavailable",
    INVALID_JSON: "invalid-json",
    INVALID_ROOT: "invalid-root"
};

export const FILE_SAVE_ERROR_TYPE = {
    QUOTA_EXCEEDED: "quota-exceeded",
    STORAGE_UNAVAILABLE: "storage-unavailable",
    SERIALIZATION_FAILED: "serialization-failed",
    UNKNOWN: "unknown"
};

function isStoredFileObject(value) {
    return typeof value === "object"
        && value !== null
        && !Array.isArray(value);
}

function isValidFileId(id) {
    return (
        typeof id === "number"
        && Number.isSafeInteger(id)
        && id > 0
    ) || (
        typeof id === "string"
        && id.trim().length > 0
    );
}

function createUniqueFileId(usedIds) {
    let id = createFileId();

    while (usedIds.has(id)) {
        id = createFileId();
    }

    return id;
}

function normalizeFileId(id, usedIds) {
    const normalizedId = typeof id === "string" ? id.trim() : id;
    const nextId = isValidFileId(normalizedId) && !usedIds.has(normalizedId)
        ? normalizedId
        : createUniqueFileId(usedIds);

    usedIds.add(nextId);
    return nextId;
}

function normalizeTitle(title) {
    const normalizedTitle = typeof title === "string"
        ? title.trim()
        : typeof title === "number" || typeof title === "boolean"
            ? String(title)
            : "";

    return normalizedTitle || DEFAULT_FILE_TITLE;
}

function normalizeContent(content) {
    if (typeof content === "string") return content;

    if (typeof content === "number" || typeof content === "boolean") {
        return String(content);
    }

    return "";
}

function normalizeTimestamp(value) {
    if (typeof value !== "string") return null;

    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp)
        ? new Date(timestamp).toISOString()
        : null;
}

function hasCanonicalFileShape(storedFile, normalizedFile) {
    const storedFields = Object.keys(storedFile);

    return storedFields.length === MARKDOWN_FILE_FIELDS.length
        && MARKDOWN_FILE_FIELDS.every(field => (
            storedFile[field] === normalizedFile[field]
        ));
}

function normalizeStoredFile(storedFile, usedIds, fallbackTime) {
    const id = normalizeFileId(storedFile.id, usedIds);
    const storedCreateTime = normalizeTimestamp(storedFile.createTime);
    const storedUpdateTime = normalizeTimestamp(storedFile.updateTime);
    const createTime = storedCreateTime ?? storedUpdateTime ?? fallbackTime;
    const updateTime = storedUpdateTime ?? createTime;

    return {
        id,
        title: normalizeTitle(storedFile.title),
        content: normalizeContent(storedFile.content),
        createTime,
        updateTime
    };
}

export function normalizeStoredFiles(storedFiles) {
    const files = [];
    const usedIds = new Set();
    const fallbackTime = new Date().toISOString();
    let repairedCount = 0;
    let discardedCount = 0;

    storedFiles.forEach(storedFile => {
        if (!isStoredFileObject(storedFile)) {
            discardedCount += 1;
            return;
        }

        const normalizedFile = normalizeStoredFile(
            storedFile,
            usedIds,
            fallbackTime
        );

        if (!hasCanonicalFileShape(storedFile, normalizedFile)) {
            repairedCount += 1;
        }

        files.push(normalizedFile);
    });

    return {
        files,
        needsRewrite: repairedCount > 0 || discardedCount > 0,
        repairedCount,
        discardedCount
    };
}

function createLoadError(type, error) {
    return {
        files: [],
        status: FILE_LOAD_STATUS.ERROR,
        needsRewrite: false,
        repairedCount: 0,
        discardedCount: 0,
        error: {
            type,
            message: error instanceof Error ? error.message : String(error)
        }
    };
}

function createSaveError(type, error) {
    return {
        success: false,
        error: {
            type,
            message: error instanceof Error ? error.message : String(error)
        }
    };
}

function getSaveErrorType(error) {
    if (error?.name === "QuotaExceededError") {
        return FILE_SAVE_ERROR_TYPE.QUOTA_EXCEEDED;
    }

    if (error?.name === "SecurityError") {
        return FILE_SAVE_ERROR_TYPE.STORAGE_UNAVAILABLE;
    }

    return FILE_SAVE_ERROR_TYPE.UNKNOWN;
}

// 将 Markdown 文件列表持久化到 localStorage
export function saveFiles(markdownFiles) {
    let serializedFiles;

    try {
        serializedFiles = JSON.stringify(markdownFiles);
    } catch (error) {
        return createSaveError(
            FILE_SAVE_ERROR_TYPE.SERIALIZATION_FAILED,
            error
        );
    }

    try {
        localStorage.setItem(STORAGE_KEY, serializedFiles);
        return {
            success: true,
            error: null
        };
    } catch (error) {
        return createSaveError(getSaveErrorType(error), error);
    }
}

export function loadFiles() {
    let data;

    try {
        data = localStorage.getItem(STORAGE_KEY);
    } catch (error) {
        console.error("读取文件存储失败", error);
        return createLoadError(
            FILE_LOAD_ERROR_TYPE.STORAGE_UNAVAILABLE,
            error
        );
    }

    if (!data) {
        return {
            files: [],
            status: FILE_LOAD_STATUS.OK,
            needsRewrite: false,
            repairedCount: 0,
            discardedCount: 0,
            error: null
        };
    }

    let storedFiles;

    try {
        storedFiles = JSON.parse(data);
    } catch (error) {
        console.error("解析文件存储失败", error);
        return createLoadError(FILE_LOAD_ERROR_TYPE.INVALID_JSON, error);
    }

    if (!Array.isArray(storedFiles)) {
        const error = new TypeError("文件存储的根数据不是数组");
        console.error("加载文件失败", error);
        return createLoadError(FILE_LOAD_ERROR_TYPE.INVALID_ROOT, error);
    }

    const normalizedResult = normalizeStoredFiles(storedFiles);

    return {
        ...normalizedResult,
        status: normalizedResult.needsRewrite
            ? FILE_LOAD_STATUS.REPAIRED
            : FILE_LOAD_STATUS.OK,
        error: null
    };
}
