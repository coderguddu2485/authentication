const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerUser = async (req, res) => {
    try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill all fields"
        });
    }

    const existingUser = await User.findOne({ email });

    if(existingUser){
        return res.status(409).json({
            success: false,
            message: "User already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user in MongoDB
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    return res.status(201).json({
        success: true,
        message: "User Registered Successfully"
    });
} catch(error){
    console.error("Error in registerUser:", error.message);
    return res.status(500).json({
        success: false,
        message: "Server Error"
    });
}
};

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );


        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.userId);
        
        if (!user) {    
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile
};