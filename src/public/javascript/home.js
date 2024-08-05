let selectedDistrict = '';
let selectedCategory = 0;
let selectedMinArea = 0;
let selectedMaxArea = Number.MAX_SAFE_INTEGER;
let selectedMinPrice = 0;
let selectedMaxPrice = Number.MAX_SAFE_INTEGER;
let searchInput = '';
let orderby = false;

function initializeCustomSelects() {
    $('select').each(function () {
        var $this = $(this),
            numberOfOptions = $(this).children('option').length;
        $this.addClass('s-hidden');
        $this.wrap('<div class="select"></div>');

        $this.after('<div class="styledSelect"></div>');

        var $styledSelect = $this.next('div.styledSelect');
        $styledSelect.text($this.children('option').eq(0).text());

        $styledSelect.append('<i class="fas fa-chevron-down"></i>');

        var $list = $('<ul />', {
            class: 'options',
        }).insertAfter($styledSelect);

        for (var i = 0; i < numberOfOptions; i++) {
            $('<li />', {
                text: $this.children('option').eq(i).text(),
                rel: $this.children('option').eq(i).val(),
                'data-min': $this.children('option').eq(i).data('min'),
                'data-max': $this.children('option').eq(i).data('max'),
            }).appendTo($list);
        }

        var $listItems = $list.children('li');

        $styledSelect.click(function (e) {
            e.stopPropagation();
            $('div.styledSelect.active').each(function () {
                $(this).removeClass('active').next('ul.options').hide();
            });
            $(this).toggleClass('active').next('ul.options').toggle();
        });

        $listItems.click(function (e) {
            e.stopPropagation();
            $styledSelect.text($(this).text()).removeClass('active');

            if ($styledSelect.find('i').length === 0) {
                $styledSelect.append('<i class="fas fa-chevron-down"></i>');
            }
            $this.val($(this).attr('rel')).trigger('change'); // Trigger change event on select element
            $list.hide();
        });

        $(document).click(function () {
            $styledSelect.removeClass('active');
            $list.hide();
        });
    });
}

$(document).ready(function () {
    initializeCustomSelects();
    // searchNews();
    searchData();
    $('.district .select ul li').click(function () {
        selectedDistrict = $(this).attr('rel');
        searchNews();
    });

    $('.category .select ul li ').click(function () {
        selectedCategory = $(this).attr('rel');
        searchNews();
    });

    $('.area .select ul li ').click(function () {
        selectedMinArea = $(this).data('min') || 0;
        selectedMaxArea = $(this).data('max') || Number.MAX_SAFE_INTEGER;
        searchNews();
    });

    $('.price .select ul li ').click(function () {
        selectedMinPrice = $(this).data('min') || 0;
        selectedMaxPrice = $(this).data('max') || Number.MAX_SAFE_INTEGER;
        searchNews();
    });

    $('.search-content input[name="seachInput"] ').on('keypress', function (e) {
        const key = e.which;
        if (key == 13) {
            searchInput = $(this).val() || '';
            searchNews();
        }
    });

    $('.search-content .search-box button').on('click', function () {
        searchInput =
            $('.search-content input[name="seachInput"] ').val() || '';
        searchNews();
    });

    $('.slider .btn-refresh').click(function () {
        searchData();
    });

    $('.news-hot').click(function () {
        orderby = false;
        $('.home .btn').removeClass('bolder');
        $(this).addClass('bolder');
        searchNews();
    });

    $('.news-new').click(function () {
        orderby = true;
        $('.home .btn').removeClass('bolder');
        $(this).addClass('bolder');
        searchNews();
    });

    $('.item-content').click(function (event) {
        // const $itemContent = $(this).closest('.item-content');
        const idNews = $(this).data('news');
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
            .then((data) => {})
            .catch((error) => {});
    });
});
function searchNews() {
    // console.log('Searching with parameters:');
    // console.log(`District: ${selectedDistrict}`);
    // console.log(`Category: ${selectedCategory}`);
    // console.log(`Min Area: ${selectedMinArea}`);
    // console.log(`Max Area: ${selectedMaxArea}`);
    // console.log(`Min Price: ${selectedMinPrice}`);
    // console.log(`Max Price: ${selectedMaxPrice}`);
    // console.log(`Search Input: ${searchInput}`);
    // console.log(`Order By: ${orderby}`);

    // Tạo query string như trước đó
    const queryString = `district=${selectedDistrict}&category=${selectedCategory}&minArea=${selectedMinArea}&maxArea=${selectedMaxArea}&minPrice=${selectedMinPrice}&maxPrice=${selectedMaxPrice}&search=${searchInput}&orderby=${orderby}`;
    const url = `/home?${queryString}`;

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then((html) => {
            const $html = $(html);
            const $data = $html.find('.home .list-posts');

            if ($data.length > 0) {
                $('.home .list-posts').html($data.html());
            } else {
                console.error('No data found');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function searchData() {
    selectedDistrict = '';
    selectedCategory = '';
    selectedMinArea = 0;
    selectedMaxArea = Number.MAX_SAFE_INTEGER;
    selectedMinPrice = 0;
    selectedMaxPrice = Number.MAX_SAFE_INTEGER;
    searchInput = '';
    $('.search-content input[name="seachInput"] ').val('');
    $('.select').each(function () {
        var $select = $(this).find('select');
        var $styledSelect = $select.next('.styledSelect');

        $select.val('');

        $styledSelect.text($select.children('option').eq(0).text());
        $styledSelect.append('<i class="fas fa-chevron-down"></i>');
        $styledSelect.removeClass('active').next('.options').hide();
    });
    searchNews();
}
