import "./ResizeHandle.css";

export function createResizeHandle({
    side,
    label,
    onResizeStart,
    onResize,
    onResizeEnd,
    onResizeCancel,
    onReset
}) {
    const resizeHandleElement = document.createElement("div");
    resizeHandleElement.className = `resize-handle resize-handle--${side}`;
    resizeHandleElement.setAttribute("role", "separator");
    resizeHandleElement.setAttribute("aria-orientation", "vertical");
    resizeHandleElement.setAttribute("aria-label", label);
    resizeHandleElement.title = label;
    resizeHandleElement.tabIndex = 0;

    let activePointerId = null;

    function clearPointerState(pointerId) {
        activePointerId = null;
        resizeHandleElement.classList.remove("resize-handle--dragging");
        document.body.classList.remove("sidebar-resize-active");

        if (resizeHandleElement.hasPointerCapture(pointerId)) {
            resizeHandleElement.releasePointerCapture(pointerId);
        }
    }

    resizeHandleElement.addEventListener("pointerdown", event => {
        if (
            activePointerId !== null ||
            event.isPrimary === false ||
            event.button !== 0
        ) {
            return;
        }

        event.preventDefault();
        activePointerId = event.pointerId;
        resizeHandleElement.setPointerCapture(event.pointerId);
        resizeHandleElement.classList.add("resize-handle--dragging");
        document.body.classList.add("sidebar-resize-active");
        onResizeStart(event.clientX);
    });

    resizeHandleElement.addEventListener("pointermove", event => {
        if (event.pointerId !== activePointerId) return;

        event.preventDefault();
        onResize(event.clientX);
    });

    resizeHandleElement.addEventListener("pointerup", event => {
        if (event.pointerId !== activePointerId) return;

        event.preventDefault();

        try {
            onResizeEnd(event.clientX);
        } finally {
            clearPointerState(event.pointerId);
        }
    });

    resizeHandleElement.addEventListener("pointercancel", event => {
        if (event.pointerId !== activePointerId) return;

        try {
            onResizeCancel();
        } finally {
            clearPointerState(event.pointerId);
        }
    });

    resizeHandleElement.addEventListener("lostpointercapture", event => {
        if (event.pointerId !== activePointerId) return;

        try {
            onResizeCancel();
        } finally {
            clearPointerState(event.pointerId);
        }
    });

    resizeHandleElement.addEventListener("dblclick", event => {
        event.preventDefault();
        onReset();
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
