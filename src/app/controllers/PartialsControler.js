const connection = require('../../config/db/index');
const fs = require('fs');
const path = require('path');
class PartialsController {
    index(req, res, next) {
        res.render('partials/modalLogin', { layout: false }, (err, html) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: 'Server error', statusReq: 500 });
            } else {
                res.send(html);
            }
        });
    }
    listBadWord(req, res) {
        const filePath = path.join(
            __dirname,
            '../../config/vn_offensive_words.txt',
        );
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ error: 'Error reading file' });
            }
            const words = data.split('\n');
            res.json({ content: words });
        });
    }

    showModalRegis(req, res, next) {
        res.render('partials/modalRegister', { layout: false }, (err, html) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: 'Server error', statusReq: 500 });
            } else {
                res.send(html);
            }
        });
    }

    login(req, res, next) {
        const { username, password } = req.body;
        connection.query(
            'select *  from nguoi_dung nd where  `ten_tai_khoan`  =? and `mat_khau` =?',
            [username, password],
            (err, results) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ message: 'Server error', statusReq: 500 });
                }
                if (results.length > 0) {
                    const data = results[0];

                    const timeSave = 15 * 24 * 60 * 60 * 1000;
                    res.cookie('user', data.ma_so, {
                        maxAge: timeSave,
                        httpOnly: true,
                    });
                    res.status(201).json({
                        statusReq: 201,
                        message: 'Đăng nhập thành công',
                        data,
                    });
                } else {
                    return res.status(400).json({
                        message: 'Tên tài khoản hoặc mật khẩu không đúng!',
                        statusReq: 400,
                    });
                }
            },
        );
    }

    saveInfo(req, res, next) {
        const ma_so = req.cookies.user;
        if (ma_so) {
            connection.query(
                'select *  from nguoi_dung nd where  ma_so = ?',
                [ma_so],
                (err, results) => {
                    if (err) {
                        return res
                            .status(500)
                            .json({ message: 'Server error', statusReq: 500 });
                    }

                    const data = results[0];
                    res.locals.user = data;
                    res.status(201).json({
                        statusReq: 201,
                        message: 'Đăng nhập thành công',
                        data,
                    });
                },
            );
        }
    }

    regis(req, res, next) {
        const { fullname, username, password } = req.body;
        console.log('req body >>', req.body);
        connection.query(
            'select *  from nguoi_dung nd where  `so_dien_thoai`=?',
            [username],
            (err, results) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ message: 'Server error', statusReq: 500 });
                }

                if (results.length > 0) {
                    return res.status(400).json({
                        statusReq: 400,
                        message: 'Tài khoản đã tồn tại',
                    });
                }

                connection.query(
                    `INSERT INTO nguoi_dung (ten_nguoi_dung, ten_tai_khoan, mat_khau, so_dien_thoai, phan_quyen,anh_dai_dien) VALUES (?, ?, ?, ?, 2,'/img/avatar.png')`,
                    [fullname, username, password, username],
                    (err, results) => {
                        if (err) {
                            return res.status(500).json({
                                message: 'Server error',
                                statusReq: 500,
                            });
                        }
                        res.status(201).json({
                            statusReq: 201,
                            message: 'Tạo tài khoản thành công',
                        });
                    },
                );
            },
        );
    }

    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: 'Failed to logout', success: false });
            }
            res.clearCookie('user');
            res.clearCookie('connect.sid');

            res.redirect('/');
        });
    }

    // profile(req, res) {
    //     if (req.isAuthenticated()) {
    //         res.json({
    //             statusReq: 201,
    //             data: req.user,
    //             isLogin: false,
    //             message: 'Đăng nhập thành công.',
    //         });
    //     } else {
    //         res.json({ isLogin: false, message: 'Đăng nhập thất bại!' });
    //     }
    // }
}

module.exports = new PartialsController();
