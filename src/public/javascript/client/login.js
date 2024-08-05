function initValidateLogin() {
    Validator({
        form: '.form-login',
        errorSelector: '.form-message',
        rules: [
            Validator.isRequired('#username', 'Vui lòng nhập tài khoản'),
            Validator.isRequired('#password', 'Vui lòng nhập mật khẩu'),
        ],
        onSubmit: () => {
            const formData = {
                username: $('.form-login input[name="username"]').val(),
                password: $('.form-login input[name="password"]').val(),
            };

            fetch('/user-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    if (data.statusReq === 400) {
                        $('#password')
                            .parent()
                            .find('.form-message')
                            .text(data.message);
                        toast({
                            title: 'Warning',
                            message: data.message,
                            type: 'warning',
                            duration: 3000,
                        });
                    } else {
                        // localStorage.setItem('user', JSON.stringify(data.data));
                        // $('.modal-container').empty();
                        // $('.modal-container').removeClass('open');
                        toast({
                            title: 'Success',
                            message: data.message,
                            type: 'success',
                            duration: 3000,
                        });
                        window.location.reload();

                        // userLogin();
                    }
                })
                .catch((error) =>
                    toast({
                        title: 'Error',
                        message: error,
                        type: 'error',
                        duration: 3000,
                    }),
                );
        },
    });
}
function initValidateRegis() {
    Validator({
        form: '.form-register',
        errorSelector: '.form-message',
        rules: [
            Validator.isRequired('#fullname', 'Vui lòng nhập họ tên'),
            Validator.isRequired('#username', 'Vui lòng nhập số điện thoại'),
            Validator.isPhoneNumber('#username', 'Vui lòng nhập số điện thoại'),
            Validator.isRequired('#password', 'Vui lòng nhập mật khẩu'),
            Validator.minLength(
                '#password',
                8,
                'Vui lòng nhập tối thiểu 8 ký tự',
            ),
            Validator.isRequired(
                '#confirm-password',
                'Vui lòng nhập lại mật khẩu',
            ),
            Validator.isConfirm(
                '#confirm-password',
                () => document.querySelector('.form-register #password').value,
                'Xác nhận mật khẩu không chính xác',
            ),
        ],
        onSubmit: () => {
            const formData = {
                fullname: $('.form-register input[name="fullname"]').val(),
                username: $('.form-register input[name="username"]').val(),
                password: $('.form-register input[name="password"]').val(),
            };

            fetch('/user-regis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.statusReq === 400) {
                        $('.form-register input[name="username"]')
                            .parent()
                            .find('.form-message')
                            .text(data.message);
                        toast({
                            title: 'Warning',
                            message: data.message,
                            type: 'warning',
                            duration: 3000,
                        });
                    } else {
                        modalLogin();
                        toast({
                            title: 'Success',
                            message: data.message,
                            type: 'success',
                            duration: 3000,
                        });
                    }
                })
                .catch((error) =>
                    toast({
                        title: 'Error',
                        message: error,
                        type: 'error',
                        duration: 3000,
                    }),
                );
        },
    });
}

$(document).ready(function () {
    userLogin();
    initValidateLogin();
    initValidateRegis();
    const isLogin = JSON.parse(localStorage.getItem('isLogin'));

    $('.modal-container').on('click', '.btn-close', function () {
        $('.modal-container').empty();
        $('.modal-container').removeClass('open');
    });

    $('.modal-container').on('click', '.btn-login', function () {
        modalLogin();
    });

    $('.modal-container').on('click', '.btn-register', function () {
        modalRegis();
    });
    $('.modal-container').on('click', '.login-order', function (e) {
        localStorage.setItem('isLogin', JSON.stringify(true));
    });

    $('.btn-login').click(function () {
        modalLogin();
    });

    $('.btn-posted').click(function (e) {
        e.preventDefault();
        const user = localStorage.getItem('user');

        if (!user) {
            modalLogin();
        } else {
            window.location.href = '/dang-tin';
        }
    });

    $('.btn-register').click(function () {
        modalRegis();
    });

    // if (isLogin) {
    //     fetch('/profile')
    //         .then((response) => response.json())
    //         .then((data) => {
    //             if (data.statusReq === 201) {
    //                 localStorage.setItem('user', JSON.stringify(data.data));
    //                 userLogin();
    //                 toast({
    //                     title: 'Success',
    //                     message: data.message,
    //                     type: 'success',
    //                     duration: 3000,
    //                 });
    //             } else {
    //                 toast({
    //                     title: 'Warning',
    //                     message: data.message,
    //                     type: 'warning',
    //                     duration: 3000,
    //                 });
    //             }
    //             localStorage.setItem('isLogin', JSON.stringify(data.isLogin));
    //         })
    //         .catch((error) =>
    //             toast({
    //                 title: 'Error',
    //                 message: error,
    //                 type: 'error',
    //                 duration: 3000,
    //             }),
    //         );
    // }

    $('.btn-logout').click((e) => {
        // e.preventDefault()
        localStorage.removeItem('user');
        fetch('/logout');
    });

    Validator({
        form: '.form-info',
        errorSelector: '.form-message',
        rules: [Validator.isRequired('#fullname', 'Vui lòng nhập tài khoản')],
        onSubmit: () => {
            const form = document.querySelector('.form-info');
            const formData = new FormData(form);

            fetch('/quan-ly/update-user', {
                method: 'PUT',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    // if (data) {
                    //     localStorage.setItem('user', JSON.stringify(data.data));
                    // }
                    toast({
                        title: 'Success',
                        message: data.message,
                        type: 'success',
                        duration: 3000,
                    });
                })
                .catch((error) =>
                    toast({
                        title: 'Error',
                        message: data.message,
                        type: 'error',
                        duration: 3000,
                    }),
                );
        },
    });
});

function modalLogin() {
    fetch('/modal-login')
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
            $('.modal').addClass('open');
            initValidateLogin();
        })
        .catch((error) => {
            toast({
                title: 'Error',
                message: error,
                type: 'error',
                duration: 3000,
            });
        });
}

function modalRegis() {
    fetch('/modal-regis')
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
            $('.modal').addClass('open');
            initValidateRegis();
        })
        .catch((error) => {
            toast({
                title: 'Error',
                message: error,
                type: 'error',
                duration: 3000,
            });
        });
}

function userLogin() {
    fetch('/save-info-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.statusReq === 201) {
                $('.box-login').removeClass('open');
                $('.box-user').addClass('open');
                $('.user-info a').html(data.data.ten_nguoi_dung);
                if (data.data.anh_dai_dien != null) {
                    $('.user-avatar img').attr('src', data.data.anh_dai_dien);
                }
                localStorage.setItem('user', JSON.stringify(data.data));
                // console.log(data.data);
            }
        })
        .catch((error) => {
            $('.box-login').addClass('open');
            $('.box-user').removeClass('open');
        });
    // const user = localStorage.getItem('user');

    // if (user) {
    //     const data = JSON.parse(user);
    //     const ma_so = data.ma_so;
    //     const formData = {
    //         ma_so,
    //     };

    //     fetch('/set-ma-so', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(formData),
    //     });

    //     $('.box-login').removeClass('open');
    //     $('.box-user').addClass('open');
    //     $('.user-info a').html(data.ten_nguoi_dung);
    //     if (data.anh_dai_dien != null) {
    //         $('.user-avatar img').attr('src', data.anh_dai_dien);
    //     }
    // } else {
    //     $('.box-login').addClass('open');
    //     $('.box-user').removeClass('open');
    // }
}
