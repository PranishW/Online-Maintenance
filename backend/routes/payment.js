const express = require('express')
const router = express.Router()
const dotenv = require('dotenv');
const { body, validationResult } = require('express-validator');
const getUser = require('../middleware/getUser.js');
const sha512 = require('js-sha512');
dotenv.config();
router.post("/initiate_payment", getUser, [
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
                'amount': data.amount.toFixed(2),
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
        success = true;
        const savedForm = form();
        res.status(200).json({success,savedForm});
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }
})

module.exports = router;