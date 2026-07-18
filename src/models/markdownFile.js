// 创建 Markdown 文件，统一其数据结构
export function createMarkdownFile(title) {
    return {
        id: Date.now(),
        title,
        content: "",
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
    };
}
