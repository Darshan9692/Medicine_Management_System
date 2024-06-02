const { Op } = require("sequelize");
const db = require("../models");
const logger = require("../utils/pino");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register
exports.register = async (req, res, next) => {
    try {

        const nullValues = Object.keys(req.body).filter((e) => { return !req.body[e] });

        if (nullValues.length > 0) return res.json(`Please fill this values : ${nullValues.join(",")}`);

        const alreadyExist = await db.sequelize.models.user.findOne({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            {
                                email: req.body.email
                            },
                            {
                                phone: req.body.phone
                            }
                        ]
                    },
                    {
                        deletedAt: null
                    }
                ]
            }
        });


        if (alreadyExist) return res.json("Email or Phone already exists");

        const activation_token = crypto.randomUUID();

        const register = await db.sequelize.models.user.create({ ...req.body, activation_token });

        return res.json({
            success: true,
            data: register.dataValues
        })

    } catch (error) {
        logger.error(error);
        return res.json({
            success: false,
            msg: "Internal server error"
        })
    }
}

//login
exports.login = async (req, res, next) => {
    try {
        // Check for null values in the request body
        const nullValues = Object.keys(req.body).filter((key) => !req.body[key]);
        if (nullValues.length > 0) {
            return res.json(`Please fill these values: ${nullValues.join(",")}`);
        }

        // Find user by email
        const user = await db.sequelize.models.user.findOne({
            where: {
                email: req.body.email,
                deletedAt: null
            }
        });

        if (!user) {
            return res.json("Invalid email or password");
        }

        // Validate password
        const passwordValidated = await bcrypt.compare(req.body.password, user.password);
        if (!passwordValidated) {
            await db.sequelize.models.login_attempt.create({
                user_id: user.id,
                status: 0
            });
            return res.json("Invalid email or password");
        }

        // Generate JWT token
        const payload = {
            id: user.id,
            email: user.email,
            role_id: user.role_id
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES
        });

        // Check if the device is already registered
        const [device, created] = await db.sequelize.models.user_device.findOrCreate({
            where: {
                user_id: user.id,
                device_name: req.body.device_name
            },
            defaults: {
                is_loggedIn: true
            }
        });

        if (!created) {
            await device.update({ is_loggedIn: true });
        }

        // Set cookie and return response
        return res.cookie("token", token, {
            maxAge: 4 * 24 * 60 * 60 * 1000, // 4 days
            httpOnly: true,
        }).json({
            success: true,
            msg: "Logged in successfully"
        });

    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
};


//logout
exports.logout = async (req, res, next) => {
    try {

        const logged_out = await db.sequelize.models.user_device.update({ is_loggedIn: false }, {
            where: {
                user_id: req.user.id
            }
        })

        return res
            .clearCookie("token")
            .json({
                success: true,
                msg: "logged out successfully"
            })

    } catch (error) {
        logger.error(error)
        return res.json({
            success: false,
            msg: "Internal server error"
        })
    }
}

//get current user profile
exports.getMyProfile = async (req, res, next) => {
    try {

        const user = await db.sequelize.models.user.findOne({
            where: {
                id: req.user.id,
            }
        });

        return res.json({
            success: true,
            msg: user.dataValues
        })

    } catch (error) {
        logger.error(error)
        return res.json({
            success: false,
            msg: "Internal server error"
        })
    }
}

//update profile
exports.updateMyProfile = async (req, res, next) => {
    try {

        const user = await db.sequelize.models.user.findOne({
            where: {
                id: req.user.id
            }
        })

        if (!user) return res.json("unable to update profile");

        Object.keys(req.body).forEach((key) => {
            user[key] = req.body[key];
        })

        await user.save();

        return res.json({
            success: true,
            msg: JSON.parse(JSON.stringify(user, null, 2))
        })

    } catch (error) {
        logger.error(error)
        return res.json({
            success: false,
            msg: "Internal server error"
        })
    }
}

//delete current user
exports.deleteMyProfile = async (req, res, next) => {
    try {

        const user = await db.sequelize.models.user.findOne({
            where: {
                id: req.user.id,
            }
        });

        const deleteUser = await user.destroy();

        return res.json({
            success: true,
            msg: "User deleted successfully"
        })


    } catch (error) {
        logger.error(error)
        return res.json({
            success: false,
            msg: "Internal server error"
        })
    }
}

//single user admin
exports.getUser = async (req, res, next) => {
    try {

        const user = await db.sequelize.models.user.findOne({
            where: {
                id: req.params.user_id,
            },
            attributes: {
                exclude: ['activation_token', 'password', 'token_created_at', 'createdAt', 'updatedAt', 'deletedAt']
            }
        });

        if (!user) return res.json("User not found");

        return res.json({
            success: true,
            msg: user.dataValues
        })

    } catch (error) {
        logger.error(error)
        return res.json({
            success: false,
            msg: "Internal server error"
        })
    }
}

//delete user admin
exports.deleteUser = async (req, res, next) => {
    try {

        const user = await db.sequelize.models.user.findOne({
            where: {
                id: req.params.user_id,
            }
        });

        if (!user) return res.json("Unable to delete user");

        const deleteUser = await user.destroy();

        return res.json({
            success: true,
            msg: "User deleted successfully"
        })


    } catch (error) {
        logger.error(error)
        return res.json({
            success: false,
            msg: "Internal server error"
        })
    }
}

//all user admin
exports.getUsers = async (req, res, next) => {
    try {

        const user = await db.sequelize.models.user.findAll({
            attributes: {
                exclude: ['activation_token', 'password', 'token_created_at', 'createdAt', 'updatedAt', 'deletedAt']
            }
        });

        return res.json({
            success: true,
            msg: JSON.parse(JSON.stringify(user, null, 2))
        })

    } catch (error) {
        logger.error(error)
        return res.json({
            success: false,
            msg: "Internal server error"
        })
    }
}

//send mail
exports.sendMail = async () => {
    try {
        let transporter = await nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'Darshanpanchal9292@gmail.com', //mailId of admin
                pass: 'tzyutbeyqlcurvzx' //in the same email id generate custom password 
            }
        });

        const info = await transporter.sendMail({
            from: 'Darshanpanchal9292@gmail.com', //Same email id used before
            to: to,
            subject: subject,
            html: html,
        });

    } catch (error) {
        logger.error(error)
        return res.json({
            success: false,
            msg: "Internal server error"
        })
    }
}