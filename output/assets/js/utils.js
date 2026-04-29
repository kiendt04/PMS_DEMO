const Utils = {
    /**
     * Kiểm tra phiên đăng nhập
     */
    checkAuth() {
        const user = sessionStorage.getItem('pms_user');
        if (!user) {
            window.location.replace('../../login.html');
            return false;
        }
        return JSON.parse(user);
    },

    /**
     * Tải nội dung HTML từ một file và inject vào selector
     */
    async loadComponent(selector, url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load ${url}`);
            let html = await response.text();
            
            // Dọn dẹp mã Live Server tự động chèn nếu có
            html = html.replace(/<!-- Code injected by live-server -->[\s\S]*?<\/script>/gi, '');
            html = html.replace(/<script\b[^>]*>[\s\S]*?WebSocket[\s\S]*?<\/script>/gi, '');
            
            const container = document.querySelector(selector);
            if (container) {
                container.innerHTML = html;
                this.executeScripts(container);
            }
        } catch (err) {
            console.error(err);
        }
    },

    /**
     * Điều hướng trang trong SPA
     */
    async navigateTo(pageId) {
        const contentArea = document.getElementById('content-area');
        const pageTitle = document.getElementById('page-title');
        if (!contentArea) return;

        // 1. Cập nhật active state trên menu
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === pageId) {
                item.classList.add('active');
                const group = item.closest('.nav-group');
                const sidebar = document.getElementById('appSidebar');
                if (group && sidebar && !sidebar.classList.contains('collapsed')) {
                    group.classList.add('open');
                }
            }
        });

        // 2. Load nội dung trang
        const url = `../pages/${pageId}.html`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Không tìm thấy trang: ${pageId}`);
            let html = await response.text();
            
            // Dọn dẹp mã Live Server tự động chèn
            html = html.replace(/<!-- Code injected by live-server -->[\s\S]*?<\/script>/gi, '');
            html = html.replace(/<script\b[^>]*>[\s\S]*?WebSocket[\s\S]*?<\/script>/gi, '');
            
            contentArea.innerHTML = html;
            this.executeScripts(contentArea);

            // 3. Cập nhật tiêu đề Header
            if (pageTitle) {
                const activeItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
                pageTitle.textContent = activeItem ? activeItem.textContent : pageId;
            }

            sessionStorage.setItem('pms_active_page', pageId);
        } catch (err) {
            console.error('Navigation Error:', err);
            contentArea.innerHTML = `<div class="error-msg" style="padding:20px; color:red;">⚠️ Lỗi tải trang: ${pageId}</div>`;
        }
    },

    /**
     * Thu gọn/Mở rộng nhóm menu
     */
    toggleNavGroup(groupId) {
        const sidebar = document.getElementById('appSidebar');
        const isCollapsed = sidebar && sidebar.classList.contains('collapsed');

        if (isCollapsed) {
            this.showFlyout(groupId);
        } else {
            const group = document.getElementById(groupId);
            if (group) group.classList.toggle('open');
        }
    },

    /**
     * Cập nhật trạng thái thu gọn Sidebar
     */
    applySidebarState(collapsed) {
        const sidebar = document.getElementById('appSidebar');
        const mainWrapper = document.querySelector('.main-wrapper');
        if (!sidebar) return;

        if (collapsed) {
            sidebar.classList.add('collapsed');
            if (mainWrapper) mainWrapper.classList.add('sidebar-collapsed');
        } else {
            sidebar.classList.remove('collapsed');
            if (mainWrapper) mainWrapper.classList.remove('sidebar-collapsed');
        }
        localStorage.setItem('pms_sidebar_collapsed', collapsed);
    },

    /**
     * Hiển thị menu phụ khi sidebar đang thu gọn
     */
    showFlyout(groupId) {
        const group = document.getElementById(groupId);
        const flyout = document.getElementById('sidebarFlyout');
        if (!group || !flyout) return;

        const groupName = group.getAttribute('data-group-name');
        const items = group.querySelectorAll('.nav-item');
        const hdr = group.querySelector('.nav-group-hdr');
        const rect = hdr.getBoundingClientRect();

        let html = `<div class="sidebar-flyout-hdr">${groupName}</div>`;
        items.forEach(item => {
            const page = item.getAttribute('data-page');
            const text = item.textContent;
            const isActive = item.classList.contains('active') ? 'active' : '';
            html += `<div class="flyout-item ${isActive}" onclick="Utils.navigateTo('${page}'); Utils.hideFlyout();">${text}</div>`;
        });

        flyout.innerHTML = html;
        flyout.style.top = rect.top + 'px';
        flyout.classList.add('active');

        const outsideClick = (e) => {
            if (!flyout.contains(e.target) && !hdr.contains(e.target)) {
                this.hideFlyout();
                document.removeEventListener('mousedown', outsideClick);
            }
        };
        document.addEventListener('mousedown', outsideClick);
    },

    hideFlyout() {
        const flyout = document.getElementById('sidebarFlyout');
        if (flyout) flyout.classList.remove('active');
    },

    /**
     * Thực thi script trong HTML partial
     */
    executeScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    }
};

// --- Global Event Delegation ---
document.addEventListener('click', (e) => {
    // 1. Click vào Nav Item
    const navItem = e.target.closest('.nav-item[data-page]');
    if (navItem) {
        Utils.navigateTo(navItem.dataset.page);
        return;
    }

    // 2. Click vào Toggle Sidebar
    const toggleBtn = e.target.closest('#sidebarToggle');
    if (toggleBtn) {
        const sidebar = document.getElementById('appSidebar');
        const isCollapsed = sidebar.classList.contains('collapsed');
        Utils.applySidebarState(!isCollapsed);
        return;
    }

    // 3. Click vào Logout
    const logoutBtn = e.target.closest('#logoutBtn');
    if (logoutBtn) {
        sessionStorage.removeItem('pms_user');
        window.location.replace('../../login.html');
        return;
    }
});
