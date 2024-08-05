const fs = require('fs');

const path = require('path');
const connection = require('../../config/db');
// require('./app/models/vietNamAddress')
// const fs = require('fs');

// const provinces = JSON.parse(fs.readFileSync(path.join(__dirname, 'dist', 'tinh_tp.json'), 'utf8'));
// const districts = JSON.parse(fs.readFileSync(path.join(__dirname, 'dist', 'quan_huyen.json'), 'utf8'));
// const wards = JSON.parse(fs.readFileSync(path.join(__dirname, 'dist', 'xa_phuong.json'), 'utf8'));

// const hcmProvinces = {};
// const hcmDistricts = {};
// const hcmWards = {};

// // Lọc tỉnh/thành phố Hồ Chí Minh
// for (const [code, province] of Object.entries(provinces)) {
//   if (province.name === 'Hồ Chí Minh') {
//     hcmProvinces[code] = province;
//   }
// }
// // console.log(hcmProvinces[district.province_code])

// // Lọc các quận thuộc Hồ Chí Minh
// for (const [code, district] of Object.entries(districts)) {
//   if (hcmProvinces[district.parent_code]) {
//     hcmDistricts[code] = district;
//   }
// }

// // Lọc các phường/xã thuộc Hồ Chí Minh
// for (const [code, ward] of Object.entries(wards)) {
//   if (hcmDistricts[ward.parent_code]) {
//     hcmWards[code] = ward;
//   }
// }

// fs.writeFileSync('hcm_provinces.json', JSON.stringify(hcmProvinces, null, 2));
// fs.writeFileSync('hcm_districts.json', JSON.stringify(hcmDistricts, null, 2));
// fs.writeFileSync('hcm_wards.json', JSON.stringify(hcmWards, null, 2));

// console.log('provinces :',provinces)
// console.log('districts :',districts)
// console.log('wards :',wards)

const provinces = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, '../../../hcm_provinces.json'),
        'utf8',
    ),
);
const districts = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, '../../../hcm_districts.json'),
        'utf8',
    ),
);
const wards = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../../hcm_wards.json'), 'utf8'),
);
const insertData = () => {
    Object.values(provinces).map((province) => {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO thanh_pho (ma_so, ten_thanh_pho) VALUES ( ?, ?)',
                [province.code, province.name],
                (err, results) => {
                    console.log(results);
                },
            );
        });
    });

    Object.values(districts).map((district) => {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO quan_huyen (ma_so, ma_so_thanh_pho, ten_quan_huyen) VALUES (?, ?, ?)',
                [district.code, district.parent_code, district.name],
                (err, results) => {
                    console.log(results);
                },
            );
        });
    });

    Object.values(wards).map((ward) => {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO phuong_xa (ma_so, ma_quan_huyen, ten_phuong_xa) VALUES (?, ?, ?)',
                [ward.code, ward.parent_code, ward.name],
                (err, results) => {
                    console.log(results);
                },
            );
        });
    });
};

module.exports = insertData();
