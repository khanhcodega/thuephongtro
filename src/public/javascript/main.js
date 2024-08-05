$(document).ready(function () {
    const boxInfo = $('.box-info');
    const boxUser = $('.box-user');
    const userDropdown = $('.user-dropdown');
    let isBoxInfoHover = false;
    let isUserDropdownHover = false;

    if ($('#status')) {
        $('#status').val($('#status').data('status'));
    }
    $('#status').on('change', function () {
        const selectedStatus = this.value;
        window.location.href = `/quan-ly/quan-ly-tin?status=${selectedStatus}`;
    });

    $('.form-info #gender').val($('.form-info #gender').attr('value'));
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.form-info label[for="avatar"] img').attr(
                    'src',
                    e.target.result,
                );
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    $('#avatar').change(function () {
        readURL(this);
    });

    boxInfo.mouseenter(() => {
        isBoxInfoHover = true;
        userDropdown.addClass('active');
    });
    userDropdown.mouseenter(() => {
        isUserDropdownHover = true;
        userDropdown.addClass('active');
    });
    userDropdown.mouseleave(() => {
        isUserDropdownHover = false;
        removeActive();
    });
    boxInfo.mouseleave(() => {
        isBoxInfoHover = false;
        removeActive();
    });

    function removeActive() {
        if (!isBoxInfoHover && !isUserDropdownHover) {
            userDropdown.removeClass('active');
        }
    }

    $('#id01').on('click', '.deletebtn', function (event) {
        event.preventDefault();
        const url = $('.modal-content').attr('action');
        fetch(url, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((data) => {
                $('#id01').removeClass('open');
                toast({
                    title: 'Success',
                    message: data.message,
                    type: 'success',
                    duration: 3000,
                });
                const url = window.location.href;
                fetch(url)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text();
                    })
                    .then((html) => {
                        const $html = $(html);

                        const $data = $html.find('.user .data');

                        if ($data.length > 0) {
                            $('.user .data').html($data.html());
                            let currentPage = parseInt(
                                $('.pagination').data('currentpage'),
                            );
                            let totalPage = parseInt(
                                $('.pagination').data('totalpage'),
                            );
                            $('.pagination').html(
                                paginationFunction(totalPage, currentPage),
                            );
                        }
                    });
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

    $('#id01').on('click', '.cancelbtn', function (event) {
        $('#id01').removeClass('open');
    });
    $('.box-content').on('click', '.btn-delete', function (e) {
        e.preventDefault();
        $('#id01').addClass('open');
        const id = $(this).attr('href');
        const name = $(this).data('name');

        $('.modal-content').attr(
            'action',
            `/quan-ly/quan-ly-tin/${id}/delete?_method=DELETE`,
        );
        $('.modal-content  p').text(
            `Bạn có chắc chắn muốn xóa tin ${name} không ?`,
        );
    });
});
