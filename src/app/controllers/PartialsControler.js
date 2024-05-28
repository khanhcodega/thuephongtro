const connection = require('../../config/db/index')

class PartialsController {
    index(req, res, next) {
        res.render('partials/modal', { layout: false }, (err, html) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.send(html);
            }
        });
    }

    login(req, res, next) {
        const { username, password } = req.body
        console.log("req body >>", req.body)
        connection.query(
            'select *  from nguoi_dung nd where  `ten_tai_khoan`  =? and `mat_khau` =?',
            [username, password],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                }
                res.send(JSON.stringify(results[0]));
            }
        );
        // connection.end();
    }

    regis(req, res, next) {
        const { fullname, username, password } = req.body
        console.log("req body >>", req.body)
        connection.query(
            'select *  from nguoi_dung nd where  `so_dien_thoai`=?',
            [username],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                }

                // console.log(typeof results)
                // res.send(results);
                if (results.length > 0) {
                    return res.status(400).json({ statusReq: 400, errMessage: 'Tài khoản đã tồn tại' });
                }

                connection.query(
                    'INSERT INTO nguoi_dung (ten_nguoi_dung, ten_tai_khoan, mat_khau, so_dien_thoai, phan_quyen) VALUES (?, ?, ?, ?, 2)',
                    [fullname, username, password, username],
                    (err, results) => {
                        if (err) {
                            return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                        }
                        res.status(201).json({ statusReq: 201, successMessage: 'Tạo tài khoản thành công' });
                    }
                );

            }
        );
    }

    profile(req, res) {
        if (req.isAuthenticated()) {
            
            res.json(req.user); // Trả về thông tin người dùng dưới dạng JSON
        } else {
            res.redirect('/login');
        }
    };
    
}

module.exports = new PartialsController()