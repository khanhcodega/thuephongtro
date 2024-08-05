const connection = require('../../config/db/index');
const containsBadWords = require('../../util/checkBadWords');

class UserController {
    index(req, res, next) {
        const ma_so = req.cookies.user;
        connection.query(
            'SELECT * FROM nguoi_dung nd WHERE `ma_so` = ?',
            [ma_so],
            (err, results) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ message: 'Server error', statusReq: 500 });
                }
                const data = results[0];
                res.render('user', { data });
            },
        );
    }

    storeNews(req, res, next) {
        const ma_so = req.cookies.user;
        const trang_thai = req.query.status;
        const page = req.query.page || 1;

        const limit = 10;
        const offset = (page - 1) * limit;

        let sqlCount = `SELECT COUNT(*) as total FROM tin_tuc  WHERE ma_so_nguoi_dung = ?`;

        let queryCountParams = [ma_so];

        let sql =
            'SELECT * FROM tin_tuc WHERE `ma_so_nguoi_dung` = ? AND `ngay_xoa` IS NULL';
        const queryParams = [ma_so];

        if (trang_thai) {
            sql += ' AND `trang_thai` = ? ';
            queryParams.push(trang_thai);
        }

        sql += ` LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);

        connection.query(sqlCount, queryCountParams, (err, countResults) => {
            if (err) {
                return res
                    .status(500)
                    .json({ errMessage: 'Server error', statusReq: 500 });
            }
            const totalRecords = countResults[0].total;
            const totalPages = Math.ceil(totalRecords / limit);
            connection.query(sql, queryParams, (err, results) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ message: 'Server error', statusReq: 500 });
                }
                const data = results.map((item) => {
                    const images = JSON.parse(item.danh_sach_anh);
                    const firstImage = images.length > 0 ? images[0] : null;
                    const formattedPrice = item.gia_tien
                        ? item.gia_tien.toLocaleString('vi-VN')
                        : null;

                    return {
                        ...item,
                        firstImage,
                        formattedPrice,
                    };
                });

                res.render('userStoreNews', {
                    data,
                    trang_thai,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        totalRecords,
                        limit,
                    },
                });
            });
        });
    }

    historyNews(req, res, next) {
        const page = req.query.page || 1;

        const ma_so = req.cookies.user;
        console.log(ma_so);
        const limit = 10;
        const offset = (page - 1) * limit;

        let sqlCount = `SELECT COUNT(*) as total FROM lich_su_xem_tin lst WHERE lst.ma_so_nguoi_dung = ?`;

        let queryCountParams = [ma_so];

        let sql = `SELECT lst.*, tt.danh_sach_anh ,tt.tieu_de,tt.dien_tich,tt.gia_tien,tt.noi_dung_them,DATE_FORMAT(tt.ngay_them , '%d/%m/%Y') AS ngay_tao, nd.ten_nguoi_dung, qh.ten_quan_huyen  FROM lich_su_xem_tin lst JOIN tin_tuc tt  ON lst.ma_so_tin_tuc = tt.ma_so JOIN nguoi_dung nd ON tt.ma_so_nguoi_dung = nd.ma_so JOIN quan_huyen qh  ON tt.ma_quan_huyen = qh.ma_so  WHERE lst.ma_so_nguoi_dung = ? LIMIT ?,?`;

        let queryParams = [ma_so, offset, limit];

        connection.query(sqlCount, queryCountParams, (err, countResults) => {
            if (err) {
                return res
                    .status(500)
                    .json({ errMessage: 'Server error', statusReq: 500 });
            }
            const totalRecords = countResults[0].total;
            const totalPages = Math.ceil(totalRecords / limit);

            connection.query(sql, queryParams, (err, results) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ message: 'Server error', statusReq: 500 });
                }

                const data = results.map((item) => {
                    const images = JSON.parse(item.danh_sach_anh);
                    const formattedPrice = item.gia_tien / 1000000;
                    const noiDungThem = JSON.parse(item.noi_dung_them);
                    const { interior, floor, bedroom, toilet, deposit } =
                        noiDungThem;
                    return {
                        ...item,
                        images,
                        formattedPrice,
                        interior,
                        floor,
                        bedroom,
                        toilet,
                        deposit,
                    };
                });

                res.render('historyNews', {
                    data,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        totalRecords,
                        limit,
                    },
                });
            });
        });
    }

    saveNews(req, res, next) {
        const page = req.query.page || 1;

        const ma_so = req.cookies.user;
        const limit = 10;
        const offset = (page - 1) * limit;

        let sqlCount = `SELECT COUNT(*) as total FROM yeu_thich yt WHERE yt.ma_so_nguoi_dung = ?`;

        let queryCountParams = [ma_so];

        let sql = `SELECT yt.*, tt.danh_sach_anh ,tt.tieu_de,tt.dien_tich,tt.gia_tien,tt.noi_dung_them,DATE_FORMAT(tt.ngay_them , '%d/%m/%Y') AS ngay_tao, nd.ten_nguoi_dung, qh.ten_quan_huyen,CASE WHEN yt.ma_so_nguoi_dung IS NOT NULL THEN 1 ELSE 0 END AS da_like  FROM yeu_thich yt JOIN tin_tuc tt  ON yt.ma_so_tin_tuc = tt.ma_so JOIN nguoi_dung nd ON tt.ma_so_nguoi_dung = nd.ma_so JOIN quan_huyen qh  ON tt.ma_quan_huyen = qh.ma_so  WHERE yt.ma_so_nguoi_dung = ? LIMIT ?,?`;

        let queryParams = [ma_so, offset, limit];

        connection.query(sqlCount, queryCountParams, (err, countResults) => {
            if (err) {
                return res
                    .status(500)
                    .json({ errMessage: 'Server error', statusReq: 500 });
            }
            const totalRecords = countResults[0].total;
            const totalPages = Math.ceil(totalRecords / limit);
            connection.query(sql, queryParams, (err, results) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ message: 'Server error', statusReq: 500 });
                }

                const data = results.map((item) => {
                    const images = JSON.parse(item.danh_sach_anh);
                    const formattedPrice = item.gia_tien / 1000000;
                    const noiDungThem = JSON.parse(item.noi_dung_them);
                    const { interior, floor, bedroom, toilet, deposit } =
                        noiDungThem;
                    return {
                        ...item,
                        images,
                        formattedPrice,
                        interior,
                        floor,
                        bedroom,
                        toilet,
                        deposit,
                    };
                });

                res.render('saveNews', {
                    data,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        totalRecords,
                        limit,
                    },
                });
            });
        });
    }
    getInfoNews(req, res, next) {
        const ma_so = req.params.id;
        console.log(ma_so);

        connection.query(
            'SELECT * FROM tin_tuc WHERE `ma_so` = ? ',
            [ma_so],
            (err, results) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ message: 'Server error', statusReq: 500 });
                }

                const data = results[0];
                const images = data.danh_sach_anh
                    ? JSON.parse(data.danh_sach_anh).reverse()
                    : [];
                const moreInfo = data.noi_dung_them
                    ? JSON.parse(data.noi_dung_them)
                    : {};
                // console.log(images, data)
                res.render('updateNews', { data, images, moreInfo });
            },
        );
    }

    updateNews(req, res, next) {
        const ma_so = req.params.id;
        const { titleNews, descNews, fulladdress } = req.body;
        let trang_thai = 'wait';
        if (
            containsBadWords(titleNews) ||
            containsBadWords(descNews) ||
            containsBadWords(fulladdress)
        ) {
            trang_thai = 'error';
        }
        connection.query(
            `UPDATE wsrh.tin_tuc SET  trang_thai= ? WHERE ma_so =?`,
            [trang_thai, ma_so],
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Server error',
                        statusReq: 500,
                    });
                }
                res.status(200).json({
                    statusReq: 200,
                    message: 'Cập nhật thành công.',
                });
            },
        );
    }

    deleteNews(req, res, next) {
        const ma_so = req.params.id;
        console.log(ma_so);
        connection.query(
            'UPDATE tin_tuc SET  `ngay_xoa` = CURRENT_TIMESTAMP WHERE `ma_so` = ?',
            [ma_so],
            (err, results) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ message: 'Server error', statusReq: 500 });
                }

                res.status(200).json({
                    message: 'Xóa tin thành công',
                    statusReq: 200,
                });
            },
        );
    }

    update(req, res, next) {
        const ma_so = req.cookies.user;
        const {
            fullname,
            email,
            phonenumber,
            gender,
            birthday,
            address,
            old_avatar,
        } = req.body;
        const avatar = req.file
            ? '/uploads/' + req.file.filename
            : req.body.avatar;

        console.log(req.body);
        console.log(req.file);

        const query =
            'UPDATE nguoi_dung SET `ten_nguoi_dung` = ?, `email` = ?, `so_dien_thoai` = ?, `dia_chi` = ?, `gioi_tinh` = ?, `ngay_cap_nhat` = CURRENT_TIMESTAMP, `anh_dai_dien` = ?, `nam_sinh` = ? WHERE `ma_so` = ?';
        const values = [
            fullname,
            email,
            phonenumber ? phonenumber : null,
            address,
            gender,
            avatar ? avatar : old_avatar,
            birthday,
            ma_so,
        ];
        console.log(values);
        connection.query(query, values, (err, results) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: 'Server error', statusReq: 500 });
            }

            connection.query(
                'SELECT * FROM nguoi_dung nd WHERE `ma_so` = ?',
                [ma_so],
                (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            message: 'Server error',
                            statusReq: 500,
                        });
                    }
                    const data = results[0];
                    res.status(201).json({
                        statusReq: 201,
                        message: 'Cập nhật tài khoản thành công',
                        data,
                    });
                },
            );
        });
    }
}

module.exports = new UserController();
