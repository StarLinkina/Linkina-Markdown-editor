const STORAGE_KEY = "MARKDOWN-FILES";

// 将 Markdown 文件列表持久化到 localStorage
export function saveFiles(markdownFiles) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(markdownFiles)
    );
}

export function loadFiles() {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        return [];
    }

    try {
        const storedFiles = JSON.parse(data);
        return Array.isArray(storedFiles) ? storedFiles : [];
    } catch (error) {
        console.error("加载文件失败", error);
        return [];
    }
}
