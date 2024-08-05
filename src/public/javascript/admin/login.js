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

        fetch('/admin/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.statusReq === 400) {
                    toast({
                        title: 'Error',
                        message: data.message,
                        type: 'error',
                        duration: 3000,
                    });
                    $('#password')
                        .parent()
                        .find('.form-message')
                        .text(data.message);
                } else if (data.statusReq === 200) {
                    toast({
                        title: 'Success',
                        message: data.message,
                        type: 'success',
                        duration: 3000,
                    });
                    window.location.href = '/admin/dashboard';
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
