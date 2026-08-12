# Linkina Markdown 视觉测试

这份文档用于检查 Linkina-Markdown-Editor 在亮色和暗色主题下的 Markdown 阅读效果。请重点观察文字层级、颜色对比、间距、边框以及各区域的滚动行为。

## 1. 正文与行内元素

这是一段普通正文，用来检查中文的字体、字号、行高和段落间距。Markdown 编辑器既要适合阅读简短笔记，也要能承载较长的文章内容。为了让行宽效果更加明显，这一段会稍微写长一些：稳定的排版不会抢夺内容本身的注意力，而应该让标题、正文、链接和代码形成清晰但克制的层级。

这段文字包含 **粗体内容**、*斜体内容*、~~删除内容~~、`const editor = "Linkina";` 行内代码，以及一个通向 [Linkina 项目仓库](https://github.com/StarLinkina/Linkina-Markdown-editor) 的链接。

下面测试强制换行。  
这一行应该直接出现在上一行的下方。

---

## 2. 标题层级

# 一级标题示例

## 二级标题示例

### 三级标题示例

#### 四级标题示例

##### 五级标题示例

###### 六级标题示例

---

## 3. 列表

### 无序列表

- 文件操作
  - 新建 Markdown 文件
  - 导入外部文件
  - 导出 `.md` 文件
- 编辑体验
  - 编辑模式
  - 阅读模式
    - Markdown 渲染
    - 代码语法高亮

### 有序列表

1. 打开一个 Markdown 文件
2. 编辑 Markdown 原文
3. 切换到阅读模式
4. 检查渲染结果

### 任务列表

- [x] 亮色主题
- [x] 暗色主题
- [x] Markdown 代码高亮
- [ ] 存储可靠性增强
- [ ] 文件重命名

---

## 4. 引用

> 好的界面应该安静地服务于内容，而不是让装饰压过内容本身。
>
> 引用中的第二段用于检查段落间距、文字颜色和左侧强调线。
>
> > 这是嵌套引用，用于观察多层引用的缩进和边界表现。

---

## 5. 表格

| 区域 | 当前职责 | 当前状态 |
| --- | --- | ---: |
| Navbar | 产品名称、仓库入口、主题切换 | 已完成 |
| FileArea | 文件操作和文件列表 | 已完成 |
| DocumentArea | 编辑模式和阅读模式 | 已完成 |
| ExtendArea | 未来扩展功能容器 | 占位 |

下面是一张较宽的表格，用于检查独立横向滚动：

| 文件名称 | 创建时间 | 更新时间 | 当前模式 | 存储方式 | Markdown 渲染 | 代码高亮 | HTML 清理 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| visual-test-document-with-a-very-long-file-name.md | 2026-08-12 09:00 | 2026-08-12 18:00 | 阅读模式 | localStorage | marked | highlight.js | DOMPurify |

---

## 6. 代码

### JavaScript

```javascript
const themes = {
    light: {
        background: "#ffffff",
        foreground: "#20242c"
    },
    dark: {
        background: "#191b20",
        foreground: "#e8eaf0"
    }
};

function getNextTheme(currentTheme) {
    return currentTheme === "dark" ? "light" : "dark";
}

console.log(getNextTheme("light"));
```

### HTML

```html
<main class="document-area">
    <article class="preview-area">
        <h1>Markdown Preview</h1>
        <p>安全、清晰、易于阅读。</p>
    </article>
</main>
```

### CSS

```css
:root {
    --color-accent: #5b55d6;
    --radius-medium: 6px;
}

.file-item-active {
    color: var(--color-accent);
    border-radius: var(--radius-medium);
}
```

### JSON

```json
{
    "name": "Linkina-Markdown-Editor",
    "theme": "dark",
    "features": ["edit", "preview", "highlight"]
}
```

### Bash

```bash
npm install
npm run dev
npm run build
```

### 未注册语言回退

```unknown-language
This code block uses an unknown language name.
It should safely fall back to plaintext rendering.
```

### 超长代码行

```javascript
const longLine = "这是一行故意写得非常长的代码，用于检查代码块是否只在自身区域产生横向滚动，而不会撑开整个 DocumentArea 或导致页面级横向滚动。";
```

---

## 7. 其他元素

使用键盘时可以按下 <kbd>Tab</kbd> 切换焦点，再按 <kbd>Enter</kbd> 激活按钮。

需要重点观察的文字可以使用 <mark>标记效果</mark>。

<details>
<summary>展开详细内容</summary>

这里用于检查 details 和 summary 的文字、间距及交互表现。

</details>

---

## 8. 图片

下面使用项目中的示例图地址。通过浏览器导入本文档后，相对路径图片是否显示取决于浏览器中 Markdown 文件的资源解析方式；即使图片未加载，也可以检查图片占位和周围间距。

![Linkina 编辑器布局示例](./示例.png)

---

## 9. 长内容与滚动

第一段：长文档用于检查 PreviewArea 的独立纵向滚动。滚动阅读区时，文件列表和编辑区不应该被同时滚动。

第二段：切换亮色和暗色主题，检查正文、次要文字、链接、引用、表格、行内代码和代码块是否都保持足够对比度。

第三段：切换回编辑模式，检查 textarea 的文字、光标、选区、占位状态和聚焦边界是否清晰。

第四段：再次进入阅读模式，检查标题之间的垂直节奏是否自然，内容首尾是否保留合适的留白。

第五段：缩窄窗口，检查右侧扩展区和左侧文件区是否按照布局规则临时收起，中央文档区不应被压缩到约定的最小宽度以下。

第六段：拖动左右分隔条，检查默认边界、悬停状态、拖动状态和吸附收起预览在两种主题中是否清楚。

第七段：检查当前文件项在默认、悬停和键盘聚焦时是否始终保留选中状态，删除按钮是否使用危险色反馈。

第八段：检查 Navbar 中产品名称、GitHub 仓库入口和主题按钮是否排列稳定，长宽变化时产品名称可以省略，但右侧按钮不应被压缩。

---

## 视觉检查清单

- [ ] 亮色主题正文清晰，背景不过亮
- [ ] 暗色主题正文清晰，背景不是纯黑
- [ ] 标题层级和段落间距自然
- [ ] 链接、引用和选中状态使用统一强调色
- [ ] 表格边框清楚但不过重
- [ ] 行内代码与普通正文容易区分
- [ ] 各类代码语法颜色可辨认
- [ ] 长代码和宽表格只在自身区域横向滚动
- [ ] 阅读区、编辑区和文件列表独立滚动
- [ ] 主题切换后所有图标仍然清晰
