// import JSEncrypt from 'jsencrypt' //rsa
import CryptoJS from 'crypto-js/index' //aes
import JSEncrypt from 'encrypt'


// rsa 加密
function rsaEncrypt(content) {
    // let key = store.state.user.rKey
    let key = wx.getStorageSync('rKey')
    // 不存在rsaKey直接返回
    if (!key) {
        return content
    }
    let jsencrypt = new JSEncrypt()
    jsencrypt.setPublicKey(key)
    return jsencrypt.encrypt(content)
}

// rsa 解密
function rsaDecrypt(content) {
    // let key = store.state.user.rKey
    let key = wx.getStorageSync('rKey')
    if (!key) {
        return content
    }
    let decrypt = new JSEncrypt()
    decrypt.setPublicKey(key)
    return decrypt.decrypt(content)
}

// aes加密
function aesEncrypt(word, key) {
    key = CryptoJS.enc.Utf8.parse(key)
    let encrypted = CryptoJS.AES.encrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
}

// aes解密
function aesDecrypt(word, key) {
    key = CryptoJS.enc.Utf8.parse(key)
    let decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

// 解密响应
export const decryptData = function (res) {
    let data = res.data
    if (data.aKey) {
        let aKey = rsaDecrypt(data.aKey)
        let dataStr = aesDecrypt(data.enData, aKey)
        if (data.sign != CryptoJS.SHA256(dataStr).toString()) {
            console.error('decryptData', res, "验签失败！")
            res.data = {}
        }
        res.data = JSON.parse(dataStr)
    }
    // 此处，处理表格数据
    if (data.data && data.data.aKey) {
        let aKey = rsaDecrypt(data.data.aKey)
        let dataStr = aesDecrypt(data.data.enData, aKey)
        if (data.data.sign != CryptoJS.SHA256(dataStr).toString()) {
            console.error('decryptData', res, "验签失败！")
            res.data = {}
        }
        res.data = JSON.parse(dataStr)
    }
}

export const verifySign = function (res) {
    let data =  Object.assign({}, res.data)
    if (!data.sign) {
        console.error('verifySign', res, "验签失败！")
        res.data = {}
    }
    let sign = data.sign
    delete data.sign
    if (sign == CryptoJS.SHA256(JSON.stringify(data)).toString()) {
        res.data = data
        return
    }
    data =  Object.assign({}, res.data)
    data.sign = null
    if (sign == CryptoJS.SHA256(JSON.stringify(data)).toString()) {
        res.data = res.data
        return
    }
    console.error('verifySign', res, "验签失败！")
    res.data = {}
}

export const sign = function(config) {
    let dataStr = JSON.stringify(config.data)
    let sign = CryptoJS.SHA256(dataStr).toString()
    config.data.sign = sign
}

// 加密请求
export const encryptData = function (config) {
    // 测试代码
    // let aKey = "1234567890123456"
    // let originStr = "hello soil!"
    // let enStr = "Y/b+1kNLSxoHyAp+xwaH2w==";
    // let enDataStr = aesDecrypt(enStr, aKey)
    // let deDataStr = aesEncrypt(originStr, aKey)
    // console.log(enStr, enDataStr)
    // console.log(originStr, deDataStr)

    let orStr = JSON.stringify(config.data)
    let aKey = randomAesKey()
    let enData = aesEncrypt(orStr, aKey)
    config.data = {
        aKey: aKey,
        enData: enData,
        sign: CryptoJS.SHA256(orStr).toString()
    }
    // console.log(config)
}


// 随机aeskey
function randomAesKey() {
    let len = 16
    //默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
    let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    let tempLen = chars.length, tempStr = '';
    for (var i = 0; i < len; ++i) {
        tempStr += chars.charAt(Math.floor(Math.random() * tempLen));
    }
    return tempStr;
}


// export default { encryptData, decryptData, verifySign, sign }
