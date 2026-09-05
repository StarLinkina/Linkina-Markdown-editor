# Linkina Markdown Editor TODO

> 本文档只保留尚未完成的事项。已完成的功能和历史进展记录在 `PROJECT_HANDOFF.md`。

## 当前优先级：文件交互完善

- [ ] 减少创建和导入文件时重复执行的文件列表渲染。
- [ ] 只在真正显示阅读模式时渲染 PreviewArea，避免 DocumentArea 重复解析 Markdown。
- [ ] 为导入失败增加明确提示，并评估文件大小限制。
- [ ] 清理导出文件名中的非法字符、末尾空格或句点，并避免重复添加 `.md`。
- [ ] 实现文件重命名。

## 工程配置

- [ ] 更新 `package.json` 中的项目名称。
- [ ] 更新页面 `<title>`，补充或移除当前不存在的 `/favicon.svg`。
- [ ] 更新 README，使其反映当前实际功能和运行方式。
- [ ] 根据项目规模补充必要的 service、storage 和布局计算测试。
- [ ] 根据需要增加 lint 和格式化脚本。

## 已讨论并暂缓

- [ ] 使用源码行号锚点实现编辑模式和阅读模式的双向滚动定位同步。
  - [ ] 在 Markdown 解析阶段获取块级 token 的源码起止行。
  - [ ] 为预览区块级元素写入 `data-source-start` 和 `data-source-end`。
  - [ ] 让 EditArea 暴露当前可视区域对应的源码行。
  - [ ] 让 PreviewArea 支持按源码锚点定位，并在相邻锚点之间插值。
  - [ ] 支持从 PreviewArea 反向映射到 EditArea。
  - [ ] 处理图片异步加载和超长代码块造成的布局偏移。
- [ ] 为低于桌面五列最小宽度的窗口设计移动端覆盖式抽屉布局。
- [ ] 搜索、PDF 导出、AI 和 Electron 桌面版等长期扩展。
