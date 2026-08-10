import "./ResizeHandle.css";

export function createResizeHandle({
    side,
    onResizeStart,
    onResize,
    onResizeEnd,
    onResizeCancel
}) {
    const resizeHandleElement = document.createElement("div");
    resizeHandleElement.className = `resize-handle resize-handle--${side}`;

    let activePointerId = null;

    // 清除指针状态，用于拖动结束
    function clearPointerState(pointerId) {
        activePointerId = null;
        resizeHandleElement.classList.remove("resize-handle--dragging");
        document.body.classList.remove("sidebar-resize-active");

        // 清除拖动条对指针的捕获
        if (resizeHandleElement.hasPointerCapture(pointerId)) {
            resizeHandleElement.releasePointerCapture(pointerId);
        }
    }

    // 开始拖动
    resizeHandleElement.addEventListener("pointerdown", event => {
        // 只响应主指针的鼠标左键操作
        if (
            activePointerId !== null ||
            event.isPrimary === false ||
            event.button !== 0
        ) return;

        event.preventDefault();
        activePointerId = event.pointerId;
        resizeHandleElement.setPointerCapture(event.pointerId);
        resizeHandleElement.classList.add("resize-handle--dragging");
        document.body.classList.add("sidebar-resize-active");
        onResizeStart(event.clientX);
    });

    // 拖动中
    resizeHandleElement.addEventListener("pointermove", event => {
        if (event.pointerId !== activePointerId) return;

        event.preventDefault();
        onResize(event.clientX);
    });

    // 拖动结束
    resizeHandleElement.addEventListener("pointerup", event => {
        if (event.pointerId !== activePointerId) return;

        event.preventDefault();

        try {
            onResizeEnd(event.clientX);
        } finally {
            clearPointerState(event.pointerId);
        }
    });

    // 拖动中途取消
    resizeHandleElement.addEventListener("pointercancel", event => {
        if (event.pointerId !== activePointerId) return;

        try {
            onResizeCancel();
        } finally {
            clearPointerState(event.pointerId);
        }
    });

    function setSnapPreview(isActive) {
        resizeHandleElement.classList.toggle(
            "resize-handle--snap-preview",
            isActive
        );
    }

    return {
        element: resizeHandleElement,
        setSnapPreview
    };
}
