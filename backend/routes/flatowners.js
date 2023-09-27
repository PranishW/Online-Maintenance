const express = require('express')
const router = express.Router()
const Admin = require('../models/admin.js')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const getUser = require('../middleware/getUser.js');
const FlatOwner = require('../models/flatowner.js');

// login flat owner
router.post("/login", async (req, res) => {
    let success = false;
    try {
        let flatowner = await FlatOwner.findOne({ $and: [{ society_name: req.body.society_name }, { flat_no: req.body.flat_no }] })
        if (!flatowner) {
            return res.status(400).json({ error: 'Invalid Login credentials' })
        }
        const passwordcompare = await bcrypt.compare(req.body.password, flatowner.password)
        if (!passwordcompare) {
            return res.status(400).json({ error: 'Invalid Login Credentials' })
        }
        const data = {
            user: {
                id: flatowner.id
            }
        }
        const authtoken = jwt.sign(data, process.env.JWT_SECRET);
        success = true;
        res.json({ success, authtoken });
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }
})

// update flat owner details
router.put("/editdata", getUser, async (req, res) => {
    let success = false;
    try {
        const userid = req.user.id
        const newuser = req.body
        let flatowner = await FlatOwner.findByIdAndUpdate(userid, { $set: newuser }, { new: true })
        success = true;
        res.json({ success, flatowner });
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }
})

// change flat owner password
router.put("/changepassword", getUser, [
    body('password', 'Enter a strong password').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
        pointsPerUnique: 1,
        pointsPerRepeat: 0.5,
        pointsForContainingLower: 10,
        pointsForContainingUpper: 10,
        pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10,
    })
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: errors.array()[0].msg });
    }
    try {
        const userid = req.user.id
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        const newuser = {
            password: secPass
        }
        const user = await FlatOwner.findByIdAndUpdate(userid, { $set: newuser }, { new: true })
        success = true;
        res.json({ success, user });
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }
})

// get user details
router.get("/getuser", getUser, async (req, res) => {
    try {
        let userid = req.user.id;
        const flatowner = await FlatOwner.findById(userid).select("-password");
        res.json(flatowner)
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }
})

// get maintenance fees ,search by flat owner name, flat no, society name
router.post("/getmaintenance", async (req, res) => {
    try {
        let flatowner = await FlatOwner.findOne({ $and: [{ society_name: req.body.society_name }, { flat_owner_name: req.body.flat_owner_name }, { flat_no: req.body.flat_no }] }).select("-password");
        if(!flatowner)
        {
            return res.status(400).json({ error : "No results found!!"})
        }
        res.json(flatowner)
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }
})

module.exports = router