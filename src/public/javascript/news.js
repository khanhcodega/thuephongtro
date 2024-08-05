$(document).ready(function () {
    $('.owl-carousel').owlCarousel({
        items: 6,
        loop: true,
        // nav: true,
        margin: 6,
        dots: true,
        // autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 2,
            },
            360: {
                items: 3,
            },
            // 480: {
            //     items: 3
            // },
            540: {
                items: 4,
            },
            1024: {
                items: 5,
            },
            1200: {
                items: 6,
            },
        },
        onTranslated: function (event) {
            var currentIndex = event.item.index - event.relatedTarget._clones.length / 2 - 1;
            if (currentIndex >= event.item.count) {
                currentIndex = currentIndex % event.item.count;
            }
            var currentItem = $('.owl-item').eq(currentIndex).find('img, video');
            var currentSrc = currentItem.attr('src');
            var currentVideoSrc = $('.owl-item').eq(currentIndex).find('video').attr('src');
            if (currentItem.is('img')) {
                $('#main-video').hide();
                $('#main-image').attr('src', currentSrc).show();
            } else if (currentItem.is('video')) {
                $('#main-image').hide();
                $('#main-video').attr('src', currentVideoSrc).show();
            }
        },
    });

    $('.carousel-image').on('click', function () {
        var src = $(this).attr('src');
        $('#main-image').attr('src', src).show();
        $('#main-video').hide();
    });

    $('.carousel-video').on('click', function (e) {
        e.stopPropagation(); 
    });

    $('#main-video').on('click', function () {
        this.paused ? this.play() : this.pause();
    });

    // Hover effect
    $('.carousel-image').on('mouseenter', function () {
        var src = $(this).attr('src');
        $('#main-image').attr('src', src).show();
        $('#main-video').hide();
    });

    $('.carousel-video').on('mouseenter', function () {
        var src = $(this).attr('src');
        $('#main-video').attr('src', src).show();
        $('#main-image').hide();
    });

    // const userContent = document.querySelector('.user-content');
    // const userPost = document.querySelector('.user-post');
    // const headerHeight = document.querySelector('header').offsetHeight;

    // function updateUserContentPosition() {
    //     const userPostRect = userPost.getBoundingClientRect();
    //     const userContentHeight = userContent.offsetHeight;
    //     const windowHeight = window.innerHeight;
    //     const distanceFromBottom = 20;

    //     if (
    //         userPostRect.top < headerHeight + 20 &&
    //         userPostRect.bottom > userContentHeight + headerHeight + 20
    //     ) {
    //         userContent.style.top = `${headerHeight + 20}px`;
    //     } else if (
    //         userPostRect.bottom <=
    //         userContentHeight + headerHeight + 20
    //     ) {
    //         userContent.style.top = `${userPostRect.bottom - userContentHeight - distanceFromBottom}px`;
    //     } else {
    //         userContent.style.top = `${userPostRect.top}px`;
    //     }
    // }

    // if (userPost) {
    //     console.log('hehe')
    //     window.addEventListener('scroll', updateUserContentPosition);
    //     window.addEventListener('resize', updateUserContentPosition);
    //     updateUserContentPosition();
    // }

    $('.btn-preview').click(function (event) {
        const $itemContent = $(this).closest('.item-content');
        const idNews = $itemContent.data('news');
        fetch('/nha-cho-thue/api/history-news', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ma_so: idNews,
            }),
        })
            .then((response) => response.json())
            .then((data) => { })
            .catch((error) => { });
    });

    $('.contentWrapper').on('click', '.btn-like', function (event) {
        event.preventDefault();
        const $itemContent = $(this).closest('.item-content');
        const idNews = $itemContent.data('news');
        const isLiked = $itemContent.data('da-like');
        fetch('/nha-cho-thue/api/toggle-like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ma_so: idNews,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (isLiked) {
                    $itemContent.data('da-like', 0);
                    $(this).html('<i class="fa-regular fa-heart"></i>');
                } else {
                    $itemContent.data('da-like', 1);
                    $(this).html('<i class="fa-solid fa-heart"></i>');
                }
            })
            .catch((error) => { });
    });

    let inputSearch = '';
    let selectedDistrict = null;
    let selectedCategory = null;
    let selectedMinArea = 0;
    let selectedMaxArea = Number.MAX_SAFE_INTEGER;
    let selectedMinPrice = 0;
    let selectedMaxPrice = Number.MAX_SAFE_INTEGER;

    console.log(selectedCategory)

    $('.btn-search').click(function () {
        // $('input[name=searchInput] ').val();
        inputSearch = $('input[name=seachInput]').val();
        searchNews();
    });

    $('.box-item.district li ').click(function () {
        $('.box-item.district li ').removeClass('active');
        $(this).addClass('active');
        selectedDistrict = $(this).data('id') || null;
        searchNews();
    });

    $('.box-item.category li ').click(function () {
        $('.box-item.category li ').removeClass('active');
        $(this).addClass('active');
        selectedCategory = $(this).data('id') || null;
        searchNews();
    });

    $('.box-item.area li ').click(function () {
        $('.box-item.area li ').removeClass('active');
        $(this).addClass('active');
        selectedMinArea = $(this).data('min') || 0;
        selectedMaxArea = $(this).data('max') || Number.MAX_SAFE_INTEGER;
        searchNews();
    });

    $('.box-item.price li ').click(function () {
        $('.box-item.price li ').removeClass('active');
        $(this).addClass('active');
        selectedMinPrice = $(this).data('min') || 0;
        selectedMaxPrice = $(this).data('max') || Number.MAX_SAFE_INTEGER;
        searchNews();
    });

    $('.box-item.all li.btn-reset').click(function () {
        $('.box-item.district li ').removeClass('active');
        $('.box-item.category li ').removeClass('active');
        $('.box-item.area li ').removeClass('active');
        $('.box-item.price li ').removeClass('active');
        inputSearch = '';
        selectedDistrict = '';
        selectedCategory = '';
        selectedMinArea = 0;
        selectedMaxArea = Number.MAX_SAFE_INTEGER;
        selectedMinPrice = 0;
        selectedMaxPrice = Number.MAX_SAFE_INTEGER;
        searchNews();
    });

    function searchNews() {
        const queryString = `district=${selectedDistrict}&category=${selectedCategory}&minArea=${selectedMinArea}&maxArea=${selectedMaxArea}&minPrice=${selectedMinPrice}&maxPrice=${selectedMaxPrice}&search=${inputSearch}`;
        const url = `/nha-cho-thue?${queryString}`;

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then((html) => {
                const $html = $(html);

                const $data = $html.find('.rental .data');

                if ($data.length > 0) {
                    $('.rental .data').html($data.html());
                    let currentPage = parseInt(
                        $('.pagination').data('currentpage'),
                    );
                    let totalPage = parseInt(
                        $('.pagination').data('totalpage'),
                    );
                    $('.pagination').html(
                        paginationFunction(totalPage, currentPage),
                    );
                } else {
                }
            })
            .catch((error) => { });
    }

    let currentPage = parseInt($('.pagination').data('currentpage'));
    let totalPage = parseInt($('.pagination').data('totalpage'));
    $('.pagination').html(paginationFunction(totalPage, currentPage));

    $('.contentWrapper').on('click', '.pagination li.btn', function (event) {
        event.preventDefault();
        const pageNumber = parseInt($(this).find('a').attr('page-number'));
        getPage(window.location.href, pageNumber, totalPage);
    });
});

function getPage(url, pageNumber, totalPage) {
    let query = url.includes('?') ? '&' : '?';
    $.ajax({
        type: 'GET',
        url: `${url}${query}page=${pageNumber} `,
        success: function (response) {
            $('.contentWrapper').each((index, element) => {
                const correspondingElement = $(response)
                    .find('.contentWrapper')
                    .eq(index);
                $(element).html(correspondingElement.html());
            });

            $('.pagination').html(paginationFunction(totalPage, pageNumber));
        },
        error: function (err) {
            console.error('Error:', err);
        },
    });
}
