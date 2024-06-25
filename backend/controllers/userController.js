import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt';
import validator from 'validator';
import bodyParser from 'body-parser';
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '23h' });
};

const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    console.log("Received registration request", req.body); // Log request data

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email' });
        }
        if (password.length < 5) {
            return res.json({ success: false, message: 'Please enter a stronger password' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashPassword,
        });

        await newUser.save();
        const token = createToken(newUser._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error occurred while registering user' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }
        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error occurred while logging in user' });
    }
};
export {
    loginUser,
    registerUser
}