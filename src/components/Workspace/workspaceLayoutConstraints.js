export const SIDEBAR_MODE = {
    EXPANDED: "expanded",
    COLLAPSED: "collapsed"
};

export const WORKSPACE_LAYOUT_CONFIG = {
    file: {
        defaultWidth: 260,
        minWidth: 200,
        maxWidth: 420,
        collapseThreshold: 176
    },
    extend: {
        defaultWidth: 320,
        minWidth: 240,
        maxWidth: 480,
        collapseThreshold: 216
    },
    documentMinWidth: 480,
    collapsedWidth: 48,
    resizeHandleWidth: 6,
    resizeHandleLineWidth: 1
};

function getAvailableSidebarWidth(workspaceWidth) {
    return workspaceWidth
        - WORKSPACE_LAYOUT_CONFIG.documentMinWidth
        - WORKSPACE_LAYOUT_CONFIG.resizeHandleWidth * 2;
}

export function resolveResponsiveSidebarViews({
    workspaceWidth,
    fileView,
    extendView
}) {
    const sidebarViews = {
        file: { ...fileView, isResponsiveCollapsed: false },
        extend: { ...extendView, isResponsiveCollapsed: false }
    };
    const availableWidth = getAvailableSidebarWidth(workspaceWidth);

    function hasEnoughSpace() {
        return sidebarViews.file.width + sidebarViews.extend.width
            <= availableWidth;
    }

    function collapseTemporarily(side) {
        if (
            sidebarViews[side].width
            <= WORKSPACE_LAYOUT_CONFIG.collapsedWidth
        ) return;

        sidebarViews[side] = {
            ...sidebarViews[side],
            isExpanded: false,
            width: WORKSPACE_LAYOUT_CONFIG.collapsedWidth,
            isResponsiveCollapsed: true
        };
    }

    if (!hasEnoughSpace()) collapseTemporarily("extend");
    if (!hasEnoughSpace()) collapseTemporarily("file");

    return sidebarViews;
}

export function getSidebarDynamicMaxWidth({
    side,
    workspaceWidth,
    otherSidebarWidth
}) {
    const availableWidth = getAvailableSidebarWidth(workspaceWidth)
        - otherSidebarWidth;

    return Math.min(
        WORKSPACE_LAYOUT_CONFIG[side].maxWidth,
        Math.max(WORKSPACE_LAYOUT_CONFIG.collapsedWidth, availableWidth)
    );
}
