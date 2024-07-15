const express = require('express');
const bcrypt  = require('bcrypt');
const jwt = require('jwtwebtoken');
const User = require('../models/Users');

const router = express.Router();

//Register

router.post('/register', async(req, res)=>{
    const {name,email,password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);

    try{
        const user = new User({name, email, passward:hashedPassword});
        await user.save();
        res.status(201).send('User Registered');
    }catch{
        res.status(400).send('error registered user');
    }

})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).send('Error logging in');
    }
});

module.exports = router;