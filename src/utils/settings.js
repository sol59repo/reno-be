// const jwt = require('jsonwebtoken'); replace jwt that compat with cloudflare

const apimode = 'TEST'; // "TEST"


exports.formatData = (data) => {
    return {
        apimode: apimode,
        ret: apimode === "LIVE" ? _encrypt(data) : data
    }
}

const _encrypt = (data = {}) => {
    // const secretKey = process.env.SECRET_JWT || "";
    // const encrypted = jwt.sign(data, secretKey, {
    //     expiresIn: '7d'
    // });

    // return encrypted;
    return {};
}