const express = require('express')
const router = express.Router()
const Admin = require('../models/admin.js')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const getUser = require('../middleware/getUser.js');
const FlatOwner = require('../models/flatowner.js');

// creating admin user 
router.post('/postadmin', [
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
    // if there are errors, return bad requests and the errors
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: errors.array()[0].msg });
    }
    try {
        let admin = await Admin.findOne({ society_name: req.body.society_name })
        if (admin) {
            return res.status(400).json({ success, error: "Sorry an admin from this society already exists" })
        }
        admin = await Admin.findOne({ mob_no: req.body.mob_no })
        if (admin) {
            return res.status(400).json({ success, error: "Sorry an admin using this phone number already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        admin = await Admin.create({
            admin_name: req.body.admin_name,
            mob_no: req.body.mob_no,
            society_name: req.body.society_name,
            per_month_maintenance : req.body.per_month_maintenance,
            password: secPass
        })
        success = true;
        res.json({ success, admin })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }
})

//admin login
router.post("/adminlogin", async (req, res) => {
    let success = false;
    try {
        let admin = await Admin.findOne({ society_name: req.body.society_name });
        if (!admin) {
            return res.status(400).json({ error: 'Invalid Login credentials' })
        }
        const passwordcompare = await bcrypt.compare(req.body.password, admin.password)
        if (!passwordcompare) {
            return res.status(400).json({ error: 'Invalid Login Credentials' })
        }
        const data = {
            user: {
                id: admin.id
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

// editing admin details
router.patch("/editadmin", getUser, async (req, res) => {
    let success = false;
    try {
        let admin = await Admin.findOne({ mob_no: req.body.mob_no })
        if (admin) {
            return res.status(400).json({ success, error: "Sorry an admin using this phone number already exists" })
        }
        const adminid = req.user.id
        const newadmin = req.body
        admin = await Admin.findByIdAndUpdate(adminid, { $set: newadmin }, { new: true })
        success = true;
        res.json({ success, admin });
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }
})

// change admin password
router.put("/editadminpassword", getUser, [
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
        const adminid = req.user.id
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        const newadmin = {
            password: secPass
        }
        const admin = await Admin.findByIdAndUpdate(adminid, { $set: newadmin }, { new: true })
        success = true;
        res.json({ success, admin });
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }
})

// adding flat owner details by admin
router.post('/addflatowner', getUser, async (req, res) => {
    let success = false;
    try {
        const admin = await Admin.findById(req.user.id)
        let flatowner = await FlatOwner.findOne({ $and: [{ society_name: admin.society_name }, { flat_no: req.body.flat_no }] })
        if (flatowner) {
            return res.status(400).json({ success, error: "This flat number is already registered" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        const temp = {
            flat_owner_name: req.body.flat_owner_name,
            flat_no: req.body.flat_no,
            society_name: admin.society_name,
            amount_due: req.body.amount_due,
            last_paid: req.body.last_paid,
            password: secPass
        }
        flatowner = await FlatOwner.create(temp)
        success = true;
        res.json({ success, flatowner })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }
})

// get admin details
router.get("/getadmin", getUser, async (req, res) => {
    try {
        let adminid = req.user.id;
        const admin = await Admin.findById(adminid).select("-password");
        res.json( admin )
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }
})

// get all flat owners living in same society by admin
router.get("/getflatowners", getUser, async(req,res) =>{
    try {
        const admin = await Admin.findById(req.user.id)
        const flatowners = await FlatOwner.find({society_name : admin.society_name}).select("-password")
        res.json( flatowners )
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json("Internal Server Error"); // sending to user 
    }
})

module.exports = router;