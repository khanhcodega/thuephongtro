const connection = require('../../config/db/index')

class UserController {
    index(req, res, next) {
        const ma_so = req.session.ma_so;
        console.log(ma_so)
        connection.query(
            'SELECT * FROM nguoi_dung nd WHERE `ma_so` = ?',
            [ma_so],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                }
                const data = results[0];
                // console.log(data);
                res.render('user', { data });
            }
        );
    }

    update(req, res, next) {
        const ma_so = req.session.ma_so;
        const { fullname, email, phonenumber, gender, birthday, address, old_avatar } = req.body
        const avatar = req.file ? 'uploads/' + req.file.filename : req.body.avatar

        console.log(req.body);
        console.log(req.file);

        const query = 'UPDATE nguoi_dung SET `ten_nguoi_dung` = ?, `email` = ?, `so_dien_thoai` = ?, `dia_chi` = ?, `gioi_tinh` = ?, `ngay_cap_nhat` = CURRENT_TIMESTAMP, `anh_dai_dien` = ?, `nam_sinh` = ? WHERE `ma_so` = ?'
        const values = [fullname, email, phonenumber ? phonenumber : null, address, gender, avatar ? avatar : old_avatar, birthday, ma_so]
        console.log(values)
        connection.query(query, values, (err, results) => {
            if (err) {
                return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
            }

            // res.status(201).json({ statusReq: 201, successMessage: 'Cập nhật tài khoản thành công' });
            connection.query(
                'SELECT * FROM nguoi_dung nd WHERE `ma_so` = ?',
                [ma_so],
                (err, results) => {
                    if (err) {
                        return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                    }
                    res.send(JSON.stringify(results[0]));
                }
            );
        }
        );
    }

    setMaSo(req, res, next) {
        const { ma_so } = req.body;
        req.session.ma_so = ma_so;
        res.redirect('/quan-ly');
    }
}

module.exports = new UserController();