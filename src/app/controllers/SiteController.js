const connection = require('../../config/db/index');

class SiteController {
    index(req, res, next) {
        const page = req.query.page || 1;
        const user = req.cookies.user || '';
        const search = req.query.search || '';
        const district = req.query.district;
        const category = req.query.category;
        const minArea = req.query.minArea * 1000000 || 0;
        const maxArea = req.query.maxArea * 1000000 || Number.MAX_SAFE_INTEGER;
        const minPrice = req.query.minPrice * 1000000 || 0;
        const maxPrice =
            req.query.maxPrice * 1000000 || Number.MAX_SAFE_INTEGER;
        const orderBy = req.query.orderby;

        console.log(typeof orderBy);

        const limit = 8;
        const offset = (page - 1) * limit;
        let sql = `
        SELECT tin_tuc.*, nguoi_dung.anh_dai_dien, nguoi_dung.so_dien_thoai, nguoi_dung.ten_nguoi_dung,
               tp.ten_thanh_pho, qh.ten_quan_huyen,
               CASE WHEN yeu_thich.ma_so_nguoi_dung IS NOT NULL THEN 1 ELSE 0 END AS da_like,
               IFNULL(like_counts.total_likes, 0) AS tong_so_likes,
               DATE_FORMAT(tin_tuc.ngay_them, '%d/%m/%Y') AS ngay_tao
        FROM tin_tuc
        JOIN nguoi_dung ON tin_tuc.ma_so_nguoi_dung = nguoi_dung.ma_so
        LEFT JOIN thanh_pho tp ON tin_tuc.ma_thanh_pho = tp.ma_so
        LEFT JOIN quan_huyen qh ON tin_tuc.ma_quan_huyen = qh.ma_so
        LEFT JOIN yeu_thich ON tin_tuc.ma_so = yeu_thich.ma_so_tin_tuc AND yeu_thich.ma_so_nguoi_dung = ?
        LEFT JOIN (SELECT ma_so_tin_tuc, COUNT(*) AS total_likes FROM yeu_thich GROUP BY ma_so_tin_tuc) AS like_counts ON tin_tuc.ma_so = like_counts.ma_so_tin_tuc
        WHERE tin_tuc.ngay_xoa IS NULL
        AND tin_tuc.trang_thai = 'approved'
        AND tin_tuc.gia_tien BETWEEN ? AND ?
        AND tin_tuc.dien_tich BETWEEN ? AND ?
       AND (nguoi_dung.ten_nguoi_dung LIKE ? OR tin_tuc.tieu_de LIKE ?  OR tin_tuc.trang_thai LIKE ?  OR qh.ten_quan_huyen LIKE ?)`;

        const searchTerm = `%${search}%`;
        let queryParams = [
            user,
            minPrice,
            maxPrice,
            minArea,
            maxArea,
            searchTerm,
            searchTerm,
            searchTerm,
            searchTerm,
        ];

        if (district) {
            sql += ` AND tin_tuc.ma_quan_huyen = ?`;
            queryParams.push(district);
        }

        if (category) {
            sql += ` AND tin_tuc.ma_chuc_nang = ?`;
            queryParams.push(category);
        }

        if (orderBy == 'true') {
            sql += ` ORDER BY tin_tuc.ngay_them DESC`;
        } else {
            sql += ` ORDER BY tong_so_likes DESC`;
        }

        sql += ` LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);

        // console.log(sql)

        connection.query(
            sql,
            queryParams,

            (err, results) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ errMessage: 'Server error', statusReq: 500 });
                }
                const data = results.map((item) => {
                    const images = JSON.parse(item.danh_sach_anh);
                    const firstFourImages = images.slice(0, 4);
                    const formattedPrice = item.gia_tien / 1000000;
                    const noiDungThem = JSON.parse(item.noi_dung_them);
                    const noi_dung = item.noi_dung
                        .replace(/\r\n/g, '<br>')
                        .replace(/\n/g, '<br>');
                    const { interior, floor, bedroom, toilet, deposit } =
                        noiDungThem;
                    return {
                        ...item,
                        firstFourImages,
                        formattedPrice,
                        interior,
                        floor,
                        bedroom,
                        toilet,
                        deposit,
                        noi_dung,
                    };
                });

                connection.query(
                    'SELECT * FROM quan_huyen ORDER BY ten_quan_huyen ASC',
                    (err, diaLyResults) => {
                        if (err) {
                            return res.status(500).json({
                                errMessage: 'Server error',
                                statusReq: 500,
                            });
                        }

                        connection.query(
                            'SELECT * FROM chuyen_muc_tin ',
                            (err, chuyenmucResults) => {
                                if (err) {
                                    return res.status(500).json({
                                        errMessage: 'Server error',
                                        statusReq: 500,
                                    });
                                }
                                // Pass thông tin từ bảng địa lý vào res.render
                                res.render('home', {
                                    data,
                                    diaLyData: diaLyResults,
                                    chuyenmucData: chuyenmucResults,
                                });
                            },
                        );
                    },
                );
            },
        );
    }

    setMaSo(req, res, next) {
        const { ma_so } = req.body;
        console.log(ma_so);
        req.cookies.user = ma_so;
        res.json({ success: true, ma_so: req.cookies.user });
    }
}

module.exports = new SiteController();
