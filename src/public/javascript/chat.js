$(document).ready(function (index) {
    const socket = io();
    const messageContainer = document.querySelector('.chat-box');
    scrollToBottom();
    $('.item-chat').click(function () {
        $('.item-chat').removeClass('active');
        changeChat(this);
    });

    $('input[name="searchItemChat"]').on('input', function () {
        const searchItemChat = $(this).val();

        const queryString = `keyword=${searchItemChat}`;
        const url = `/chat?${queryString}`;

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then((html) => {
                const $html = $(html);

                const $itemChats = $html.find('.chat .list-chat');

                if ($itemChats.length > 0) {
                    $('.chat .list-chat').html($itemChats.html());
                }
            })
            .catch((error) => {});
    });

    if ($('.chat')) {
        const idChatNews = $('.chat .container').data('news');
        const idChatUser = $('.chat .container').data('user');
        $('.item-chat').each(function () {
            if (
                $(this).data('news') === idChatNews &&
                $(this).data('user') === idChatUser
            ) {
                $(this).addClass('active');
            }
        });
    }

    socket.on('connect', () => {});

    socket.on('newMessage', (data) => {
        const { message, idSender } = data;
        const currentUser = JSON.parse(localStorage.getItem('user')).ma_so;

        const messageClass = currentUser === idSender ? 'user-chat' : 'reply';
        $('.chat-box').append(
            `<div class="message ${messageClass}">${message}</div>`,
        );
    });

    $('.chat-message button').click(chat);
    $('.chat-message input[name="message"]').on('keypress', function (e) {
        const key = e.which;
        if (key == 13) {
            chat();
        }
    });

    function chat() {
        const idChatNews = $('.chat .container').data('news');
        const idChatUser = $('.chat .container').data('user');
        const message = $('.chat-message input[name="message"]').val();
        const formData = {
            message,
            idSender: JSON.parse(localStorage.getItem('user')).ma_so,
            idReceiver: idChatUser,
            idNews: idChatNews,
        };

        socket.emit('sendMessage', formData);

        $('.chat-message input[name="message"]').val('');
    }

    function changeChat(element) {
        const user = JSON.parse(localStorage.getItem('user'));
        const idSender = user ? user.ma_so : null;
        const idReceiver = $(element).data('user');
        const idNews = $(element).data('news');
        const windowWidth = $(window).width();

        $(element).addClass('active');
        if (idSender) {
            const queryString = `idSender=${idSender}&idReceiver=${idReceiver}&idNews=${idNews}`;
            const url = `/chat?${queryString}`;

            fetch(url)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then((html) => {
                    const $html = $(html);

                    const $headerChat = $html.find('.chat-main .col-100');
                    const $contentrChat = $html.find('.chat-main .chat-box');

                    if ($headerChat.length > 0) {
                        $('.chat-main .col-100').html($headerChat.html());
                        $('.chat-main .chat-box').html($contentrChat.html());

                        $('.chat .container').data('user', idReceiver);
                        $('.chat .container').data('news', idNews);
                        scrollToBottom();
                        if (windowWidth <= 860) {
                            $('.chat-list').css('display', 'none');
                            $('.chat-main').css('display', 'block');
                        }
                    } else {
                    }
                })
                .catch((error) => {});
        } else {
        }
    }

    $('.btn-repage').click(() => {
        $('.chat-list').css('display', 'block');
        $('.chat-main').css('display', 'none');
    });

    function scrollToBottom() {
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
    function checkWindowWidth() {
        const windowWidth = $(window).width();
        if (windowWidth <= 860) {
            $('.chat-main').css('display', 'none');
        } else {
            $('.chat-list').css('display', 'block');
            $('.chat-main').css('display', 'block');
        }
    }

    checkWindowWidth();
    $(window).resize(function () {
        checkWindowWidth();
    });
});
