# Linkina Markdown Editor 项目交接文档

> 本文档用于把项目交接给新的对话或新的协作者。请先以当前仓库代码为事实来源，再参考本文中的目标、约定和待办。不要把已经讨论过的方案误认为已经实现。

## 1. 当前快照

- 项目目录：`D:\Project_VScode\Web\Linkina-Markdown-editor\Linkina-Markdown-editor`
- 当前分支：`main`
- 当前提交：`0345543`（已完成 Workspace 布局与文件操作职责的第一轮拆分）
- 文档更新日期：2026-07-27
- 生成本文档时第三、第四阶段侧栏交互与响应式约束代码尚未提交
- `vite build` 已通过：共转换 67 个模块
- 当前阶段：核心业务、DocumentArea 第一轮体验、可拖动侧栏和文档区宽度保护已完成，下一步处理布局持久化、键盘操作、主题与交互细节

## 2. 项目定位

这是一个个人前端练习项目，目标是实现一个具有类 Obsidian 布局和使用体验的 Markdown 文件编辑器。

需要特别注意：

- 项目定位是“Markdown 文件编辑器”，不是笔记管理器或知识库系统。
- 项目内部保存的是虚拟 Markdown 文件数据，不直接等同于浏览器提供的 `File` 对象。
- 当前首先实现浏览器版本，未来可能使用 Electron 打包成桌面应用。
- 现阶段坚持使用原生 JavaScript 和组件工厂，不引入 React、Vue、Redux 等框架。
- AI、PDF 导出、搜索等属于后续扩展，不应干扰当前核心编辑器的稳定性和样式建设。

## 3. 最终产品目标

### 3.1 核心目标

- 新建 Markdown 文件
- 从外部导入 `.md`、`.markdown`、`.txt` 文件
- 在文件区选择文件
- 编辑 Markdown 原文
- 在编辑模式和阅读模式之间切换
- 使用易读样式预览 Markdown
- 删除文件
- 导出 `.md` 文件
- 使用本地存储保留文件
- 页面首次进入或删除当前文件后处于“未选中文件、不可编辑”状态

### 3.2 目标布局

项目的基本视觉结构来自根目录的 `示例.png`：

```text
┌─────────────────────────────────────────────────────┐
│ 顶部导航栏：左侧栏控制 / 标签区域 / 右侧栏控制     │
├────────────┬──────────────────────────┬─────────────┤
│ 文件区     │ 文档区                   │ 扩展区      │
│            │ 编辑/阅读工具栏          │             │
│ 文件列表   │ 编辑器或 Markdown 预览   │             │
└────────────┴──────────────────────────┴─────────────┘
```

### 3.3 长期扩展目标

- 关键字搜索
- PDF 导出
- 明暗主题
- 更完整的 Markdown 阅读样式
- 文件重命名、排序等文件操作扩展
- AI 辅助功能
- Electron 桌面版本

这些不是当前阶段必须同时完成的功能。

## 4. 技术栈与运行方式

- JavaScript ES Modules
- Vite 8
- `marked`：Markdown 转 HTML
- `marked-highlight`：把代码高亮流程接入 `marked`
- `highlight.js`：按需注册语言并生成代码语法类
- `DOMPurify`：清理渲染后的 HTML
- localStorage：浏览器端持久化
- 原生 DOM API：构建组件和绑定事件

当前 Markdown 渲染顺序：

```text
Markdown 原文
→ marked + marked-highlight
→ highlight.js 生成 hljs-* 语法类
→ DOMPurify 清理最终 HTML
→ PreviewArea.innerHTML
```

目前按需注册了 plaintext、XML/HTML、CSS、JavaScript、TypeScript、JSON、Bash 和 Markdown。语法结构已经生成，但亮色/暗色代码主题仍等待主题系统统一处理。

常用命令：

```bash
npm install
npm run dev
npm run build
npm run preview
```

目前没有自动化测试、ESLint 或 Prettier 脚本。

## 5. 当前目录与组件职责

```text
src/
├─ assets/                  图标资源
├─ components/
│  ├─ Button/               通用按钮工厂
│  ├─ Navbar/               顶部导航栏
│  ├─ Workspace/
│  │  ├─ Workspace.js       页面组合、依赖注入和文件选择协调
│  │  ├─ workspaceLayout.js 侧栏状态、拖动会话、响应式观察和渲染控制
│  │  ├─ workspaceLayoutConstraints.js
│  │  │                     布局常量、文档区保护和侧栏宽度纯计算
│  │  └─ workspaceFileActions.js
│  │                         新建、删除、导入、导出和内容更新流程
│  ├─ SidebarRail/          侧区收起后的展开边栏
│  ├─ ResizeHandle/         侧区宽度拖动分割条
│  ├─ FileArea/             左侧文件工具栏与文件列表
│  ├─ FileItem/             单个 Markdown 文件项
│  ├─ DocumentArea/         中央文档区和编辑/阅读模式
│  ├─ EditArea/             textarea 编辑区
│  ├─ PreviewArea/          Markdown 阅读区
│  └─ ExtendArea/           右侧扩展区占位组件
├─ models/
│  └─ markdownFile.js       Markdown 文件数据工厂
├─ services/
│  └─ fileService.js        文件增删改选及持久化调用
├─ utils/
│  ├─ storage.js            localStorage 读写
│  └─ markdownRenderer.js   marked、代码高亮和 Markdown 转 HTML
├─ state.js                 全局文件列表和当前文件 ID
├─ main.js                  应用入口
└─ style.css                全局基础样式和布局变量
```

主要组合关系：

```text
main
├─ Navbar
└─ Workspace
   ├─ 文件侧区
   │  ├─ FileArea
   │  │  └─ FileItem
   │  └─ SidebarRail
   ├─ 左 ResizeHandle
   ├─ DocumentArea
   │  ├─ 内部空状态
   │  ├─ EditArea
   │  └─ PreviewArea
   ├─ 右 ResizeHandle
   └─ 扩展侧区
      ├─ ExtendArea
      └─ SidebarRail
```

业务调用关系：

```text
用户操作
→ 组件回调
→ workspaceFileActions
→ fileService
→ state 中的 markdownFiles
→ storage/localStorage
→ 注入的 Workspace 协调回调
→ FileArea / DocumentArea 手动调用 render()

侧栏操作
→ SidebarRail 或 ResizeHandle
→ workspaceLayout
→ workspaceLayoutConstraints 计算当前窗口下的实际布局
→ 用户布局状态、临时响应式视图和 Workspace CSS 变量
→ FileArea / SidebarRail / ExtendArea 显隐
```

## 6. 数据模型和状态

### 6.1 Markdown 文件模型

当前单个文件的数据结构：

```js
{
    id: Date.now(),
    title: "",
    content: "",
    createTime: "ISO 时间字符串",
    updateTime: "ISO 时间字符串"
}
```

当前 `id` 是数字，由 `Date.now()` 产生。

### 6.2 全局状态

`state.js` 导出：

- `markdownFiles`：从 localStorage 读取的文件数组
- `currentFileId`：当前选中文件 ID
- `setCurrentFileId(id)`：更新当前选中状态

`currentFileId` 不持久化。这是有意设计：刷新或首次进入页面后不自动选中文件，编辑区保持不可编辑。

### 6.3 localStorage

- 存储键：`MARKDOWN-FILES`
- 当前存储值：`markdownFiles` 数组的 JSON 字符串
- 添加、删除、导入、内容编辑都会调用保存

当前只是基础实现，尚未加入防抖、容量错误处理、数据结构校验或版本迁移。

## 7. 已约定的命名和代码规范

### 7.1 文件对象命名

- 项目内部 Markdown 文件对象：`markdownFile`
- Markdown 文件数组：`markdownFiles`
- 浏览器文件选择器产生的原生 `File`：`sourceFile`
- 不使用 `vfile`，避免引入额外概念

### 7.2 JavaScript 命名

- 普通变量和函数：camelCase
- 组件工厂：`createXxx()`，例如 `createFileArea()`
- 事件处理函数：`handleXxx()`，例如 `handleFileDelete()`
- 传给子组件的回调：`onXxx`，例如 `onDelete`
- 常量：UPPER_SNAKE_CASE，例如 `STORAGE_KEY`
- 类：PascalCase（当前项目暂未使用 class）
- 原生 DOM 元素变量：建议使用 `...Element` 后缀
- 布尔值：使用 `is...`、`has...`、`can...` 等前缀

### 7.3 目录和文件

- 组件目录和主文件：PascalCase，例如 `FileArea/FileArea.js`
- service、model、utility 文件：camelCase，例如 `fileService.js`
- 静态资源目录：kebab-case，例如 `new-file/`
- 每个组件通过 `index.js` 统一导出

### 7.4 CSS

- 普通类名：kebab-case
- 组件内部元素和状态优先使用 BEM 风格：
  - `.file-item`
  - `.file-item__title`
  - `.file-item__actions`
  - `.file-item--active`
- 避免重新出现旧的 snake_case 类名，例如 `.file_item`、`.document_area`
- 全局尺寸优先使用 CSS 变量
- 布局组件必须注意 `min-width: 0`、`min-height: 0` 和滚动容器归属

最新一次样式提交中的 `.file-item-title`、`.file-item-active` 等属于约定尚未完全贯彻的地方，后续样式整理时可以统一，不必为了改名单独打断当前工作。

### 7.5 组件和业务边界

- 组件负责创建 DOM、绑定交互、暴露 `render()` 等接口
- Workspace 负责协调组件和业务
- fileService 负责 Markdown 文件增删改选
- storage 只负责持久化
- Markdown 原文写入 textarea，文件标题使用 `textContent`
- Markdown HTML 和 highlight.js 生成的 HTML 必须经过 DOMPurify 后才能写入 `innerHTML`
- Markdown 解析与代码高亮集中在 `utils/markdownRenderer.js`，PreviewArea 只负责显示和清理最终结果
- 未经明确要求，不为了“架构高级”而引入框架或大规模状态库

### 7.6 HTML 语义

当前已采用：

- DocumentArea：`main`
- EditArea：`section`
- PreviewArea：`article`
- FileArea、ExtendArea：`aside`

页面应只保留一个主要的 `main` 区域。

## 8. 已完成的工作

### 8.1 文件相关业务

已完成并能运行：

- 新建文件
- 选择文件
- 编辑文件内容
- 删除文件
- 导入外部文本/Markdown 文件
- 导出 `.md`
- 文件列表重新渲染
- 当前选中文件的高亮状态

删除当前文件时会：

1. 删除数据
2. 把 `currentFileId` 设为 `null`
3. 清空文档区
4. 重置为编辑模式
5. 禁用编辑器和模式按钮

删除其他文件不会影响当前打开文件。

### 8.2 编辑和阅读模式

已完成：

- textarea 编辑
- 编辑/阅读模式切换
- 阅读区使用 `marked` 和独立的 `markdownRenderer`
- 渲染结果使用 DOMPurify 清理
- 未选中文件时显示空状态，同时隐藏编辑区和阅读区
- 未选中文件时禁止编辑并禁用模式按钮
- 编辑/阅读按钮已有激活、悬停、聚焦和禁用状态
- textarea 已有空内容、聚焦和禁用状态
- 阅读区支持围栏代码语法高亮，未知语言回退为 plaintext
- highlight.js 当前使用按需注册语言，未引入全部语言包
- 首次创建 DocumentArea 时执行 `render(null)`
- `clear()` 会把模式重置为 `edit`

当前 Workspace 仍额外调用了一次 `documentArea.clear()`，与 DocumentArea 内部的 `render(null)` 有重复，但不会造成错误。

### 8.3 持久化

已完成基础 localStorage：

- 启动时加载文件
- 添加、删除、导入、编辑后保存
- JSON 解析失败时返回空数组

尚未完成可靠性和性能增强，详见“已知问题”。

### 8.4 命名重构

已完成一轮全项目命名统一：

- `markdownFile` 与 `sourceFile` 已区分
- JS 函数和变量已改为 camelCase
- 组件工厂已统一为 `createXxx`
- 组件目录和文件已改为 PascalCase
- 资源目录已改为 kebab-case
- 大部分旧 snake_case CSS 类已清理

### 8.5 样式和布局

当前已完成第一轮：

- 顶部 Navbar 基础布局
- Workspace 五列 Grid（左右侧区、两个分割条和中央文档区）
- 左右侧区按钮收起/展开与 48px SidebarRail
- 左右分割条拖动调整宽度、阈值吸附收起和反向拖动展开
- 分割条双击恢复默认宽度
- DocumentArea 保留 480px 桌面端最小宽度，侧区拖动上限随可用空间动态变化
- ResizeObserver 监听 Workspace 宽度，空间不足时依次临时收起 ExtendArea 和 FileArea
- 响应式临时收起只改变渲染视图，不覆盖用户选择的模式、宽度和最后展开宽度
- FileArea 固定工具栏和可滚动文件列表
- FileItem 标题省略、操作按钮悬停显示、当前项标记
- DocumentArea 纵向 Flex、工具栏排版和响应式间距
- EditArea textarea 填满可用空间，并使用适合源码编辑的等宽字体、字号、行高和正文宽度
- PreviewArea 独立滚动，并完成标题、段落、列表、引用、表格、图片、分隔线、行内代码和代码块的第一轮排版
- DocumentArea 未选中文件空状态
- 编辑/阅读模式按钮的视觉状态
- PreviewArea 代码块结构样式、横向滚动和语法高亮类
- `100dvh`、`min-width: 0`、`min-height: 0` 等基础溢出处理
- 删除和导出按钮已改用图标

当前没有统一设置正文、背景、边框、链接、引用和代码语法颜色；这些颜色将与后续亮色/暗色主题系统一起完成。Navbar、FileArea、ExtendArea 和整体主题仍未完成。

## 9. 当前已知问题和技术债

以下是当前代码仍然存在的问题。部分已经讨论过，但没有实现。

### 9.1 localStorage 每次输入都同步保存

当前：

```text
textarea input
→ updateFile()
→ JSON.stringify(markdownFiles)
→ localStorage.setItem()
```

localStorage 是同步 API。文件变多或内容变大后可能导致输入卡顿。

已经约定的实现方向：

- 每次输入立即更新内存中的 `markdownFile.content`
- 只对 localStorage 写入做 300～500ms 防抖
- 添加、删除、导入仍然立即保存
- 页面 `pagehide` 时执行待保存内容
- 提供 `saving / saved / error` 状态

注意：不要对整个 `updateFile()` 做防抖，否则切换文件时可能把旧文件内容写到新文件。

### 9.2 localStorage 失败处理不足

当前问题：

- `setItem()` 没有 `try...catch`
- `getItem()` 位于 `try...catch` 外
- 存储空间不足或权限受限时可能直接报错
- 保存失败后用户不会收到提示
- 加载时只验证最外层是不是数组，没有验证每个文件对象

建议后续加入：

- `saveFiles()` 返回明确结果
- 区分 `QuotaExceededError`、`SecurityError`
- 保存失败时保留内存内容，并显示持续提示
- 支持手动重试或导出
- 对读取数据逐项校验和规范化
- 将来增加存储结构版本号

### 9.3 ID 仍使用 `Date.now()`

快速创建或批量导入时理论上可能产生重复 ID。

后续可以使用 `crypto.randomUUID()`，同时兼容 localStorage 中已有的数字 ID。

### 9.4 导入错误没有反馈

`FileArea` 使用 `try...finally` 清空 input，但没有捕获和显示读取失败。

尚未加入：

- 导入异常提示
- 文件大小限制
- localStorage 容量预检查
- 非 UTF-8 文本编码处理

### 9.5 导出兼容性仍可增强

当前在点击下载后立即 `URL.revokeObjectURL(url)`，部分环境下可以延迟到下一轮事件循环再撤销。

文件名也没有统一清理：

- Windows 非法字符
- 末尾空格或句点
- 用户标题已经包含 `.md` 时可能产生 `.md.md`

### 9.6 部分渲染存在重复

创建和导入文件时：

1. 先调用 `fileArea.render(markdownFiles)`
2. 再调用 `handleFileSelect()`
3. `handleFileSelect()` 再次调用 `fileArea.render()`

不会造成业务错误，但会重复创建文件列表 DOM。后续可以只保留选中后的那一次渲染。

DocumentArea 也同时存在内部 `render(null)` 和 Workspace 外部 `clear()` 的重复初始化。

DocumentArea 当前还会在 `render(markdownFile)` 中先执行一次 `previewArea.render(content)`，阅读模式下 `setMode(mode)` 随后会再次渲染。接入代码高亮后，这个重复渲染的成本更高，后续应调整为只在真正显示阅读模式时渲染预览。

### 9.7 Navbar 和 ExtendArea 仍是占位功能

- Navbar 当前保留空的顶部布局，侧栏控制已经移动到 FileArea、ExtendArea 和 SidebarRail
- ExtendArea 目前是空容器

这些属于当前样式与交互阶段的正常未完成项。

### 9.8 可访问性和语义仍可继续完善

- FileItem 外层是可点击的 `div`，键盘无法直接选择
- 通用 Button 已显式设置 `type="button"`
- 图标按钮已有 `aria-label` 和 `title`，这是正确的
- 编辑/阅读按钮已有视觉激活状态，但尚未补充 `aria-pressed` 或等价的 tab 语义
- ResizeHandle 已有 separator 语义和焦点状态，但键盘调整宽度及动态 `aria-valuenow` 尚未实现
- 后续可以把文件列表改为 `ul/li`，标题操作改为可聚焦按钮

### 9.9 状态和架构仍是小项目实现

当前 `markdownFiles` 数组可以被模块直接修改，页面依靠 Workspace 手动重新渲染。

Workspace 已完成第一轮职责拆分：

- `Workspace.js`：UI 组合、依赖注入和文件选择等跨组件协调
- `workspaceLayout.js`：侧栏状态、拖动会话、吸附判断、尺寸观察、shell/rail 显隐和 Grid CSS 变量更新
- `workspaceLayoutConstraints.js`：布局尺寸常量、DocumentArea 最小宽度保护、动态最大宽度和响应式临时收起顺序
- `workspaceFileActions.js`：prompt、新建、删除、浏览器文件读取、Blob 下载和内容更新流程

当前仍依赖可直接修改的全局数组、实时 ES Module 绑定和手动 render。等搜索、重命名、快捷键、Electron 文件系统等功能进入后，再考虑：

- state 私有化和 getter
- 轻量订阅机制
- 独立的 browserFileService
- 更明确的保存状态管理

暂时不要为此引入大型状态库。

### 9.10 工程配置仍未完善

- `package.json` 名称仍是 `npx`
- 页面 `<title>` 仍是 `npx`
- `index.html` 引用了仓库里不存在的 `/favicon.svg`
- 没有测试、lint 和格式化脚本
- README 只记录了简要目标，没有同步当前实际完成度

### 9.11 编辑区与阅读区尚未按源码位置同步滚动

当前 EditArea 和 PreviewArea 是两个独立滚动容器。用户在编辑区滚动后切换到阅读模式，预览区仍保留自己的滚动位置，因此可能看不到刚才正在编辑的内容。

已经讨论但明确暂缓的方案是“源码行号锚点同步”，不采用简单的像素或滚动百分比同步：

1. Markdown 解析阶段为块级 token 获取源码起止行
2. 渲染标题、段落、列表、引用、表格和代码块时写入 `data-source-start` / `data-source-end`
3. EditArea 根据 textarea 的可视区域估算顶部源码行
4. 切换到 PreviewArea 时找到最近的源码锚点
5. 在相邻锚点之间按行号插值并设置预览区滚动位置
6. 从阅读模式返回编辑模式时执行反向映射
7. 图片异步加载后需要校正预览布局变化

该方案比滚动百分比更准确，但需要扩展 Markdown token 位置信息和两个区域的滚动接口，目前只记录在 TODO 中，尚未实现。

## 10. 明确暂缓或不优先的事项

- 删除文件后的恢复、撤销或回收站：用户目前明确决定暂不处理
- 大规模架构改造：核心业务和样式稳定前不优先
- Electron：浏览器版本完成后再进入
- AI 功能：长期扩展
- PDF 导出、搜索、明暗主题：后续阶段

不要在没有用户明确要求时主动实现这些内容。

## 11. 建议的后续阶段

### 阶段 A：完成当前样式与布局

- 在主题阶段完成整体色彩、边框和背景
- 为 Markdown 阅读区和代码高亮设计亮色/暗色主题
- 完成 FileItem 选中、悬停、聚焦状态
- 在后续移动端阶段为低于桌面五列最小宽度的窗口设计覆盖式抽屉布局

### 阶段 B：存储可靠性

- localStorage 防抖保存
- 页面关闭前 flush
- 保存状态提示
- 存储失败处理
- 加载数据校验
- UUID

### 阶段 C：交互完善

- 文件重命名
- 文件名清理
- 导入错误提示和大小限制
- 导出兼容性
- 分割条键盘调整、动态 ARIA 数值和其他可访问性
- 使用源码行号锚点实现编辑/阅读模式的双向滚动定位同步（已讨论，暂缓）

### 阶段 D：代码质量

- 减少重复 render
- 按功能增长继续拆分 Workspace（侧栏布局和文件操作流程已完成第一轮拆分）
- 补充 service 和 storage 测试
- 增加 lint/format
- 更新 README、包名、页面标题和 favicon

### 阶段 E：高级功能和桌面化

- 搜索
- PDF 导出
- 主题系统
- AI
- Electron 文件系统与桌面打包

## 12. 回归检查清单

每次修改业务代码后，至少检查：

1. 首次进入页面时没有选中文件，并显示 DocumentArea 空状态
2. textarea 不可编辑且隐藏，编辑/阅读按钮不可用
3. 新建文件后自动选中并可以编辑
4. 文件列表只高亮当前文件
5. 切换文件时内容正确
6. 编辑内容后切换阅读模式，Markdown 正确渲染
7. 从阅读模式切回编辑模式，原文没有丢失
8. 删除非当前文件不影响当前文档
9. 删除当前文件后文档区清空并恢复编辑模式
10. 导入文件后标题和内容正确
11. 导出文件内容不是 `index.html`
12. 刷新页面后文件仍在，但默认没有选中文件
13. 控制台没有未处理异常
14. 文件列表、编辑区和预览区滚动互不干扰
15. 围栏代码按已注册语言生成 `hljs-*` 语法类，未知语言安全回退为 plaintext
16. 代码块、宽表格和长行只在自身区域横向滚动
17. `npm run build` 通过

## 13. 本轮对话更新摘要（2026-07-24～2026-07-26）

本轮围绕 DocumentArea 和 Markdown 阅读体验完成了以下工作：

1. 阅读交接文档和当前仓库，确认项目定位、原生 JavaScript 组件结构及核心业务完成度。
2. 对 DocumentArea、EditArea 和 PreviewArea 进行第一轮无主题色排版：
   - 自适应正文宽度和内边距
   - 编辑器等宽字体、字号与行高
   - Markdown 标题、段落、列表、引用、表格、图片、分隔线和代码块排版
3. 加入未选中文件时的空状态；编辑区和预览区在该状态下隐藏。
4. 完善编辑/阅读按钮以及 textarea 的激活、悬停、聚焦、禁用和空内容状态。
5. 引入 `marked-highlight` 和按需加载的 `highlight.js`，新增 `utils/markdownRenderer.js`，并保留 DOMPurify 最终清理。
6. 明确暂不在本阶段确定整体颜色；正文、控件和代码语法颜色等待亮色/暗色主题统一设计。
7. 发现编辑模式和阅读模式切换时滚动位置不对应的问题。
8. 放弃把“滚动百分比同步”作为最终实现，选择更准确的“源码行号锚点 + 相邻锚点插值”方向；该方案已记录但暂缓开发。

本轮没有实现滚动同步。后续协作者不能把上述源码行号方案误认为已完成。

## 14. 给下一次对话的工作准则

下一位协作者应遵守：

1. 先阅读本文档和当前代码，不依据旧对话猜测现状。
2. 区分“已实现”“只讨论过”“用户明确暂缓”的事项。
3. 用户要求检查或解释时，只读分析，不直接修改代码。
4. 用户明确要求修改时，限制在指定范围，避免顺手重构无关内容。
5. 保持原生 JavaScript 方向，不主动引入框架。
6. 保持 `markdownFile` 与浏览器 `sourceFile` 的命名边界。
7. 修改组件、目录或 CSS 类名时同步更新所有导入和选择器。
8. 修改完成后运行构建，并按回归清单检查相关业务。
9. 保存和 Markdown 渲染涉及用户数据，不允许静默丢失内容。
10. 样式方案应服务于三栏 Markdown 编辑器目标，不把产品改造成笔记管理器。

下一次对话可以直接这样开始：

> 请先阅读项目根目录的 `PROJECT_HANDOFF.md`，再检查当前仓库。以文档中的项目定位、命名规范、已完成状态和后续阶段为准，不要重复已经完成的重构，也不要把只讨论过的方案当成已经实现。完成阅读后，先总结你对当前项目状态的理解，再处理我的新要求。
