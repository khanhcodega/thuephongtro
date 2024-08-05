const connection = require('../../config/db/index');
const containsBadWords = require('../../util/checkBadWords');
class PostNewsController {
    index(req, res, next) {
        res.render('postNews');
    }

    saveDraft(req, res, next) {
        const {
            ma_so,
            categorytype,
            city,
            district,
            ward,
            fulladdress,
            interior,
            floor,
            bedroom,
            toilet,
            people,
            area,
            price,
            deposit,
            titleNews,
            descNews,
            old_image,
            old_video,
        } = req.body;

        const convertToNullIfEmpty = (value) => {
            return value === '' || value === undefined ? null : value;
        };

        const interiorConverted = convertToNullIfEmpty(interior);
        const floorConverted = convertToNullIfEmpty(floor);
        const bedroomConverted = convertToNullIfEmpty(bedroom);
        const toiletConverted = convertToNullIfEmpty(toilet);
        const peopleConverted = convertToNullIfEmpty(people);
        const areaConverted = convertToNullIfEmpty(area);
        const priceConverted = convertToNullIfEmpty(price);
        const cityConverted = convertToNullIfEmpty(city);
        const wardConverted = convertToNullIfEmpty(ward);
        const districtConverted = convertToNullIfEmpty(district);
        const categorytypeConverted = convertToNullIfEmpty(categorytype);
        const depositConverted = convertToNullIfEmpty(deposit);

        const images = req.files.images
            ? req.files.images.map((file) => '/uploads/' + file.filename)
            : [];
        const video = req.files.video
            ? '/uploads/' + req.files.video[0].filename
            : old_video;

        const queryCheckStatus = 'SELECT * FROM tin_tuc WHERE ma_so = ?';
        

        const queryCheckDraft =
            'SELECT * FROM tin_tuc WHERE ma_so_nguoi_dung = ? AND trang_thai = "draft"';
        connection.query(queryCheckDraft, [ma_so], (err, draftResults) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: 'Server error1', statusReq: 500 });
            }

            if (draftResults.length > 0) {
                const draftId = draftResults[0].ma_so;
                const queryUpdateDraft =
                    'UPDATE wsrh.tin_tuc SET  `tieu_de`=?, `noi_dung`=?, `ma_chuc_nang`=?, `ma_phuong_xa`=?, `gia_tien`=?, `dien_tich`=?,   `ngay_cap_nhat`=CURRENT_TIMESTAMP, `noi_dung_them`=?, `dia_chi_cu_the`=?, `danh_sach_anh`=?, `ma_thanh_pho`=?, `ma_quan_huyen`=? ,`video`=? WHERE `ma_so` = ?';
                const updateValues = [
                    titleNews,
                    descNews,
                    categorytypeConverted,
                    wardConverted,
                    priceConverted,
                    areaConverted,
                    JSON.stringify({
                        interior: interiorConverted,
                        floor: floorConverted,
                        bedroom: bedroomConverted,
                        toilet: toiletConverted,
                        people: peopleConverted,
                        deposit: depositConverted,
                    }),
                    fulladdress,
                    JSON.stringify([...images, ...JSON.parse(old_image)]),
                    cityConverted,
                    districtConverted,
                    video,
                    draftId,
                ];

                connection.query(
                    queryUpdateDraft,
                    updateValues,
                    (err, updateResults) => {
                        if (err) {
                            return res.status(500).json({
                                message: 'Server error2',
                                statusReq: 500,
                            });
                        }
                        res.status(200).json({
                            statusReq: 200,
                            message: 'Bản ghi nháp đã được cập nhật',
                        });
                    },
                );
            } else {
                const queryInsertDraft = `INSERT INTO wsrh.tin_tuc (
                    ma_so_nguoi_dung, tieu_de, noi_dung, ma_chuc_nang, ma_phuong_xa, 
                    gia_tien, dien_tich, ngay_them, ngay_xoa, ngay_cap_nhat, 
                    noi_dung_them, dia_chi_cu_the, danh_sach_anh, ma_thanh_pho, 
                    ma_quan_huyen, video, trang_thai
                ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, null, null, ?, ?, ?, ?, ?, ?, ?)
            `;
                const insertValues = [
                    ma_so,
                    titleNews,
                    descNews,
                    categorytypeConverted,
                    wardConverted,
                    priceConverted,
                    areaConverted,
                    JSON.stringify({
                        interior: interiorConverted,
                        floor: floorConverted,
                        bedroom: bedroomConverted,
                        toilet: toiletConverted,
                        people: peopleConverted,
                        deposit: depositConverted,
                    }),
                    fulladdress,
                    JSON.stringify(images),
                    cityConverted,
                    districtConverted,
                    video,
                    'draft',
                ];

                connection.query(
                    queryInsertDraft,
                    insertValues,
                    (err, insertResults) => {
                        if (err) {
                            console.error('Insert Error:', err);
                            return res.status(500).json({
                                message: 'Server error3',
                                statusReq: 500,
                            });
                        }
                        res.status(201).json({
                            statusReq: 201,
                            message: 'Bản ghi nháp đã được tạo',
                        });
                    },
                );
            }
        });
    }

    createPost(req, res, next) {
        const ma_so = req.cookies.user;
        const { titleNews, descNews, fulladdress } = req.body;
        let trang_thai = 'wait';
        if (
            containsBadWords(titleNews) ||
            containsBadWords(descNews) ||
            containsBadWords(fulladdress)
        ) {
            trang_thai = 'error';
        }
        const queryCheckDraft =
            'SELECT * FROM tin_tuc WHERE ma_so_nguoi_dung = ? AND trang_thai = "draft"';

        connection.query(queryCheckDraft, [ma_so], (err, draftResults) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: 'Server error', statusReq: 500 });
            }

            const draftId = draftResults[0].ma_so;
            console.log(draftId);
            connection.query(
                `UPDATE wsrh.tin_tuc SET  trang_thai= ? WHERE ma_so =?`,
                [trang_thai, draftId],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            message: 'Server error',
                            statusReq: 500,
                        });
                    }
                    res.status(200).json({
                        statusReq: 200,
                        message: 'Tạo tin thành công.',
                    });
                },
            );
        });
    }

    getCity(req, res, next) {
        connection.query('SELECT * FROM thanh_pho', (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    }

    getDistricts(req, res, next) {
        const ma_so_thanh_pho = req.query.ma_so_thanh_pho;
        connection.query(
            'SELECT * FROM quan_huyen WHERE ma_so_thanh_pho = ?',
            [ma_so_thanh_pho],
            (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(results);
            },
        );
    }

    getWards(req, res, next) {
        const ma_quan_huyen = req.query.ma_quan_huyen;
        connection.query(
            'SELECT * FROM phuong_xa WHERE ma_quan_huyen = ?',
            [ma_quan_huyen],
            (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(results);
            },
        );
    }

    getCategoryType(req, res, next) {
        connection.query('SELECT * FROM chuyen_muc_tin', (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    }
}

module.exports = new PostNewsController();
