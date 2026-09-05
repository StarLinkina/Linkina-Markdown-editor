# Linkina Markdown Editor 项目交接文档

> 本文档用于把项目交接给新的对话或新的协作者。请先以当前仓库代码为事实来源，再参考本文中的目标、约定和待办。不要把已经讨论过的方案误认为已经实现。

## 1. 当前快照

- 项目目录：`D:\Project_VScode\Web\Linkina-Markdown-editor\Linkina-Markdown-editor`
- 当前分支：`main`
- 当前提交：`69ed478`（完成Navbar完善，以及视觉统一，提供一个测试文档）
- 文档更新日期：2026-09-05
- 当前工作区包含尚未提交的文件存储可靠性实现和文档同步：加载数据校验、UUID、400ms 防抖、`pagehide` flush、保存状态反馈、错误分类、失败重试和内存数据导出
- `npm run build` 已通过：Vite 8.1.4 共转换 73 个模块
- 当前阶段：核心文件业务、DocumentArea 阅读体验、Workspace 交互式布局、亮暗主题和文件存储可靠性已经完成；下一步处理文件交互完善

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
│ 顶部导航栏：产品名 / GitHub 仓库 / 主题切换       │
├────────────┬──────────────────────────┬─────────────┤
│ 文件区     │ 文档区                   │ 扩展区      │
│            │ 编辑/阅读工具栏          │             │
│ 文件列表   │ 编辑器或 Markdown 预览   │             │
└────────────┴──────────────────────────┴─────────────┘
```

### 3.3 长期扩展目标

- 关键字搜索
- PDF 导出
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

目前按需注册了 plaintext、XML/HTML、CSS、JavaScript、TypeScript、JSON、Bash 和 Markdown。亮色和暗色代码主题均使用项目自己的语义颜色变量，没有直接引入 highlight.js 的整套主题文件。

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
│  ├─ Navbar/               产品名、GitHub 仓库入口和主题切换
│  ├─ Workspace/
│  │  ├─ Workspace.js       页面组合、依赖注入和文件选择协调
│  │  ├─ workspaceLayout.js 侧栏状态、拖动会话、响应式观察和渲染控制
│  │  ├─ workspaceLayoutConstraints.js
│  │  │                     布局常量、文档区保护和侧栏宽度纯计算
│  │  ├─ workspaceLayoutStorage.js
│  │  │                     布局偏好校验、加载和独立持久化
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
│  ├─ fileService.js        文件增删改选及持久化调用
│  └─ filePersistence.js    保存防抖、dirty 状态、flush、重试和状态订阅
├─ utils/
│  ├─ storage.js            Markdown 文件校验、规范化、安全读写和错误分类
│  ├─ theme.js              主题初始化、切换和独立持久化
│  └─ markdownRenderer.js   marked、代码高亮和 Markdown 转 HTML
├─ state.js                 全局文件列表和当前文件 ID
├─ main.js                  应用入口
└─ style.css                全局基础样式、尺寸变量和亮暗主题变量
```

根目录的 `MARKDOWN_VISUAL_TEST.md` 是手动导入应用的主题视觉测试素材，覆盖常见 Markdown 元素、宽表格、长代码和滚动场景，不属于应用运行时模块。

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
→ filePersistence
→ storage/localStorage
→ 注入的 Workspace 协调回调
→ FileArea / DocumentArea 手动调用 render()

filePersistence 保存状态
→ Workspace 订阅
→ DocumentArea 显示 saving / saved / error
→ 保存失败时重试或导出当前内存文件

侧栏操作
→ SidebarRail 或 ResizeHandle
→ workspaceLayout
→ workspaceLayoutConstraints 计算当前窗口下的实际布局
→ 用户布局状态、临时响应式视图和 Workspace CSS 变量
→ workspaceLayoutStorage 在用户完成布局操作时保存偏好
→ FileArea / SidebarRail / ExtendArea 显隐
```

## 6. 数据模型和状态

### 6.1 Markdown 文件模型

当前单个文件的数据结构：

```js
{
    id: crypto.randomUUID(),
    title: "",
    content: "",
    createTime: "ISO 时间字符串",
    updateTime: "ISO 时间字符串"
}
```

新文件使用字符串 UUID。加载时继续兼容已有的正整数 ID；缺失、非法或重复 ID 会生成新 UUID，不强制迁移有效的旧 ID。

### 6.2 全局状态

`state.js` 导出：

- `fileLoadResult`：文件加载状态、修复统计和错误信息
- `markdownFiles`：从 localStorage 读取的文件数组
- `currentFileId`：当前选中文件 ID
- `setCurrentFileId(id)`：更新当前选中状态

`currentFileId` 不持久化。这是有意设计：刷新或首次进入页面后不自动选中文件，编辑区保持不可编辑。

### 6.3 localStorage

- 存储键：`MARKDOWN-FILES`
- 当前存储值：`markdownFiles` 数组的 JSON 字符串
- 添加、删除和导入立即保存；内容编辑只对 localStorage 写入做 400ms 防抖
- 内存中的正文和 `updateTime` 在每次输入时立即更新
- `pagehide` 会 flush 尚未写入的修改
- 加载时逐项校验并规范化文件字段，无法识别的条目会被忽略
- 保存过程提供 `saving`、`saved` 和 `error` 状态
- 保存失败时保留内存数据，区分容量、权限、序列化和未知错误，并支持重试或导出当前文件
- 整份存储读取失败时阻止本页写入，避免用空数组覆盖原始数据

当前尚未增加存储结构版本号和迁移机制。

Workspace 布局使用独立存储：

- 存储键：`LINKINA-WORKSPACE-LAYOUT`
- 每侧只保存 `mode` 和 `width`；`width` 本身保留最后一次有效的展开宽度
- 加载时规范化模式和宽度；宽度无效时使用默认值，超出范围时限制到配置范围
- 不再维护存储版本和重复的 `lastExpandedWidth`
- 响应式临时收起不写回该存储，不会覆盖用户偏好

主题偏好也使用独立存储：

- 存储键：`LINKINA-THEME`
- 可选值：`light` 或 `dark`
- 首次访问或没有有效存储值时跟随系统主题
- 用户手动切换后保存明确选择
- 存储不可用时仍允许当前会话切换主题

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
- filePersistence 负责保存防抖、dirty、flush、重试和状态发布
- storage 负责边界数据校验、localStorage 安全读写和错误分类
- Markdown 原文写入 textarea，文件标题使用 `textContent`
- Markdown HTML 和 highlight.js 生成的 HTML 必须经过 DOMPurify 后才能写入 `innerHTML`
- Markdown 解析与代码高亮集中在 `utils/markdownRenderer.js`，PreviewArea 只负责显示和清理最终结果
- 组件颜色只引用全局语义变量，亮暗主题通过根元素的 `data-theme` 切换
- 未经明确要求，不为了“架构高级”而引入框架或大规模状态库

### 7.6 HTML 语义

当前已采用：

- DocumentArea：`main`
- EditArea：`section`
- PreviewArea：`article`
- FileArea、ExtendArea：`aside`

页面应只保留一个主要的 `main` 区域。

### 7.7 代码实现原则

生成或修改代码时遵守以下原则：

1. 优先选择满足当前需求的最简单实现。只有实际复杂度、明确复用或测试需求出现后，才增加抽象层。
2. 防御代码应与真实风险相称。对 localStorage、用户输入和外部文件等边界数据保留必要校验；对项目内部受控调用不重复堆叠空值检查、兼容分支和兜底状态。
3. 不主动加入需求之外的功能、交互或未来扩展。若附加功能可能有价值，先说明收益和成本，与用户讨论确认后再实现。
4. 修改前先阅读相关现有代码，以当前组件工厂、模块边界、命名方式和 CSS 结构为基础，保持项目风格统一。
5. 代码以直接、清晰、易追踪为优先。使用准确命名和适度拆分；注释只解释不直观的原因、状态区别或约束，不重复描述代码表面行为。
6. 重构应限制在当前任务范围内，保留已经合理的整体结构，不为了形式上的“高级”进行大规模改造。
7. 验证强度与改动风险相匹配。业务代码修改后至少运行构建，并检查受影响的主要交互路径。

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

### 8.3 持久化

已完成文件存储可靠性：

- 启动时加载文件
- 加载数据逐项校验和字段规范化
- 新文件使用 UUID，同时兼容已有数字 ID
- 内容编辑时立即更新内存，只对 localStorage 写入做 400ms 防抖
- 添加、删除、导入立即保存，并吞并已有待保存任务
- `pagehide` 时提交尚未写入的内容
- 保存状态显示 `saving`、`saved` 和 `error`
- 区分容量不足、存储权限受限、序列化失败和未知错误
- 保存失败时保留 dirty 状态和内存内容，支持重试或导出当前文件
- 整份存储读取失败时显示持续错误并阻止覆盖原始数据
- 保存调度已从 `storage.js` 拆分到 `services/filePersistence.js`

### 8.4 命名重构

已完成一轮全项目命名统一：

- `markdownFile` 与 `sourceFile` 已区分
- JS 函数和变量已改为 camelCase
- 组件工厂已统一为 `createXxx`
- 组件目录和文件已改为 PascalCase
- 资源目录已改为 kebab-case
- 大部分旧 snake_case CSS 类已清理

### 8.5 样式和布局

当前已完成：

- 亮色和暗色主题的背景、文字、边框、交互、危险状态和代码语法颜色变量
- 首次访问跟随系统主题、手动切换和独立 localStorage 持久化
- Navbar 左侧产品名，右侧 GitHub 仓库入口和当前主题图标按钮
- 通用字号、代码字体、间距、圆角、控件高度和工具栏高度变量
- 通用 Button 的悬停、按下、焦点、禁用状态及可继承颜色的 SVG 遮罩图标
- Workspace 五列 Grid（左右侧区、两个分割条和中央文档区）
- 左右侧区按钮收起/展开与 48px SidebarRail
- 左右分割条拖动调整宽度、阈值吸附收起和反向拖动展开
- DocumentArea 保留 480px 桌面端最小宽度，侧区拖动上限随可用空间动态变化
- ResizeObserver 监听 Workspace 宽度，空间不足时依次临时收起 ExtendArea 和 FileArea
- 响应式临时收起只改变渲染视图，不覆盖用户保存的 `mode` 和 `width`
- 布局偏好使用独立 localStorage 键保存，并在加载时规范化为 `{ mode, width }`
- ResizeHandle 只负责 Pointer Events 和拖动状态，不包含双击重置、键盘调宽等额外业务
- Workspace 已拆分为布局控制、布局约束、布局存储和文件业务四个模块，并完成一轮代码精简
- FileArea 固定工具栏和可滚动的语义化 `ul/li` 文件列表
- FileItem 使用原生按钮选择文件，支持 Tab、Enter 和空格键；标题省略、操作按钮悬停/聚焦显示、当前项标记
- DocumentArea 纵向 Flex、工具栏排版和响应式间距
- EditArea textarea 填满可用空间，并使用适合源码编辑的等宽字体、字号、行高和正文宽度
- PreviewArea 独立滚动，并完成标题、段落、列表、引用、表格、图片、分隔线、行内代码和代码块的第一轮排版
- DocumentArea 未选中文件空状态
- 编辑/阅读模式按钮的视觉状态和 `aria-pressed` 状态语义
- PreviewArea 的亮暗阅读样式、代码块结构、横向滚动和自定义语法高亮颜色
- `100dvh`、`min-width: 0`、`min-height: 0` 等基础溢出处理
- 删除和导出按钮已改用图标
- FileArea、DocumentArea 和 ExtendArea 的工具栏高度、背景和底部边界保持一致
- 根目录提供 `MARKDOWN_VISUAL_TEST.md`，用于手动检查亮暗主题和 Markdown 元素

## 9. 当前已知问题和技术债

以下是当前代码仍然存在的问题。部分已经讨论过，但没有实现。

### 9.1 导入错误没有反馈

`FileArea` 使用 `try...finally` 清空 input，但没有捕获和显示读取失败。

尚未加入：

- 导入异常提示
- 文件大小限制
- localStorage 容量预检查
- 非 UTF-8 文本编码处理

### 9.2 导出文件名兼容性仍可增强

Blob URL 已改为在下一轮事件循环撤销，避免下载尚未开始就提前失效。

当前文件名仍没有统一清理：

- Windows 非法字符
- 末尾空格或句点
- 用户标题已经包含 `.md` 时可能产生 `.md.md`

### 9.3 部分渲染存在重复

创建和导入文件时：

1. 先调用 `fileArea.render(markdownFiles)`
2. 再调用 `handleFileSelect()`
3. `handleFileSelect()` 再次调用 `fileArea.render()`

不会造成业务错误，但会重复创建文件列表 DOM。后续可以只保留选中后的那一次渲染。

DocumentArea 当前还会在 `render(markdownFile)` 中先执行一次 `previewArea.render(content)`，阅读模式下 `setMode(mode)` 随后会再次渲染。接入代码高亮后，这个重复渲染的成本更高，后续应调整为只在真正显示阅读模式时渲染预览。

### 9.4 ExtendArea 仍是占位功能

- Navbar 已包含产品名、GitHub 仓库入口和主题切换，不承担文件操作或侧栏控制
- ExtendArea 目前仍是空容器，只完成了主题、工具栏和布局样式

ExtendArea 等待搜索、目录或其他明确扩展功能进入后再填充，不应为了视觉完整添加没有业务含义的占位内容。

### 9.5 ResizeHandle 可访问性暂缓

- FileItem 已改为 `ul/li`，文件选择使用原生按钮，并通过 `aria-current="page"` 标记当前文件
- 编辑/阅读按钮和主题按钮已使用 `aria-pressed` 表达状态
- 图标按钮已有 `aria-label` 和 `title`
- ResizeHandle 当前仍只支持指针拖动，没有 separator 语义、焦点入口和键盘调宽

ResizeHandle 的键盘操作曾在布局精简阶段明确移除。如需恢复，应作为独立可访问性任务设计，而不是在其他任务中顺手加入。

### 9.6 状态和架构仍是小项目实现

当前 `markdownFiles` 数组可以被模块直接修改，页面依靠 Workspace 手动重新渲染。

Workspace 已完成第一轮职责拆分：

- `Workspace.js`：UI 组合、依赖注入和文件选择等跨组件协调
- `workspaceLayout.js`：侧栏状态、拖动会话、吸附判断、尺寸观察、shell/rail 显隐和 Grid CSS 变量更新
- `workspaceLayoutConstraints.js`：布局尺寸常量、DocumentArea 最小宽度保护、动态最大宽度和响应式临时收起顺序
- `workspaceLayoutStorage.js`：布局偏好规范化和 localStorage 读写
- `workspaceFileActions.js`：prompt、新建、删除、浏览器文件读取、Blob 下载和内容更新流程

当前仍依赖可直接修改的全局数组、实时 ES Module 绑定和手动 render。等搜索、重命名、快捷键、Electron 文件系统等功能进入后，再考虑：

- state 私有化和 getter
- 轻量订阅机制
- 独立的 browserFileService

暂时不要为此引入大型状态库。

### 9.7 工程配置仍未完善

- `package.json` 名称仍是 `npx`
- 页面 `<title>` 仍是 `npx`
- `index.html` 引用了仓库里不存在的 `/favicon.svg`
- 没有测试、lint 和格式化脚本
- README 只记录了简要目标，没有同步当前实际完成度

### 9.8 编辑区与阅读区尚未按源码位置同步滚动

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
- PDF 导出、搜索：后续阶段

不要在没有用户明确要求时主动实现这些内容。

## 11. 建议的后续阶段

### 已完成：主题与样式

- 亮暗主题、Markdown 阅读样式、代码高亮颜色和主题切换已经完成
- Navbar、FileArea、FileItem、ExtendArea 和布局边界已经完成当前阶段的视觉整理
- FileItem 键盘聚焦、文件列表语义和编辑/阅读模式状态语义已经完成
- 移动端覆盖式抽屉布局仍属于已讨论并暂缓事项

### 已完成：存储可靠性

- localStorage 防抖保存
- 页面关闭前 flush
- 保存状态提示
- 存储失败处理
- 加载数据校验
- UUID

### 下一阶段：交互完善

- 文件重命名
- 文件名清理
- 导入错误提示和大小限制
- 导出兼容性
- 其他可访问性完善
- 使用源码行号锚点实现编辑/阅读模式的双向滚动定位同步（已讨论，暂缓）

### 后续阶段：代码质量

- 减少重复 render
- 按功能增长继续拆分 Workspace（侧栏布局和文件操作流程已完成第一轮拆分）
- 补充 service 和 storage 测试
- 增加 lint/format
- 更新 README、包名、页面标题和 favicon

### 长期阶段：高级功能和桌面化

- 搜索
- PDF 导出
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
17. 左右侧区可以通过按钮收起和展开，并恢复各自保存的展开宽度
18. 左右分割条可以拖动调宽、低于阈值吸附收起，并能从边栏向外拖动展开
19. 窄窗口下优先临时收起 ExtendArea，必要时再临时收起 FileArea，且不会覆盖用户偏好
20. 刷新页面后手动设置的侧栏模式和宽度能够恢复
21. 首次访问且没有主题偏好时跟随系统主题，手动切换后刷新仍恢复用户选择
22. 亮暗主题下 Navbar、文件项、模式按钮和所有图标保持清晰
23. 亮暗主题下 Markdown 标题、链接、引用、表格、行内代码和代码块保持可读
24. FileItem 可以通过 Tab 聚焦，并使用 Enter 或空格选择文件
25. GitHub 仓库入口在新标签页打开正确地址
26. 连续输入时显示“保存中”，停止输入约 400ms 后显示“已保存”
27. 新建、删除或导入会取消待执行的防抖并立即保存最新文件数组
28. 保存失败时内容仍保留在内存，错误持续显示并支持重试或导出当前文件
29. 整份存储读取失败时显示错误，并且不会被当前页面自动覆盖
30. `npm run build` 通过

## 13. 最近对话更新摘要

### 2026-07-24～2026-07-26：DocumentArea 和 Markdown 阅读体验

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

### 2026-07-27～2026-08-10：Workspace 交互式布局

1. 将 Workspace 拆分为组件协调、文件业务、布局控制、布局约束和布局存储几个职责明确的模块。
2. 完成五列 Grid、左右 SidebarRail、按钮收起/展开、Pointer Events 拖动调宽和阈值吸附收起。
3. 为 DocumentArea 保留 480px 最小宽度；空间不足时优先临时收起 ExtendArea，再收起 FileArea。
4. 使用独立 localStorage 键保存左右侧区的 `mode` 和 `width`，响应式临时状态不持久化。
5. 根据当前产品范围主动移除双击重置、键盘调宽、动态 ARIA 数值等未要求功能及其残留代码。
6. 删除 `lastExpandedWidth`、存储版本、过量兼容分支和无效样式状态，将三份核心布局文件从约 756 行缩减到约 448 行。
7. 最新一次生产构建、布局约束检查和旧布局存储兼容检查均已通过。

### 2026-08-11～2026-08-12：亮暗主题与界面视觉

1. 建立背景、文字、边框、交互、危险状态和代码语法颜色的全局语义变量，并完成亮色与暗色两套取值。
2. 新增 `utils/theme.js`；没有有效用户偏好时跟随系统主题，手动切换后使用独立的 `LINKINA-THEME` 保存。
3. 通用 Button 的 SVG 图标改为 CSS 遮罩并继承 `currentColor`，解决暗色主题下原始黑色图标不可见的问题。
4. 统一通用字号、代码字体、间距、圆角、控件高度和工具栏高度变量，并应用到现有组件。
5. 完成 Navbar、FileArea、DocumentArea、ExtendArea、SidebarRail 和 ResizeHandle 的亮暗主题与布局边界。
6. Navbar 左侧显示 `Linkina-Markdown-Editor`，右侧提供 GitHub 仓库入口和主题按钮；主题图标显示当前主题，悬停文字说明切换目标。
7. FileItem 改为语义化 `ul/li` 和原生文件选择按钮，支持键盘选择；编辑/阅读按钮补充 `aria-pressed`。
8. 完成 Markdown 链接、引用、表格、任务列表、行内代码、代码块和 highlight.js 语法类的亮暗配色。
9. 新增 `MARKDOWN_VISUAL_TEST.md`，用于手动导入并检查常见 Markdown 元素、长代码、宽表格和独立滚动。
10. 用户已完成一轮手动视觉检查，未发现明显问题；该阶段生产构建转换 72 个模块并通过。

### 2026-08-20～2026-09-05：文件存储可靠性

1. 加载 `MARKDOWN-FILES` 时逐项校验文件对象，规范化 ID、标题、正文和时间字段，并统计修复与丢弃数量。
2. 新文件、导入文件以及无效或重复 ID 的修复统一使用 `crypto.randomUUID()`，同时保留有效的旧数字 ID。
3. 正文输入立即更新内存，只将 localStorage 写入延迟 400ms；新建、删除和导入仍立即保存。
4. `pagehide` 会 flush 尚未写入的修改；立即保存会取消已有定时器并保存当前完整数组。
5. `storage.js` 负责安全读写和错误分类，`filePersistence.js` 负责防抖、dirty、flush、重试和状态订阅。
6. DocumentArea 工具栏显示“保存中”“已保存”和持续错误；保存失败时可以重试或导出当前内存文件。
7. 保存失败不会清除 dirty 或内存数据；整份存储读取失败时阻止本页写入，避免覆盖原始数据。
8. 隔离逻辑检查覆盖成功、容量不足、权限受限、序列化失败、重试恢复和加载错误写入保护；本地界面检查确认状态转换正确。
9. 最新生产构建转换 73 个模块并通过。

## 14. 给下一次对话的工作准则

下一位协作者应遵守：

1. 先阅读本文档和当前代码，不依据旧对话猜测现状。
2. 区分“已实现”“只讨论过”“用户明确暂缓”的事项。
3. 用户要求检查或解释时，只读分析，不直接修改代码。
4. 用户明确要求修改时，限制在指定范围，避免顺手重构无关内容。
5. 按 7.7 节选择满足需求的最简单实现，不堆叠无实际依据的抽象和防御代码。
6. 不主动增加需求之外的功能；有价值的扩展先讨论，再决定是否实现。
7. 参考项目已有代码，保持原生 JavaScript、组件工厂、命名和目录结构统一。
8. 保持 `markdownFile` 与浏览器 `sourceFile` 的命名边界。
9. 修改组件、目录或 CSS 类名时同步更新所有导入和选择器。
10. 使用准确命名和少量必要注释保证可读性，注释重点解释“为什么”。
11. 修改完成后运行构建，并按回归清单检查相关业务。
12. 保存和 Markdown 渲染涉及用户数据，不允许静默丢失内容。
13. 样式方案应服务于三栏 Markdown 编辑器目标，不把产品改造成笔记管理器。

下一次对话可以直接这样开始：

> 请先阅读项目根目录的 `PROJECT_HANDOFF.md` 和 `TODO.md`，再检查当前仓库。以实际代码为事实来源，并遵守文档中的项目定位、代码实现原则和命名规范；不要重复已完成工作，也不要把只讨论过的方案当成已经实现。完成阅读后，先总结你对当前项目状态的理解，再处理我的新要求。
