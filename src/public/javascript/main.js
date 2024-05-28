$(document).ready(function (index) {
    const modal = $('.modal')
    const modalLogin = $('.modal-login')
    const modalRegister = $('.modal-register')
    const modalContrainer = $('.form')
    const modalClose = $('.btn-close')
    const btnLogin = $('.btn-login')
    const btnRegister = $('.btn-register')
    const boxInfo = $('.box-info')
    const boxUser = $('.box-user')
    const userDropdown = $('.user-dropdown')
    let isBoxInfoHover = false;
    let isUserDropdownHover = false;
    $('.form-info #gender').val($('.form-info #gender').attr('value'))
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
    
            reader.onload = function (e) {
                $('.form-info label[for="avatar"] img').attr('src', e.target.result);
            }
    
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    $("#avatar").change(function(){
        readURL(this);
    });

    //update
    Validator({
        form: '.form-info',
        errorSelector: '.form-message',
        rules: [
            Validator.isRequired('#fullname', 'Vui lòng nhập tài khoản'),
            // Validator.isRequired('#password', 'Vui lòng nhập mật khẩu'),
        ],
        onSubmit: () => {
            // const avatar = $('.form-info input[name="avatar"]').val()
            // const fullname = $('.form-info input[name="fullname"]').val()
            // const email = $('.form-info input[name="email"]').val()
            // const phonenumber = parseInt($('.form-info input[name="phonenumber"]').val())
            // const gender = $('.form-info #gender').val()
            // const birthday = $('.form-info input[name="birthday"]').val()
            // const address = $('.form-info input[name="address"]').val()

            // if (avatar == '') {
            //     avatar = $('.form-info label[for=avatar] img').attr('src')
            // }
            // const formData = {
            //     avatar,
            //     fullname,
            //     email,
            //     phonenumber,
            //     gender,
            //     birthday,
            //     address,

            // };

            const form = document.querySelector('.form-info');
            const formData = new FormData(form);

            fetch('quan-ly/update-user',
                {
                    method: 'PUT',
                    body: formData
                }
            )
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        localStorage.setItem('user', JSON.stringify(data));
                        modal.removeClass('open')

                        userLogin()
                    }
                    console.log(data)
                })
                .catch(error => console.error('Error loading modal:', error));

        }
    })

    $('.user-info a').click((e) => {
        e.preventDefault()
        const { ma_so } = JSON.parse(localStorage.getItem('user'));

        const formData = {
            ma_so
        };
        fetch('quan-ly/set-ma-so', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                }
            })
            .catch(error => console.error('Error:', error));

    })

    $('.login-order').click(() => {
        localStorage.setItem('isLogin', true)

    })

    // console.log(isLogin)
    userLogin()

    boxInfo.mouseenter(() => {
        isBoxInfoHover = true
        userDropdown.addClass('active')
    })
    userDropdown.mouseenter(() => {
        isUserDropdownHover = true
        userDropdown.addClass('active')
    })
    userDropdown.mouseleave(() => {
        isUserDropdownHover = false
        removeActive()

    })
    boxInfo.mouseleave(() => {
        isBoxInfoHover = false
        removeActive()
    })

    function removeActive() {
        if (!isBoxInfoHover && !isUserDropdownHover) {
            userDropdown.removeClass('active')
        }
    }

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
    if (localStorage.getItem('isLogin') && !localStorage.getItem('user')) {

        fetch('/profile',)
            .then(response => response.json())
            .then(data => {
                console.log(data)

                localStorage.setItem('user', JSON.stringify(data));
                // if (data && data.length > 0) {
                //     modal.removeClass('open')

                userLogin()

            })
            .catch(error => console.error('Error loading modal:', error));
    }

    modalContrainer.click((event) => {
        event.stopPropagation()
    })
    // đăng nhập
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
                    if (data) {
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
    //đăng ký
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

            // console.log(formData)

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

    $('.btn-logout').click((e) => {
        e.preventDefault()
        localStorage.removeItem('user')
        localStorage.removeItem('isLogin')

        userLogin()
    })



    function userLogin() {
        const user = JSON.parse(localStorage.getItem('user'))
        // console.log(user)
        if (user != null) {

            $('.box-login').removeClass('open')
            $('.box-user').addClass('open')
            $('.user-info a').html(user.ten_nguoi_dung)
            if (user.anh_dai_dien != null) {
                $('.user-avatar img').attr('src', user.anh_dai_dien)
            }
        } else {
            $('.box-login').addClass('open')
            $('.box-user').removeClass('open')
        }
    }


})


