//创建file的函数，规范了file的数据结构
export function CreateFile(title) {
    return{
        id: Date.now(),
        title,
        content: "",
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
    };
}