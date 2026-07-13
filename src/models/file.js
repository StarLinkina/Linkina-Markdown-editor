export function CreateFile(title) {
    return{
        id: Date.now(),
        title,
        content: "",
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
    };
}