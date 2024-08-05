const connection = require('../../config/db/index');

class TestController {
    index(req, res, next) {
        const searchKeyword = req.query.keyword ? req.query.keyword : '';
        const { idSender, idReceiver, idNews } = req.query;
        const ma_so = idSender ? idSender : req.cookies.user;

        const queryListChat = `
    SELECT DISTINCT
        nd.ma_so AS ma_so_nd,
        nd.ten_nguoi_dung,
        nd.anh_dai_dien,
        tt.ma_so AS ma_so_tt,
        tt.tieu_de,
        tt.danh_sach_anh
    FROM
        nhan_tin nt
        JOIN nguoi_dung nd ON nd.ma_so = CASE WHEN nt.ma_so_nguoi_dung = ? THEN nt.ma_so_nguoi_nhan ELSE nt.ma_so_nguoi_dung END
        JOIN tin_tuc tt ON tt.ma_so = nt.ma_so_tin_tuc
    WHERE
        (nt.ma_so_nguoi_dung = ? OR nt.ma_so_nguoi_nhan = ?)
        AND (nd.ten_nguoi_dung LIKE ? OR tt.tieu_de LIKE ?)`;
        const searchTerm = `%${searchKeyword}%`;
        connection.query(
            queryListChat,
            [ma_so, ma_so, ma_so, searchTerm, searchTerm],
            (err, resultsListChat) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ errMessage: 'Server error', statusReq: 500 });
                }

                if (!resultsListChat.length) {
                    return res.render('chat');
                }

                const data = resultsListChat.map((item) => {
                    const images = JSON.parse(item.danh_sach_anh);

                    return {
                        ...item,
                        images,
                    };
                });

                const receiverId = idReceiver ? idReceiver : data[0].ma_so_nd;
                const newsId = idNews ? idNews : data[0].ma_so_tt;

                const queryInfo = `
                select tt.danh_sach_anh,tt.tieu_de,tt.gia_tien,nd.ten_nguoi_dung,nd.anh_dai_dien,qh.ten_quan_huyen,tp.ten_thanh_pho from tin_tuc tt join nguoi_dung nd on nd.ma_so = ? join quan_huyen qh on qh.ma_so = tt.ma_quan_huyen join thanh_pho tp  on tp.ma_so = tt.ma_thanh_pho where tt.ma_so  = ?
`;

                getChat(
                    req,
                    res,
                    queryInfo,
                    [receiverId, newsId],
                    [receiverId, ma_so, receiverId, ma_so, receiverId, newsId],
                    data,
                );
            },
        );
    }

    createChat(req, res, next) {
        const { idSender, idNews } = req.query;
        const ma_so = idSender ? idSender : req.cookies.user;

        const sqlInsert = `INSERT INTO wsrh.nhan_tin
            ( ma_so_nguoi_dung, ma_so_tin_tuc, noi_dung_binh_luan, ngay_them, ma_so_nguoi_nhan)
            VALUES( ?, ?, '', CURRENT_TIMESTAMP, ?)`;

        const sqlSelect = `
        SELECT tt.ma_so_nguoi_dung
        FROM tin_tuc tt
        WHERE tt.ma_so = ?
          AND NOT EXISTS (
            SELECT 1
            FROM nhan_tin nt
            WHERE nt.ma_so_tin_tuc = tt.ma_so
              AND ((nt.ma_so_nguoi_dung = tt.ma_so_nguoi_dung AND nt.ma_so_nguoi_nhan = ?)
                   OR (nt.ma_so_nguoi_nhan = tt.ma_so_nguoi_dung AND nt.ma_so_nguoi_dung = ?))
        )`;
        const querySelect = [idNews, ma_so, ma_so];

        connection.query(sqlSelect, querySelect, (err, results) => {
            if (err) {
                return res
                    .status(500)
                    .json({ errMessage: 'Server error', statusReq: 500 });
            }

            if (results.length > 0) {
                const ma_so_nd = results[0].ma_so_nguoi_dung;
                connection.query(
                    sqlInsert,
                    [ma_so, idNews, ma_so_nd],
                    (err, results) => {
                        if (err) {
                            return res.status(500).json({
                                errMessage: 'Server error',
                                statusReq: 500,
                            });
                        }
                        res.redirect('/chat');
                    },
                );
            } else {
                res.redirect('/chat');
            }
        });
    }

    sendMessage(req, res, next, io) {
        const { message, idSender, idReceiver, idNews } = req.body;

        const query = `INSERT INTO wsrh.nhan_tin (ma_so_nguoi_dung, ma_so_tin_tuc, noi_dung_binh_luan, ngay_them, ma_so_nguoi_nhan) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)`;

        connection.query(
            query,
            [idSender, idNews, message, idReceiver],
            (err, results) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ errMessage: 'Server error', statusReq: 500 });
                }
                io.emit('newMessage', {
                    message,
                    idSender,
                    idReceiver,
                    idNews,
                });
                res.status(200).json({ message: 'success' });
            },
        );
    }
}

function getChat(req, res, sql, query, queryMain, data) {
    connection.query(sql, query, (err, resultsInfo) => {
        if (err) {
            return res.status(500).json({
                errMessage: 'Server error',
                statusReq: 500,
            });
        }

        if (resultsInfo.length > 0) {
            const firstItem = resultsInfo[0];
            const images = JSON.parse(firstItem.danh_sach_anh);
            const firstImage = images[0];
            const formattedPrice = firstItem.gia_tien / 1000000;
            const dataInfo = {
                ...firstItem,
                firstImage,
                formattedPrice,
            };

            const queryChatMain = `SELECT nt.*,CASE WHEN nt.ma_so_nguoi_nhan = ? THEN 'sender' ELSE 'receiver' END AS role FROM nhan_tin nt WHERE ((nt.ma_so_nguoi_dung = ? AND nt.ma_so_nguoi_nhan = ?) OR (nt.ma_so_nguoi_nhan = ? AND nt.ma_so_nguoi_dung = ?)) and  nt.ma_so_tin_tuc = ? ORDER BY ngay_them`;

            connection.query(
                queryChatMain,
                queryMain,
                (err, resultsMainChat) => {
                    if (err) {
                        return res.status(500).json({
                            errMessage: 'Server error',
                            statusReq: 500,
                        });
                    }
                    const dataMainChat = resultsMainChat;

                    res.render('chat', {
                        data,
                        dataMainChat,
                        dataInfo,
                    });
                },
            );
        }
    });
}

module.exports = new TestController();
