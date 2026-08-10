import {
    SIDEBAR_MODE,
    WORKSPACE_LAYOUT_CONFIG
} from "./workspaceLayoutConstraints.js";

const WORKSPACE_LAYOUT_STORAGE_KEY = "LINKINA-WORKSPACE-LAYOUT";

function createDefaultSidebarState(side) {
    return {
        mode: SIDEBAR_MODE.EXPANDED,
        width: WORKSPACE_LAYOUT_CONFIG[side].defaultWidth
    };
}

function normalizeSidebarState(side, storedState) {
    const config = WORKSPACE_LAYOUT_CONFIG[side];
    const width = Number.isFinite(storedState?.width)
        ? Math.min(config.maxWidth, Math.max(config.minWidth, storedState.width))
        : config.defaultWidth;

    return {
        mode: storedState?.mode === SIDEBAR_MODE.COLLAPSED
            ? SIDEBAR_MODE.COLLAPSED
            : SIDEBAR_MODE.EXPANDED,
        width
    };
}

function createDefaultWorkspaceLayoutState() {
    return {
        file: createDefaultSidebarState("file"),
        extend: createDefaultSidebarState("extend")
    };
}

export function loadWorkspaceLayoutState() {
    try {
        const storedLayout = JSON.parse(
            localStorage.getItem(WORKSPACE_LAYOUT_STORAGE_KEY)
        );

        if (!storedLayout) return createDefaultWorkspaceLayoutState();

        return {
            file: normalizeSidebarState("file", storedLayout.file),
            extend: normalizeSidebarState("extend", storedLayout.extend)
        };
    } catch {
        return createDefaultWorkspaceLayoutState();
    }
}

export function saveWorkspaceLayoutState(sidebarLayoutState) {
    const storedLayout = {
        file: { ...sidebarLayoutState.file },
        extend: { ...sidebarLayoutState.extend }
    };

    try {
        localStorage.setItem(
            WORKSPACE_LAYOUT_STORAGE_KEY,
            JSON.stringify(storedLayout)
        );
    } catch {
        // 存储不可用时保留当前会话内的布局状态。
    }
}
