$(document).ready(function () {
    const navbarList = $('.header .navbar-list');
    const navbarUser = $('.header .navbar-user');
    const originalNavbarParent = navbarList.parent();
    const originalUserParent = navbarUser.parent();
    const contentSidebar = $('.header .content-sidebar');
    const toggleButton = $('.header .toggle-button');

    toggleButton.click(() => {
        contentSidebar.toggleClass('show');
        if (contentSidebar.hasClass('show')) {
            contentSidebar.append(navbarUser);
            contentSidebar.append(navbarList);
        } else {
            originalNavbarParent.append(navbarList);
            originalUserParent.append(navbarUser);
        }
    });

    function checkWindowWidth() {
        const windowWidth = $(window).width();
        if (windowWidth <= 860) {
            toggleButton.addClass('show');
        } else {
            toggleButton.removeClass('show');
            contentSidebar.removeClass('show');
            originalNavbarParent.append(navbarList);
            originalUserParent.append(navbarUser);
            contentSidebar.empty();
        }
    }

    checkWindowWidth();
    $(window).resize(function () {
        checkWindowWidth();
    });
});

function toast({ title = '', message = '', type = '', duration = 3000 }) {
    const main = document.getElementById('toast');
    if (main) {
        const delay = duration / 1000;
        const toast = document.createElement('div');

        const autoRemoveId = setTimeout(function () {
            main.removeChild(toast);
        }, duration + 1000);

        toast.onclick = function (e) {
            if (e.target.closest('.toast-close')) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        };

        toast.style.animation = `slideInLeft ease .5s,fadeOut linear 1s ${delay}s forwards`;
        const icon = {
            success: 'fa-solid fa-check',
            warning: 'fa-solid fa-triangle-exclamation',
            info: 'fa-solid fa-info',
            error: 'fa-solid fa-circle-exclamation',
        };
        toast.classList.add('toast', `toast--${type}`);
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${icon[type]}"></i>
            </div>
            <div class="toast-body">
                <h3 class="toast-title">${title}</h3>
                <p class="toast-content">${message}</p>
            </div>
            <div class="toast-close">
                <i class="fa-solid fa-xmark"></i>
            </div>
        `;
        main.appendChild(toast);
    }
}
