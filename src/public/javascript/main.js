$(document).ready(function (index) {
    const modal = $('.modal')
    const modalLogin = $('.modal-login')
    const modalRegister = $('.modal-register')
    const modalContrainer = $('.form')
    const modalClose = $('.btn-close')
    const btnLogin = $('.btn-login')
    const btnRegister = $('.btn-register')
    userLogin()
    btnLogin.click(() => {
        modal.removeClass('open')
        modalLogin.addClass('open')
        $('.form-group').removeClass('invalid')
        $('.form-message').text('')
    })

    btnRegister.click(() => {
        modal.removeClass('open')
        modalRegister.addClass('open')
        $('.form-group').removeClass('invalid')
        $('.form-message').text('')
    })

    modalClose.click(() => {
        modal.removeClass('open')
    })

    // modal.click((e) => {
    //     modal.removeClass('open')
    //     // $('.form-group').each(() => {
    //     //     $(this).removeClass('invalid')
    //     //     $(this).find('.form-message').text('')
    //     //     console.log($(this))
    //     // });
    //     $('.form-control').val('')
    //     $('.form-group').removeClass('invalid')
    //     $('.form-message').text('')
    // })

    modalContrainer.click((event) => {
        event.stopPropagation()
    })

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
                password: $('.form-login input[name="password"]').val()
            };

            fetch('/user-login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }
            )
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        localStorage.setItem('user', JSON.stringify(data));
                        modal.removeClass('open')

                        userLogin()
                    } else {
                        $('#password').parent().find('.form-message').text('Tài khoản hoặc mật khẩu của bạn không đúng.')
                    }
                })
                .catch(error => console.error('Error loading modal:', error));

        }
    })

    Validator({
        form: '.form-register',
        errorSelector: '.form-message',
        rules: [
            Validator.isRequired('#fullname', 'Vui lòng nhập họ tên'),
            Validator.isRequired('#username', 'Vui lòng nhập số điện thoại'),
            Validator.isPhoneNumber('#username', 'Vui lòng nhập số điện thoại'),
            Validator.isRequired('#password', 'Vui lòng nhập mật khẩu'),
            Validator.minLength('#password', 8, 'Vui lòng nhập tối thiểu 8 ký tự'),
            Validator.isRequired('#confirm-password', 'Vui lòng nhập lại mật khẩu'),
            Validator.isConfirm('#confirm-password', () => document.querySelector('.form-register #password').value, 'Xác nhận mật khẩu không chính xác'),
        ],
        onSubmit: () => {

            const formData = {
                fullname: $('.form-register input[name="fullname"]').val(),
                username: $('.form-register input[name="username"]').val(),
                password: $('.form-register input[name="password"]').val(),
            };

            console.log(formData)

            fetch('/user-regis',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }
            )
                .then(response => response.json())
                .then(data => {

                    if (data.errMessage && data.statusReq === 400) {
                        $('.form-register input[name="username"]').parent().find('.form-message').text(data.errMessage)
                    } else {
                        modal.removeClass('open')
                    }
                })
                .catch(error => console.error('Error loading modal:', error));


        }
    })





    function userLogin() {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user != null) {

            $('.box-login').removeClass('open')
            $('.box-user').addClass('open')
            $('.user-info a').html(user[0].ten_nguoi_dung)
        }
    }


})

