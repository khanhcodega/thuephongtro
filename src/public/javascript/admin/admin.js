const btnAdd = $('.form .btn-add');
const btnEdit = $('.form .btn-edit');
const btnSave = $('.form .btn-save');
// const btnDelete = $(".form .btn-delete");
const btnReset = $('.form .btn-reset');
const citySelect = $('#city');
const districtSelect = $('#district');
const form = $('.form #form-1');
let flagSave = 1;

function checkFlag(flag) {
    // btnDelete.prop('disabled', true)
    btnSave.prop('disabled', true);
    btnAdd.prop('disabled', false);
    btnEdit.prop('disabled', false);
    $('.form input').prop('readonly', true);

    if (flag == 1) {
        btnAdd.prop('disabled', true);
        btnSave.prop('disabled', false);
        $('.form input').prop('readonly', false);
    } else if (flag == 2) {
        $('.form input').prop('readonly', false);
        btnEdit.prop('disabled', true);
        btnSave.prop('disabled', false);
        // btnDelete.prop('disabled', false)
    }
    flagSave = flag;
}

$(document).ready(function () {
    checkFlag();

    // $('.admin-storeDistricts .form').ready(getCities)
    // $('.admin-storeWards .form').ready(() => {

    // })

    citySelect.click(() => {
        getCities();
    });

    citySelect.change((e) => {
        const cityCode = e.target.value;
        console.log(cityCode);
        districtSelect.html('<option value="">Chọn quận/huyện</option>');

        if (cityCode) {
            getDistricts(cityCode);
        } else {
            districtSelect.prop('disabled', true);
        }
    });

    btnReset.click(checkFlag);

    // btnDelete.click(function () {
    //     checkFlag()
    // })

    btnAdd.click(function () {
        checkFlag(1);
        if ($('.admin-storeDistricts').length) {
            form.attr(
                'action',
                '/admin/quan-ly-khu-vuc/quan-huyen/add-district',
            );
        } else if ($('.admin-storeCities').length) {
            form.attr('action', '/admin/quan-ly-khu-vuc/thanh-pho/add-city');
        } else if ($('.admin-storeWards').length) {
            form.attr('action', '/admin/quan-ly-khu-vuc/phuong-xa/add-ward');
        } else {
            form.attr('action', '/admin/quan-ly-danh-muc/add');
        }
    });

    btnEdit.click(function () {
        checkFlag(2);
        if ($('.admin-storeCities').length) {
            form.attr('action', '/admin/quan-ly-khu-vuc/thanh-pho/update');
        } else if ($('.admin-storeDistricts ').length) {
            form.attr('action', '/admin/quan-ly-khu-vuc/quan-huyen/update');
        } else if ($('.admin-storeWards ').length) {
            form.attr('action', '/admin/quan-ly-khu-vuc/phuong-xa/update');
        }
    });

    $('table').on('click', '.btn-delete', function (e) {
        e.preventDefault();
        if ($('.admin-storeCities').length) {
            setFormDelete(
                $(this),
                '/admin/quan-ly-khu-vuc/thanh-pho/',
                'thành phố ',
            );
        } else if ($('.admin-storeDistricts ').length) {
            setFormDelete(
                $(this),
                '/admin/quan-ly-khu-vuc/quan-huyen/',
                'quận huyện ',
            );
        } else if ($('.admin-storeWards ').length) {
            setFormDelete(
                $(this),
                '/admin/quan-ly-khu-vuc/phuong-xa/',
                'phường xã ',
            );
        } else {
            setFormDelete($(this), '/admin/quan-ly-danh-muc/', 'danh mục');
        }
    });

    $('table ').on('click', '.btn-edit', function (e) {
        e.preventDefault();
        const url = $(this).attr('href');
        fetch(url, {
            method: 'post',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message == 'success') {
                    checkFlag(2);

                    if ($('.admin-storeCities').length) {
                        form.attr(
                            'action',
                            '/admin/quan-ly-khu-vuc/thanh-pho/update',
                        );
                        $('.form input[name=idCity]').val(data.data.ma_so);
                        $('.form input[name=nameCity]').val(
                            data.data.ten_thanh_pho,
                        );
                        $('.form input[name=idCity]').prop('readonly', true);
                    } else if ($('.admin-storeDistricts ').length) {
                        form.attr(
                            'action',
                            '/admin/quan-ly-khu-vuc/quan-huyen/update',
                        );
                        $('.form input[name=idDistrict]').val(data.data.ma_so);
                        $('.form select[name=city]').val(
                            data.data.ma_so_thanh_pho,
                        );
                        $('.form input[name=nameDistrict]').val(
                            data.data.ten_quan_huyen,
                        );
                    } else if ($('.admin-storeWards ').length) {
                        form.attr(
                            'action',
                            '/admin/quan-ly-khu-vuc/phuong-xa/update',
                        );
                        getDistricts(data.data.ma_so_thanh_pho);
                        $('.form input[name=idWard]').val(data.data.ma_so);
                        $('.form select[name=city]').val(
                            data.data.ma_so_thanh_pho,
                        );
                        setTimeout(() => {
                            $('.form select[name=district]').val(
                                data.data.ma_quan_huyen,
                            );
                        }, 100);
                        $('.form input[name=nameWard]').val(
                            data.data.ten_phuong_xa,
                        );
                        toast({
                            title: 'Success',
                            message: data.message,
                            type: 'success',
                            duration: 3000,
                        });
                    } else {
                        form.attr('action', '/admin/quan-ly-danh-muc/update');
                        $('.form input[name=id]').val(data.data.ma_so);
                        $('.form input[name=name]').val(
                            data.data.ten_chuyen_muc,
                        );
                        $('.form input[name=describe]').val(data.data.mo_ta);
                    }
                }
            })
            .catch((error) => {
                toast({
                    title: 'Error',
                    message: error,
                    type: 'error',
                    duration: 3000,
                });
            });
    });

    btnSave.on('click', function (e) {
        e.preventDefault();
        const url = form.attr('action');
        const formData = new FormData(form[0]);
        if (flagSave == 2) {
            saveData(url, '_method=PUT', 'PUT', formData);
        } else {
            saveData(url, '', 'POST', formData);
        }
    });

    $('#id01').on('click', '.deletebtn', function (e) {
        e.preventDefault();
        const url = $('#id01 form').attr('action');
        deleteData(url);
    });

    let currentPage = parseInt($('.pagination').data('currentpage'));
    let totalPage = parseInt($('.pagination').data('totalpage'));
    $('.pagination').html(paginationFunction(totalPage, currentPage));

    $('.pagination').on('click', 'li.btn', function (event) {
        event.preventDefault();
        const pageNumber = parseInt($(this).find('a').attr('page-number'));
        getPage(window.location.href, pageNumber, totalPage);
    });

    $('.modal-container').on('click', '.btn-close', function () {
        $('.modal-container').empty();
        $('.modal-container').removeClass('open');
    });

    $('.modal-container').on('click', '.cancelbtn', function () {
        $('.modal-container').empty();
        $('.modal-container').removeClass('open');
    });

    $('.admin-storeNews ').on('click', '.btn-preview', function (event) {
        event.preventDefault();
        modalPreviewNews($(this).attr('href'));
    });

    $('.admin-storeUsers ').on('click', '.btn-preview', function (event) {
        event.preventDefault();
        modalPreviewNews($(this).attr('href'));
    });

    $('.modal-container').on('click', '.carousel-image', function () {
        var src = $(this).attr('src');
        $('#main-image').attr('src', src);
    });

    $('.modal-container').on('mouseenter', '.carousel-image', function () {
        var src = $(this).attr('src');
        $('#main-image').attr('src', src);
    });

    $('#id01').on('click', '.cancelbtn', function (event) {
        $('#id01').removeClass('open');
    });

    $('.admin-storeNews').on('click', '.btn-delete', function (e) {
        e.preventDefault();
        setFormDelete($(this), '/admin/quan-ly-tin/', 'tin tức');
    });

    $('.admin-storeUsers').on('click', '.btn-delete', function (e) {
        e.preventDefault();
        setFormDelete($(this), '/admin/quan-ly-nguoi_dung/', 'người dùng ');
    });
});

function getCities() {
    fetch('/dang-tin/api/cities')
        .then((response) => response.json())
        .then((data) => {
            data.forEach((city) => {
                const optionSelect = document.createElement('option');
                optionSelect.value = city.ma_so;
                optionSelect.textContent = city.ten_thanh_pho;
                $('#city').append(optionSelect);
            });
            $('#city').val($('#city').attr('value'));
        });
}
function getDistricts(city) {
    fetch(`/dang-tin/api/districts?ma_so_thanh_pho=${city}`)
        .then((response) => response.json())
        .then((data) => {
            data.forEach((district) => {
                const optionSelect = document.createElement('option');
                optionSelect.value = district.ma_so;
                optionSelect.textContent = district.ten_quan_huyen;
                districtSelect.append(optionSelect);
            });
            $('#district').val($('#district').attr('value'));
            districtSelect.prop('disabled', false);
        });
}

function deleteData(url) {
    fetch(url, {
        method: 'delete',
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message == 'success' || data.statusReq == 200) {
                toast({
                    title: 'Success',
                    message: data.message,
                    type: 'success',
                    duration: 3000,
                });
                $('#id01').removeClass('open');
                handleSuccess();
            }
        })
        .catch(handleError);
}

function handleSuccess() {
    if (form.length > 0) {
        checkFlag();
        form[0].reset();
    }
    reloadTable();
}

function saveData(url, query, method, data) {
    fetch(`${url}?${query}`, {
        method: method,
        body: data,
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.message == 'success' || data.statusReq == 200) {
                toast({
                    title: 'Success',
                    message: data.message,
                    type: 'success',
                    duration: 3000,
                });
                handleSuccess();
            }
        })
        .catch(handleError);
}

function reloadTable() {
    fetch(window.location.href)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then((html) => {
            const content = $(html).find('table');
            $('table').html(content.html());
        })
        .catch(handleError);
}

function handleError(error) {
    toast({
        title: 'Error',
        message: error,
        type: 'error',
        duration: 3000,
    });
}

function modalPreviewNews(url) {
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then((html) => {
            $('.modal-container').empty();
            $('.modal-container').html(html);
            $('.modal-container').addClass('open');
            owl();
            getMap();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
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
function paginationFunction(totalPage, pageNumber) {
    let beforePage = Math.max(pageNumber - 1, 1),
        afterPage = Math.min(pageNumber + 1, totalPage);
    let listTag = '';

    if (pageNumber > 1) {
        listTag += `<li class="prev btn" onclick="paginationFunction(${totalPage}, ${pageNumber - 1})">
        <a page-number="${pageNumber - 1}"><span>&laquo;</span></a></li>`;
    }

    if (pageNumber > 2) {
        listTag += `<li class="btn" onclick="paginationFunction(${totalPage}, 1)">
         <a page-number="1"><span>1</span></a></li>`;
        if (pageNumber > 3) {
            listTag += `<li class="dots"><span>...</span></li>`;
        }
    }

    if (totalPage >= 4) {
        if (pageNumber == totalPage) {
            beforePage = Math.max(totalPage - 3, 1);
        } else if (pageNumber == totalPage - 1) {
            beforePage = Math.max(totalPage - 4, 1);
        }
        if (pageNumber == 1) {
            afterPage = Math.min(4, totalPage);
        } else if (pageNumber == 2) {
            afterPage = Math.min(5, totalPage);
        }
    }

    for (let index = beforePage; index <= afterPage; index++) {
        if (totalPage < index || index < 1) {
            continue;
        }

        let active = pageNumber === index ? 'active' : '';
        listTag += `<li class="btn" onclick="paginationFunction(${totalPage}, ${index})"> <a  class=" ${active}" page-number="${index}"><span>${index}</span></a></li>`;
    }

    if (pageNumber < totalPage - 1) {
        if (pageNumber < totalPage - 2) {
            listTag += `<li class="dots"><span>...</span></li>`;
        }
        listTag += `<li class="btn" onclick="paginationFunction(${totalPage}, ${totalPage})"> <a page-number="${totalPage}"><span>${totalPage}</span></a></li>`;
    }

    if (pageNumber < totalPage) {
        listTag += `<li class="next btn" onclick="paginationFunction(${totalPage}, ${pageNumber + 1})">
        <a page-number="${pageNumber + 1}"><span>&raquo;</span></a></li>`;
    }

    return listTag;
}
function setFormDelete(parent, url, text) {
    $('#id01').addClass('open');
    const id = parent.attr('href');
    const name = parent.data('name');
    $('.modal-content').attr('action', `${url}${id}/delete?_method=DELETE`);

    $('.modal-content  p').text(
        `Bạn có chắc chắn muốn xóa ${text} ${name} không ?`,
    );
}

function owl() {
    $('.owl-carousel').owlCarousel({
        items: 6, // Number of items to display
        loop: true,
        // nav: true,
        margin: 6,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        onTranslated: function (event) {
            // Get the index of the current item
            var currentIndex =
                event.item.index - event.relatedTarget._clones.length / 2 - 1;
            if (currentIndex >= event.item.count) {
                currentIndex = currentIndex % event.item.count;
            }
            var currentSrc = $('.owl-item')
                .eq(currentIndex)
                .find('img')
                .attr('src');
            $('#main-image').attr('src', currentSrc);
        },
    });
}

function getMap() {
    var platform = new H.service.Platform({
        apikey: 'ptik-LaTS1_6c551rX6s921sdWJFeJqGR6d7lO7LYlY',
    });

    var defaultLayers = platform.createDefaultLayers();

    var map = new H.Map(
        document.getElementById('mapContainer'),
        defaultLayers.vector.normal.map,
        {
            center: { lat: 10.762622, lng: 106.660172 },
            zoom: 12,
            pixelRatio: window.devicePixelRatio || 1,
        },
    );
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    var query = $('.map').data('map');
    function moveToLocation(lat, lng) {
        map.setCenter({ lat: lat, lng: lng });
    }
    fetch(`/api/map/location?q=${encodeURIComponent(query)}`)
        .then((response) => response.json())
        .then((places) => {
            console.log('Found places:', places);
            // Hiển thị các địa điểm trên bản đồ
            places.forEach((place) => {
                map.removeObjects(map.getObjects());

                var marker = new H.map.Marker({
                    lat: place.position.lat,
                    lng: place.position.lng,
                });

                marker.addEventListener('tap', function () {
                    var hereWeGoUrl = `https://wego.here.com/directions/mix//${place.title}/?map=${place.position.lat},${place.position.lng},15,normal`;
                    window.open(hereWeGoUrl, '_blank');
                });

                map.addObject(marker);

                moveToLocation(place.position.lat, place.position.lng);
            });
        })
        .catch((error) => console.error('Error:', error));
}

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
