const express = require('express')
const router = express.Router()
const Admin = require('../models/admin.js')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const getUser = require('../middleware/getUser.js')

// creating admin user 
router.post('/postadmin',[
    body('admin_name', 'Enter a valid name').isLength({min : 5}),
    body('mob_no', 'Enter a valid phone number').isMobilePhone(),
    body('society_name', 'Enter a valid society/apartment name').isLength({min : 3}),
    body('password','Enter a strong password').isStrongPassword({
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
    ], async (req,res)=>{
             // if there are errors, return bad requests and the errors
            let success = false;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({success,error:  errors.array()[0].msg });
            }
        try{
            let admin = await Admin.findOne({society_name:req.body.society_name})
            if (admin) {
                return res.status(400).json({success,error: "Sorry an admin from this society already exists" })
            }
            admin = await Admin.findOne({mob_no:req.body.mob_no})
            if (admin) {
                return res.status(400).json({success,error: "Sorry an admin using this phone number already exists" })
            }
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            admin = await Admin.create({
                admin_name : req.body.admin_name,
                mob_no : req.body.mob_no,
                society_name : req.body.society_name,
                password : secPass
            })
            const data = {
                user: {
                    id: admin.id
                }
            }
            const authtoken = jwt.sign(data, process.env.JWT_SECRET);
            success = true;
            res.json({ success,authtoken });
        }
        catch(error)
        {
            console.error(error.message)
            res.status(500).json("Internal Server Error"); // sending to user 
        }
})

// editing admin details
router.put("/editadmin",getUser,[
    body('admin_name', 'Enter a valid name').isLength({min : 5}),
    body('mob_no', 'Enter a valid phone number').isMobilePhone(),
    body('password','Enter a strong password').isStrongPassword({
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
    ],async (req,res)=>{
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success,error:  errors.array()[0].msg });
        }
        try{
            let admin = await Admin.findOne({mob_no:req.body.mob_no})
            if (admin) {
                return res.status(400).json({success,error: "Sorry an admin using this phone number already exists" })
            }
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            const adminid = req.user.id
            const newadmin = {
                admin_name : req.body.admin_name,
                mob_no : req.body.mob_no,
                password : secPass
            }
            admin = await Admin.findByIdAndUpdate(adminid,{$set: newadmin},{new : true})
            success = true;
            res.json({ success,admin });
        }
        catch(error)
        {
            console.error(error.message)
            res.status(500).json("Internal Server Error"); // sending to user 
        }
})

module.exports = router;