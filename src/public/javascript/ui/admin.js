const currentUrl = window.location.href;
checkActive();
$('.toggle-button').on('click', function () {
    toggleSidebar();
});

function toggleSidebar() {
    $('.sidebar').toggleClass('collapsed');
    $('.main-content').toggleClass('collapsed');
    $('.header').toggleClass('collapsed');

    if ($('.sidebar').hasClass('collapsed')) {
        $('.subnav').removeClass('open');
    } else {
        checkActive();
    }
}

function checkActive() {
    $('.nav-item a.link').each(function () {
        const linkUrl = $(this).attr('href');
        if (currentUrl.includes(linkUrl) && linkUrl !== '/') {
            $(this).addClass('active');
            $(this).closest('.subnav').addClass('open');
        }
    });
}

function checkWindowWidth() {
    const windowWidth = $(window).width();
    if (windowWidth <= 860) {
        // Change 768 to your desired breakpoint
        // Add collapsed class based on window width
        if (!$('.sidebar').hasClass('collapsed')) {
            $('.sidebar').addClass('collapsed');
            $('.main-content').addClass('collapsed');
            $('.header').addClass('collapsed');
        }
        $('.header .header-content .header-nav ul').hide();
        $('.menu').show();
    } else {
        // Remove collapsed class based on window width
        if ($('.sidebar').hasClass('collapsed')) {
            $('.sidebar').removeClass('collapsed');
            $('.main-content').removeClass('collapsed');
            $('.header').removeClass('collapsed');
        }
        $('.header .header-content .header-nav ul').show();
        $('.menu').hide();
    }
}

checkWindowWidth();
$(window).resize(function () {
    checkWindowWidth();
});
