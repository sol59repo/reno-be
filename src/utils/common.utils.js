// const path = require('path');
const HttpException = require("./HttpException.utils");
// const { mailtemplate } = require("./mailtemplate");
// var nodemailer = require('nodemailer');

exports.getPlaceholderStringForArray = (arr) => {
    if (!Array.isArray(arr)) {
        throw new Error('Invalid input');
    }

    // if is array, we'll clone the arr 
    // and fill the new array with placeholders
    const placeholders = [...arr];
    return placeholders.fill('?').join(', ').trim();
}


exports.multipleColumnSet = (object) => {
    if (typeof object !== 'object') {
        throw new Error('Invalid input');
    }

    const keys = Object.keys(object);
    const columnSetValues = Object.values(object);

    let columnSet = keys.map(key => `${key} = ?`).join(', ');
    return {
        columnSet,
        columnSetValues
    }
}

exports.multipleColumnORWhere = (object) => {
    if (typeof object !== 'object') {
        throw new Error('Invalid input');
    }

    const keys = Object.keys(object);
    const columnORSetValues = Object.values(object);

    columnORSet = keys.map((key, idx) => (idx === 0) ? `WHERE ${key} = ?` : ` OR  ${key} = ?`).join(' ')
    return {
        columnORSet,
        columnORSetValues
    }
}

exports.multipleColumnWhere = (object) => {
    if (typeof object !== 'object') {
        throw new Error('Invalid input');
    }

    const keys = Object.keys(object);
    const columnWhereValues = Object.values(object);
    let columnWhere = '';
    columnWhere = keys.map(key => {
        let k = key;
        if (key.includes('<>') || key.includes('!=')) {
            k = k.replace('<>', '');
            k = k.replace('!=', '');
            return ` ${k} !=?`;
        } else if (key.includes('>=')) {
            k = k.replace('>=', '');
            return ` ${k} >=?`;
        } else if (key.includes('<=')) {
            k = k.replace('<=', '');
            return ` ${k} <=?`;
        } else {
            return ` ${k} =?`;
        }
    }).join(' AND ');

    // columnWhere = keys.map(key => `${key} != ?`).join(' AND ');

    return {
        columnWhere,
        columnWhereValues
    }
}

exports.multipleColumnJoin = (object) => {
    if (typeof object !== 'object') {
        throw new Error('Invalid input');
    }
    const keys = Object.keys(object);
    let columnJoin = '';
    columnJoin = keys.map(key => ` JOIN ${key} on ${object[key]}`).join(' ')
    return {
        columnJoin
    }
}

exports.multipleColumnInsert = (object) => {
    if (typeof object !== 'object') {
        throw new Error('Invalid input');
    }

    const keys = Object.keys(object);
    const values = Object.values(object);
    let columnKeys = '';
    let columnInsert = '';

    columnKeys = keys.map(key => `${key}`).join(', ');
    columnInsert = keys.map(key => `?`).join(', ');

    return {
        columnKeys,
        columnInsert,
        values
    }
}


exports.errMsgs = (file, parsms) => {
    return {
        fileName: file.name,
        mimetype: file.mimetype,
        size: file.size,
        msg: `File ${file.name} is ${parsms}`
    }

}

const validateFiles = (objFiles) => {
    let err = [];
    const acceptedFileType = objFiles.fileType;
    const acceptedFileSize = objFiles.size;

    if (Array.isArray(objFiles.files.file)) {
        for (let x of objFiles.files.file) {
            const mime = x.mimetype.split("/");
            if (!acceptedFileType.includes(mime[1])) {
                const _errMsgs = this.errMsgs(x, `invalid, file type accepted: ${acceptedFileType.join('|')}`);
                err.push(_errMsgs);
            }

            if (acceptedFileSize < x.size) {
                const _acceptedFileSize = bytesToSize(acceptedFileSize, 0);
                const _eneteredFileSize = bytesToSize(x.size, 0);
                const _errMsgs = this.errMsgs(x, `invalid. File size accepted : ${_acceptedFileSize}. ${x.name} is ${_eneteredFileSize}`);
                err.push(_errMsgs);
            }
        }
    } else {
        const mime = objFiles.files.file.mimetype.split("/");
        const size = objFiles.files.file.size;
        const x = objFiles.files.file;
        if (!acceptedFileType.includes(mime[1])) {
            const _errMsgs = this.errMsgs(x, `invalid. File type: accepted : ${acceptedFileType.join('|')}`);
            err.push(_errMsgs);
        }

        if (acceptedFileSize < size) {
            const _acceptedFileSize = bytesToSize(acceptedFileSize, 0);
            const _eneteredFileSize = bytesToSize(size, 0);
            const _errMsgs = this.errMsgs(x, `invalid. File size accepted : ${_acceptedFileSize}. ${x.name} is ${_eneteredFileSize}`);
            err.push(_errMsgs);
        }
    }

    return err;
}

const makeFileName = () => {
    return new Date().getTime();
}


// exports.uploadFile = (objFiles) => {
//     let err = validateFiles(objFiles);
//     if (err.length > 0) {
//         if (objFiles.hasCallback) {
//             objFiles.callback();
//         }
//         throw new HttpException(401, 'Upload failed', { errors: err });
//     }
//     let fileName = [];
//     return new Promise((resolve) => {
//         const initPath = objFiles.path;
//         if (Array.isArray(objFiles.files.file)) {
//             objFiles.files.file.forEach((item, index) => {
//                 const initFileName = `${makeFileName()}${index}.${item.mimetype.split("/")[1]}`;
//                 const _path = `${path.resolve(initPath + '/' + initFileName)}` // path
//                 fileName.push(initFileName);
//                 item.mv(_path, function (err) {
//                     if (err) {
//                         throw new HttpException(401, err);
//                     }
//                 });
//             });

//         } else {
//             const item = objFiles.files.file;
//             const initFileName = `${makeFileName()}.${item.mimetype.split("/")[1]}`;
//             const _path = `${path.resolve(initPath + '/' + initFileName)}` // path
//             fileName.push(initFileName);
//             item.mv(_path, function (err) {
//                 if (err) {
//                     throw new HttpException(401, err);
//                 }
//             });
//         }
//         resolve(fileName);
//     });
// }

const bytesToSize = (bytes, precision) => {
    var kilobyte = 1024;
    var megabyte = kilobyte * 1024;
    var gigabyte = megabyte * 1024;
    var terabyte = gigabyte * 1024;

    if ((bytes >= 0) && (bytes < kilobyte)) {
        return bytes + ' B';

    } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
        return (bytes / kilobyte).toFixed(precision) + ' KB';

    } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
        return (bytes / megabyte).toFixed(precision) + ' MB';

    } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
        return (bytes / gigabyte).toFixed(precision) + ' GB';

    } else if (bytes >= terabyte) {
        return (bytes / terabyte).toFixed(precision) + ' TB';

    } else {
        return bytes + ' B';
    }
}



// exports.sendEmail = async (params) => {
//     let transporter = nodemailer.createTransport({
//         host: 'smtp.googlemail.com', // Gmail Host
//         port: 465, // Port
//         secure: true, // this is true as port is 465
//         auth: {
//             user: '', // generated ethereal user
//             pass: '', // generated ethereal password
//         },
//     });

//     let obj = {
//         from: '"" <>',
//         to: params.to,
//         subject: params.subject,
//     }
//     if (params.isTXT) {
//         obj.text = params.content;
//     } else {
//         obj.html = mailtemplate(params);
//     }

//     let info = await transporter.sendMail(obj);
//     console.log(info);
// }



exports.generateUserprefix = async () => {
    var date = new Date();
    var year = date.getFullYear().toString().slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    return year + month + "-";
}

exports.generateBorrowerprefix = async () => {
    var date = new Date();
    var year = date.getFullYear().toString().slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    return year + month + "-";
}


exports.generateId = async (prefix, n) => {
    return prefix + (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
}