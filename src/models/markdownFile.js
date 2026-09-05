export function createFileId() {
    return crypto.randomUUID();
}

// 创建 Markdown 文件，统一其数据结构
export function createMarkdownFile(title) {
    const currentTime = new Date().toISOString();

    return {
        id: createFileId(),
        title,
        content: "",
        createTime: currentTime,
        updateTime: currentTime
    };
}
