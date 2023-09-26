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
router.post("/login", [
    body('society_name', 'Society Name is required'),
    body('flat_no','Flat no is required'),
    body('password', 'Password is required')
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: errors.array()[0].msg });
    }
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
router.put("/editdata", getUser, [
    body('flat_owner_name', 'Enter a valid name (Mr/Mrs/Dr. FirstName Lastname)').isLength({ min: 5 }),
    body('mob_no', 'Enter a valid phone number').isMobilePhone(),
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
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        const userid = req.user.id
        const newuser = {
            flat_owner_name : req.body.flat_owner_name,
            mob_no: req.body.mob_no,
            password: secPass
        }
        let flatowner = await FlatOwner.findByIdAndUpdate(userid, { $set: newuser }, { new: true })
        success = true;
        res.json({ success, flatowner });
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }
})

module.exports = router