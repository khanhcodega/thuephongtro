const { query } = require('express');
const connection = require('../../config/db');
class AdminController {
    // login
    index(req, res, next) {
        res.render('admin/loginManager', { layout: false });
    }

    login(req, res, next) {
        const { username, password } = req.body;
        connection.query(
            'select *  from nguoi_dung nd where  `ten_tai_khoan`  =? and `mat_khau` =? and phan_quyen = 1',
            [username, password],
            (err, results) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ message: 'Server error', statusReq: 500 });
                }
                if (results.length > 0) {
                    req.session.admin = results[0];
                    return res
                        .status(200)
                        .json({ message: 'Login successful', statusReq: 200 });
                } else {
                    return res.status(400).json({
                        message: 'Tên tài khoản hoặc mật khẩu không đúng!',
                        statusReq: 400,
                    });
                }
            },
        );
    }

    // home
    dashboard(req, res) {
        res.render('admin/blank', { layout: 'admin' });
    }

    // news
    storeNews(req, res, next) {
        const trang_thai = req.query.status || 'approved';

        let countQuery =
            'SELECT COUNT(*) as total FROM tin_tuc WHERE `ngay_xoa` IS NULL';
        let dataQuery = 'SELECT * FROM tin_tuc WHERE `ngay_xoa` IS NULL';

        storeData(
            req,
            res,
            countQuery,
            dataQuery,
            'admin/storeNews',
            'admin',
            (item) => {
                const images = JSON.parse(item.danh_sach_anh);
                const firstImage = images.length > 0 ? images[0] : null;
                const formattedPrice = item.gia_tien
                    ? item.gia_tien.toLocaleString('vi-VN')
                    : null;

                const rawDate = new Date(item.ngay_them);
                const formattedDate = rawDate.toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                });

                return {
                    ...item,
                    firstImage,
                    formattedPrice,
                    formattedDate,
                };
            },
            trang_thai,
        );
    }

    previewNews(req, res, next) {
        const ma_so = req.params.id;
        let queryData = `
        SELECT tin_tuc.*,nguoi_dung.anh_dai_dien,nguoi_dung.so_dien_thoai,nguoi_dung.ten_nguoi_dung
        FROM  tin_tuc
        JOIN  nguoi_dung ON tin_tuc.ma_so_nguoi_dung = nguoi_dung.ma_so  
        WHERE tin_tuc.ma_so =?`;
        connection.query(queryData, [ma_so], (err, results) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: 'Server error', statusReq: 500 });
            }
            const data = results[0];
            const images = JSON.parse(data.danh_sach_anh);
            const formattedPrice = data.gia_tien / 1000000;
            const noiDungThem = JSON.parse(data.noi_dung_them);
            const noi_dung = data.noi_dung
                .replace(/\r\n/g, '<br>')
                .replace(/\n/g, '<br>');
            // const sonha = data.dia_chi_cu_the.split(',')[0]

            const { ma_phuong_xa, ma_thanh_pho, ma_quan_huyen } = data;

            const queryArea = `
                SELECT tp.ten_thanh_pho, qh.ten_quan_huyen,px.ten_phuong_xa 
                FROM phuong_xa px JOIN quan_huyen qh ON px.ma_quan_huyen = qh.ma_so 
                JOIN thanh_pho tp ON qh.ma_so_thanh_pho = tp.ma_so 
                WHERE  px.ma_so = ? AND qh.ma_so = ? AND tp.ma_so = ? `;
            const queryParams = [ma_phuong_xa, ma_quan_huyen, ma_thanh_pho];

            connection.query(queryArea, queryParams, (err, diaLyResults) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ message: 'Server error', statusReq: 500 });
                }

                res.render('partials/modalPreview', {
                    layout: false,
                    images,
                    data,
                    formattedPrice,
                    noiDungThem,
                    noi_dung,
                    diaLyData: diaLyResults[0],
                    // sonha
                });
            });
        });
    }

    deleteNews(req, res, next) {
        const ma_so = req.params.id;
        let dataQuery =
            'UPDATE tin_tuc SET  `ngay_xoa` = CURRENT_TIMESTAMP WHERE `ma_so` = ?';
        let query = [ma_so];

        connection.query(dataQuery, query, (err, results) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: 'Server error', statusReq: 500 });
            }

            res.status(200).json({ message: 'success', statusReq: 200 });
        });
    }

    approvedNews(req, res, next) {
        const ma_so = req.params.id;
        connection.query(
            'UPDATE tin_tuc SET  `trang_thai` = ? WHERE `ma_so` = ?',
            ['approved', ma_so],
            (err, results) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ message: 'Server error', statusReq: 500 });
                }

                res.redirect('/admin/quan-ly-tin?status=wait');
            },
        );
    }

    // users
    storeUsers(req, res, next) {
        let countQuery =
            'SELECT COUNT(*) as total FROM nguoi_dung WHERE `ngay_xoa` IS NULL';
        let dataQuery = `
        SELECT nd.*,
        COUNT(tt.ma_so) AS tong_so_bai_viet,
        SUM(CASE WHEN tt.trang_thai = 'approved' THEN 1 ELSE 0 END) AS so_bai_viet_da_duyet,
        SUM(CASE WHEN tt.trang_thai = 'wait' THEN 1 ELSE 0 END) AS so_bai_viet_chua_duyet,
        ROUND( AVG(dg.diem_danh_gia),1) AS trung_binh_danh_gia
        FROM nguoi_dung nd
        LEFT JOIN tin_tuc tt ON nd.ma_so = tt.ma_so_nguoi_dung
        LEFT JOIN danh_gia dg ON dg.ma_so_tin_tuc = tt.ma_so 
        WHERE nd.ngay_xoa IS null
        GROUP BY nd.ma_so`;

        storeData(
            req,
            res,
            countQuery,
            dataQuery,
            'admin/storeUsers',
            'admin',
            (item) => {
                const diem_v = item.diem_vip || 0;

                const rawDate = new Date(item.ngay_them);
                const formattedDate = rawDate.toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                });

                return {
                    ...item,
                    formattedDate,
                    diem_v,
                };
            },
        );
    }

    previewUser(req, res, next) {
        const ma_so = req.params.id;
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
                console.log(data);
                res.render('partials/modalPreviewUser', {
                    layout: false,
                    data,
                });
            },
        );
    }

    deleteUser(req, res, next) {
        const ma_so = req.params.id;

        let dataQuery =
            'UPDATE tin_tuc SET  `ngay_xoa` = CURRENT_TIMESTAMP WHERE `ma_so_nguoi_dung` = ?';
        let query = [ma_so];
        let checkData =
            'UPDATE nguoi_dung SET  `ngay_xoa` = CURRENT_TIMESTAMP WHERE `ma_so` = ?';
        let queryCheck = [ma_so];
        deleteData(req, res, dataQuery, query, checkData, queryCheck);
    }

    //Area-Cities
    storeCities(req, res, next) {
        let countQuery = 'SELECT COUNT(*) as total FROM thanh_pho ';
        let dataQuery = `
        SELECT tp.*,
        COUNT(tt.ma_so) AS tong_so_tin
        FROM thanh_pho tp
        LEFT JOIN tin_tuc tt ON tt.ma_thanh_pho = tp.ma_so 
                            AND tt.ngay_xoa IS NULL 
                            AND tt.trang_thai = 'approved'
        GROUP BY tp.ma_so
         `;

        storeData(
            req,
            res,
            countQuery,
            dataQuery,
            'admin/storeCities',
            'admin',
        );
    }

    getCity(req, res, next) {
        const ma_so = req.params.id;
        let dataQuery = `
          select * from thanh_pho where ma_so =?
           `;
        let query = [ma_so];
        getData(req, res, dataQuery, query);
    }

    addCity(req, res, next) {
        const { idCity, nameCity } = req.body;

        let dataQuery = `
        INSERT INTO wsrh.thanh_pho (ma_so, ten_thanh_pho)
VALUES(?, ?)
         `;
        let query = [idCity, nameCity];
        let checkData = `select * from thanh_pho where ma_so =?`;
        let queryCheck = [idCity];

        addData(req, res, dataQuery, query, checkData, queryCheck);
    }

    deleteCity(req, res, next) {
        const idCity = req.params.id;
        console.log(idCity);
        let dataQuery = `DELETE FROM wsrh.thanh_pho WHERE ma_so=?`;
        let query = [idCity];
        let checkData = `SELECT 1 FROM quan_huyen qh WHERE ma_so_thanh_pho =?`;
        let queryCheck = [idCity];

        deleteData(req, res, dataQuery, query, checkData, queryCheck);
    }

    updateCity(req, res, next) {
        const { idCity, nameCity } = req.body;
        const id = req.params.id;

        let dataQuery = `
        UPDATE wsrh.thanh_pho
        SET ten_thanh_pho=?
        WHERE ma_so=?
         `;
        let query = [nameCity, idCity];
        let checkData = `select * from thanh_pho where ma_so =?`;
        let queryCheck = [idCity];

        updateData(req, res, dataQuery, query, checkData, queryCheck);
    }

    //Area-Districts
    storeDistricts(req, res, next) {
        let countQuery = 'SELECT COUNT(*) as total FROM quan_huyen ';
        let dataQuery = `
        SELECT qh.*,tp.ten_thanh_pho ,
       COUNT(tt.ma_so) AS tong_so_tin
FROM quan_huyen qh
JOIN thanh_pho tp ON tp.ma_so = qh.ma_so_thanh_pho
LEFT JOIN tin_tuc tt ON tt.ma_quan_huyen = qh.ma_so 
                    AND tt.ngay_xoa IS NULL 
                    AND tt.trang_thai = 'approved'
GROUP BY qh.ma_so
ORDER BY qh.ma_so
         `;

        storeData(
            req,
            res,
            countQuery,
            dataQuery,
            'admin/storeDistricts',
            'admin',
        );
    }

    getDistrict(req, res, next) {
        const ma_so = req.params.id;

        let dataQuery = `
        select * from quan_huyen where ma_so =?
          `;
        let query = [ma_so];

        getData(req, res, dataQuery, query);
    }

    addDistrict(req, res, next) {
        const { idDistrict, city, nameDistrict } = req.body;

        let dataQuery = `
        INSERT INTO wsrh.quan_huyen (ma_so,ma_so_thanh_pho,ten_quan_huyen)
VALUES(?, ?,?)
         `;
        let query = [idDistrict, city, nameDistrict];
        let checkData = `select * from quan_huyen where ma_so =?`;
        let queryCheck = [idDistrict];

        addData(req, res, dataQuery, query, checkData, queryCheck);
    }

    deleteDistrict(req, res, next) {
        const idDistrict = req.params.id;

        let dataQuery = `DELETE FROM wsrh.quan_huyen WHERE ma_so=?`;
        let query = [idDistrict];
        let checkData = `SELECT 1 FROM phuong_xa WHERE ma_quan_huyen =?`;
        let queryCheck = [idDistrict];

        deleteData(req, res, dataQuery, query, checkData, queryCheck);
    }

    updateDistrict(req, res, next) {
        const { idDistrict, city, nameDistrict } = req.body;

        let dataQuery = `
        UPDATE wsrh.quan_huyen
        SET ma_so_thanh_pho=?, ten_quan_huyen=?
        WHERE ma_so=?
         `;
        let query = [city, nameDistrict, idDistrict];
        let checkData = `select * from quan_huyen where ma_so =?`;
        let queryCheck = [idDistrict];

        updateData(req, res, dataQuery, query, checkData, queryCheck);
    }

    //Area-Wards
    storeWards(req, res, next) {
        let countQuery = 'SELECT COUNT(*) as total FROM phuong_xa ';
        let dataQuery = `
        SELECT px.*,tp.ten_thanh_pho ,qh.ten_quan_huyen,
       COUNT(tt.ma_so) AS tong_so_tin
FROM phuong_xa px 
JOIN quan_huyen qh ON qh.ma_so = px.ma_quan_huyen
JOIN thanh_pho tp ON tp.ma_so = qh.ma_so_thanh_pho
LEFT JOIN tin_tuc tt ON tt.ma_phuong_xa = px.ma_so 
                    AND tt.ngay_xoa IS NULL 
                    AND tt.trang_thai = 'approved'
GROUP BY px.ma_so
ORDER BY px.ma_so
         `;

        storeData(req, res, countQuery, dataQuery, 'admin/storeWards', 'admin');
    }

    getWard(req, res, next) {
        const ma_so = req.params.id;

        let dataQuery = `
        SELECT px.*,qh.ma_so_thanh_pho FROM phuong_xa px
        JOIN quan_huyen qh ON px.ma_quan_huyen = qh.ma_so
        WHERE px.ma_so =?
          `;
        let query = [ma_so];

        getData(req, res, dataQuery, query);
    }

    addWard(req, res, next) {
        const { idWard, district, nameWard } = req.body;

        let dataQuery = `
        INSERT INTO wsrh.phuong_xa (ma_so,ma_quan_huyen,ten_phuong_xa)
VALUES(?, ?,?)
         `;
        let query = [idWard, district, nameWard];
        let checkData = `select * from phuong_xa where ma_so =?`;
        let queryCheck = [idWard];

        addData(req, res, dataQuery, query, checkData, queryCheck);
    }

    deleteWard(req, res, next) {
        const idWard = req.params.id;

        let dataQuery = `DELETE FROM wsrh.phuong_xa WHERE ma_so=?`;
        let query = [idWard];
        let checkData = `SELECT 1 FROM tin_tuc WHERE ma_phuong_xa =?`;
        let queryCheck = [idWard];

        deleteData(req, res, dataQuery, query, checkData, queryCheck);
    }

    updateWard(req, res, next) {
        const { idWard, district, nameWard } = req.body;

        let dataQuery = `
        UPDATE wsrh.phuong_xa
        SET ma_quan_huyen=?, ten_phuong_xa=?
        WHERE ma_so=?
         `;
        let query = [district, nameWard, idWard];
        let checkData = `select * from phuong_xa where ma_so =?`;
        let queryCheck = [idWard];

        updateData(req, res, dataQuery, query, checkData, queryCheck);
    }

    //Categories
    storeCategories(req, res, next) {
        let countQuery = 'SELECT COUNT(*) as total FROM chuyen_muc_tin ';
        let dataQuery = `
            SELECT cmt.*,
            COUNT(tt.ma_so) AS tong_so_tin
            FROM chuyen_muc_tin cmt 
            LEFT JOIN tin_tuc tt ON tt.ma_chuc_nang = cmt.ma_so 
                                AND tt.ngay_xoa IS NULL 
                                AND tt.trang_thai = 'approved'
            GROUP BY cmt.ma_so
            ORDER by cmt.ma_so
             `;
        storeData(
            req,
            res,
            countQuery,
            dataQuery,
            'admin/storeCategories',
            'admin',
        );
    }

    getCategory(req, res, next) {
        const ma_so = req.params.id;

        let dataQuery = `
                select * from chuyen_muc_tin where ma_so =?
                 `;
        let query = [ma_so];
        getData(req, res, dataQuery, query);
    }

    addCategory(req, res, next) {
        const { id, name, describe } = req.body;
        let dataQuery = `
                INSERT INTO wsrh.chuyen_muc_tin (ma_so, ten_chuyen_muc,mo_ta)
        VALUES(?, ?,?)
                 `;
        let query = [id, name, describe];
        let checkData = `select * from chuyen_muc_tin where ma_so =?`;
        let queryCheck = [id];
        //     const { id, name, describe } = req.body;
        //     let dataQuery;
        //     let query;
        //     let checkData = `SELECT * FROM chuyen_muc_tin WHERE ma_so = ?`;
        //     let queryCheck = [id];

        //     if (!id) {
        //         dataQuery = `
        //     INSERT INTO wsrh.chuyen_muc_tin (ten_chuyen_muc, mo_ta)
        //     VALUES (?, ?)
        // `;
        //         query = [name, describe];
        //     } else {
        //         dataQuery = `
        //     INSERT INTO wsrh.chuyen_muc_tin (ma_so, ten_chuyen_muc, mo_ta)
        //     VALUES (?, ?, ?)
        // `;
        //         query = [id, name, describe];
        //     }

        addData(req, res, dataQuery, query, checkData, queryCheck);
    }

    deleteCategory(req, res, next) {
        const id = req.params.id;
        console.log(id);
        let dataQuery = `DELETE FROM wsrh.chuyen_muc_tin WHERE ma_so=?`;

        let query = [id];
        let checkData = `SELECT 1 FROM tin_tuc tt WHERE ma_chuc_nang =?`;
        let queryCheck = [id];
        deleteData(req, res, dataQuery, query, checkData, queryCheck);
    }

    updateCategory(req, res, next) {
        const { id, name, describe } = req.body;
        let dataQuery = `
        UPDATE wsrh.chuyen_muc_tin
        SET ten_chuyen_muc=?, mo_ta=?
        WHERE ma_so=?;
         `;
        let query = [name, describe, id];
        let checkData = `select * from chuyen_muc_tin where ma_so =?`;
        let queryCheck = [id];

        updateData(req, res, dataQuery, query, checkData, queryCheck);
    }
}

function storeData(
    req,
    res,
    countQuery,
    dataQuery,
    path,
    layout,
    formatData,
    trang_thai,
) {
    const page = req.query.page || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    let queryParams = [];
    let countParams = [];

    if (trang_thai) {
        countQuery += ' AND `trang_thai` = ?';
        dataQuery += ' AND `trang_thai` = ?';
        queryParams.push(trang_thai);
        countParams.push(trang_thai);
    }
    countQuery += '';
    dataQuery += ` LIMIT ? OFFSET ?;`;
    queryParams.push(limit, offset);

    connection.query(countQuery, countParams, (err, countResults) => {
        if (err) {
            return res
                .status(500)
                .json({ message: 'Server error', statusReq: 500 });
        }

        const totalRecords = countResults[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        connection.query(dataQuery, queryParams, (err, results) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: 'Server error', statusReq: 500 });
            }
            const data = formatData ? results.map(formatData) : results;

            res.render(path, {
                layout,
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

function getData(req, res, dataQuery, query) {
    connection.query(dataQuery, query, (err, results) => {
        if (err) {
            return res
                .status(500)
                .json({ message: 'Server error', statusReq: 500 });
        }
        const data = results[0];
        res.status(200).json({ message: 'success', data });
    });
}

function deleteData(req, res, dataQuery, query, checkData, queryCheck) {
    connection.query(checkData, queryCheck, (err, results) => {
        if (err) {
            return res
                .status(500)
                .json({ message: 'Server error', statusReq: 500 });
        }

        if (results.length > 0) {
            return res.status(300).json({
                message: 'Còn dữ liệu trong bảng, không thể xóa dữ liệu',
                statusReq: 300,
            });
        }
        connection.query(dataQuery, query, (err, results) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: 'Server error1', statusReq: 500 });
            }
            const data = results;
            res.status(200).json({
                message: 'Xóa thành công',
                data,
                statusReq: 200,
            });
        });
    });
}

function updateData(req, res, dataQuery, query, checkData, queryCheck) {
    connection.query(checkData, queryCheck, (err, results) => {
        if (err) {
            return res
                .status(500)
                .json({ message: 'Server error', statusReq: 500 });
        }

        if (results.length == 0) {
            return res
                .status(404)
                .json({ message: 'Không tìm thấy dữ liệu', statusReq: 404 });
        }
        connection.query(dataQuery, query, (err, results) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: 'Server error', statusReq: 500 });
            }
            const data = results;
            res.status(200).json({
                message: 'Cập nhật thành công',
                data,
                statusReq: 200,
            });
        });
    });
}

function addData(req, res, dataQuery, query, checkData, queryCheck) {
    connection.query(checkData, queryCheck, (err, results) => {
        if (err) {
            return res
                .status(500)
                .json({ message: 'Server error', statusReq: 500 });
        }

        if (results.length > 0) {
            return res
                .status(300)
                .json({ message: 'Đã tồn tại', statusReq: 300 });
        }
        connection.query(dataQuery, query, (err, results) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: 'Server error1', statusReq: 500 });
            }
            const data = results;
            res.status(200).json({
                message: 'Thêm thành công',
                data,
                statusReq: 200,
            });
        });
    });
}

module.exports = new AdminController();
