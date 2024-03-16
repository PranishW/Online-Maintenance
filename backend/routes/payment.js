import express from 'express';
const router = express.Router()
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';
import getUser from '../middleware/getUser.js';
import sha512 from 'js-sha512';
import fetch from 'node-fetch';
import moment from 'moment-timezone';
import Transaction from '../models/transactions.js';
import FlatOwner from '../models/flatowner.js';
import Admin from '../models/admin.js';
dotenv.config();
let payinfo = {}
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
        success = true;
        const savedForm = form();
        const response = await util_call(savedForm);
        res.status(200).json({ success, savedForm, response });
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }
})

const util_call = async (data) => {
    try {
        const response = await fetch('https://testpay.easebuzz.in/payment/initiateLink', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': 'csrftoken=TIkUHVU97GnvNVDbFxONUfLkxYwv09yr'
            },
            body: new URLSearchParams(data).toString()
        })
        const responsedata = await response.json();
        return responsedata;
    }
    catch (error) {
        throw error
    }
}

router.post('/response', (req, res) => {
    function checkReverseHash(response) {
        var hashstring = process.env.EASEBUZZ_SALT + "|" + response.status + "|" + response.udf10 + "|" + response.udf9 + "|" + response.udf8 + "|" + response.udf7 +
            "|" + response.udf6 + "|" + response.udf5 + "|" + response.udf4 + "|" + response.udf3 + "|" + response.udf2 + "|" + response.udf1 + "|" +
            response.email + "|" + response.firstname + "|" + response.productinfo + "|" + response.amount + "|" + response.txnid + "|" + response.key
        let hash_key = sha512.sha512(hashstring);
        if (hash_key == req.body.hash)
            return true;
        else
            return false;
    }
    if (checkReverseHash(req.body)) {
        payinfo = req.body
        const date = new Date();
        const ISTDate = moment(date).tz('Asia/Kolkata').format();
        payinfo.addedon = ISTDate
        res.redirect("http://localhost:3000/response")
    }
    res.send('false, check the hash value ');
});

router.get('/payinfo', async (req, res) => {
    let success = false;
    try {
        if (payinfo.status === "success") {
            let { firstname, mode, amount, easepayid, addedon, txnid, productinfo, bank_name } = payinfo
            let flat_no = productinfo.split(" ")[0]
            let society_name = productinfo.slice(productinfo.indexOf(' ') + 1)
            let transaction = await Transaction.create({
                flat_owner_name: firstname,
                transaction_mode: mode,
                easepayid: easepayid,
                transaction_date: addedon,
                transaction_id: txnid,
                society_name: society_name,
                flat_no: flat_no,
                amount: amount,
                bank_name: bank_name
            })
            let flatowner = await FlatOwner.findOne({ $and: [{ society_name: society_name }, { flat_no: flat_no }] })
            flatowner.amount_due = flatowner.amount_due - amount;
            flatowner.last_paid = addedon
            flatowner = await FlatOwner.findByIdAndUpdate(flatowner._id, { $set: flatowner }, { new: true })
            success = true;
            payinfo = {}
            res.json({ success, transaction })
        }
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error");
    }
})

// get all transactions admin
router.get("/alltransactions", getUser, async (req, res) => {
    try {
        let admin = await Admin.findById(req.user.id)
        let transactions = await Transaction.find({ society_name: admin.society_name })
        transactions.sort((a, b) => {
            if (a.transaction_date < b.transaction_date) {
                return 1;
            }
            if (a.transaction_date > b.transaction_date) {
                return -1;
            }
            return 0;
        })
        res.json(transactions)
    } catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }
})
// get single user transactions admin
router.post("/usertransactions", getUser, async (req, res) => {
    try {
        let admin = await Admin.findById(req.user.id)
        let transactions = await Transaction.find({ $and: [{ society_name: admin.society_name }, { flat_no: req.body.flat_no }] })
        transactions.sort((a, b) => {
            if (a.transaction_date < b.transaction_date) {
                return 1;
            }
            if (a.transaction_date > b.transaction_date) {
                return -1;
            }
            return 0;
        })
        res.json(transactions)
    } catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }
})

// get single user transactions flat owner
router.get("/transactions", getUser, async (req, res) => {
    try {
        let flatowner = await FlatOwner.findById(req.user.id)
        let transactions = await Transaction.find({ $and: [{ society_name: flatowner.society_name }, { flat_no: flatowner.flat_no }] })
        transactions.sort((a, b) => {
            if (a.transaction_date < b.transaction_date) {
                return 1;
            }
            if (a.transaction_date > b.transaction_date) {
                return -1;
            }
            return 0;
        })
        res.json(transactions)
    } catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }
})
export default router;