const express = require('express')
const router = express.Router()
const dotenv = require('dotenv');
const { body, validationResult } = require('express-validator');
const getUser = require('../middleware/getUser.js');
const sha512 = require('js-sha512');
const request = require('request');
dotenv.config();
router.post("/initiate_payment", [
    body('email', 'enter a valid email').isEmail(),
    body('phone', 'Phone no must be valid').isMobilePhone()
], async (req, res) => {
    let success = false;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, error: errors.array()[0].msg });
        }
        const data = req.body;
        const generateHash = () => {
            let hashstring = process.env.EASEBUZZ_KEY + "|" + data.txnid + "|" + data.amount + "|" + data.productinfo + "|" + data.name + "|" + data.email +
                "|" + data.udf1 + "|" + data.udf2 + "|" + data.udf3 + "|" + data.udf4 + "|" + data.udf5 + "|" + data.udf6 + "|" + data.udf7 + "|" + data.udf8 + "|" + data.udf9 + "|" + data.udf10;
            hashstring += "|" + process.env.EASEBUZZ_SALT;
            return sha512.sha512(hashstring);
        }
        const form = () => {
            return {
                'key': process.env.EASEBUZZ_KEY,
                'txnid': data.txnid,
                'amount': data.amount,
                'email': data.email,
                'phone': data.phone,
                'firstname': data.name,
                'udf1': data.udf1,
                'udf2': data.udf2,
                'udf3': data.udf3,
                'udf4': data.udf4,
                'udf5': data.udf5,
                'hash': generateHash(),
                'productinfo': data.productinfo,
                'udf6': data.udf6,
                'udf7': data.udf7,
                'udf8': data.udf8,
                'udf9': data.udf9,
                'udf10': data.udf10,
                'furl': data.furl,
                'surl': data.surl,
            }
        }
        const user = () => {
            return {
                'flat_owner_name': data.name,
                'society_name': data.society_name,
                'flat_no': data.flat_no,
                'last_paid': data.last_paid
            }
        }
        success = true;
        const savedForm = form();
        const savedUser = user();
        util_call(savedForm).then(function (response) {
            res.status(200).json({ success, savedForm, savedUser, response });
        });
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }
})

const util_call = (data) => {
    let options = {
        'method': "POST",
        'url': "https://testpay.easebuzz.in/payment/initiateLink",
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': 'csrftoken=TIkUHVU97GnvNVDbFxONUfLkxYwv09yr'
        },
        form: data,
    };
    return new Promise(function (resolve, reject) {
        request(options, function (error, response) {
            if (response) {
                let data = JSON.parse(response.body)
                return resolve(data);
            } else
                return reject(error);
        })
    })
}

router.post('/response', function (req, res) {
    function checkReverseHash(response) {
        var hashstring = process.env.EASEBUZZ_SALT + "|" + response.status + "|" + response.udf10 + "|" + response.udf9 + "|" + response.udf8 + "|" + response.udf7 +
            "|" + response.udf6 + "|" + response.udf5 + "|" + response.udf4 + "|" + response.udf3 + "|" + response.udf2 + "|" + response.udf1 + "|" +
            response.email + "|" + response.firstname + "|" + response.productinfo + "|" + response.amount + "|" + response.txnid + "|" + response.key
        hash_key = sha512.sha512(hashstring);
        if (hash_key == req.body.hash)
            return true;
        else
            return false;
    }
    if (checkReverseHash(req.body)) {
        res.status(200).json(req.body);
    }
    res.send('false, check the hash value ');
});
module.exports = router;