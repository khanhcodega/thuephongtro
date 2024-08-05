let badWords;
fetch('/api/read-file/list-bad-word')
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((data) => {
        badWords = data.content;
    })
    .catch((error) => {});

function Validator(options) {
    const selectorRules = {};
    function validate(inputElement, rule) {
        var errorMessage;
        const errorElement = inputElement.parentElement.querySelector(
            options.errorSelector,
        );

        const rules = selectorRules[rule.selector];
        for (var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);

            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            inputElement.parentElement.classList.remove('invalid');
            errorElement.innerText = '';
        }

        return !errorMessage;
    }

    const formElement = document.querySelector(options.form);
    if (formElement) {
        // Xử lý mỗi rule và xử lý sự kiện
        formElement.onsubmit = (e) => {
            e.preventDefault();
            var isFormValid = true;
            options.rules.forEach((rule) => {
                const inputElement = formElement.querySelector(rule.selector);
                const isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });
            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {
                    options.onSubmit();
                }
            }
        };

        options.rules.forEach((rule) => {
            //Lưu lại các rule input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            const inputElement = formElement.querySelector(rule.selector);

            if (inputElement) {
                inputElement.onblur = () => {
                    validate(inputElement, rule);
                };
                const errorElement = inputElement.parentElement.querySelector(
                    options.errorSelector,
                );
                inputElement.oninput = () => {
                    errorElement.innerText = '';
                };
            }
        });
    }
}

// Định nghĩa rules
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : message || 'Vui long nhap ten';
        },
    };
};

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Vui long email';
        },
    };
};

Validator.isPhoneNumber = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
            return regex.test(value)
                ? undefined
                : message || 'Vui long so dien thoai';
        },
    };
};

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min
                ? undefined
                : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
        },
    };
};

Validator.maxLength = function (selector, max, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length <= max
                ? undefined
                : message || `Vui lòng nhập tối đa ${max} kí tự`;
        },
    };
};

Validator.isConfirm = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue()
                ? undefined
                : message || 'Giá trị nhập vào không chính xác';
        },
    };
};

Validator.isBadWord = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            const words = value.trim().split(/\s+/);
            const hasBadWord = words.some((word) => badWords.includes(word));

            return hasBadWord
                ? message || 'Nội dung không được chứa từ xấu'
                : undefined;
        },
    };
};
