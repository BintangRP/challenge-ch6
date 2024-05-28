import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Users from "../models/UserModel.js";
import { getUserByUuid } from "../helper/userById.js";


export const getAllUsers = async (req, res) => {
    try {
        const response = await Users.findAll({
            attributes: [
                'uuid', 'name', 'email', 'role'
            ]
        });
        res.status(200).json({ data: response })
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const Register = async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, password, confPassword, role } = req.body;
        // console.log(req.body);

        if (password != confPassword) return res.status(400).json({ message: "Password tidak sesuai" });

        const salt = await bcrypt.genSaltSync();
        const hashPassword = await bcrypt.hashSync(password, salt);


        try {
            const response = await Users.create({
                name: name,
                email: email,
                password: hashPassword,
                role: role
            });

            return res.status(201).json({ msg: "Users created successfully", data: response })
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateUser = async (req, res) => {

    try {
        // const user = getUserByUuid(req.user.uuid);
        const user = await Users.findOne({
            where: {
                uuid: req.params.uuid
            }
        });

        if (!user) return res.status(401).json({ msg: "User tidak ditemukan" });

        const { name, email, password, confPassword, role } = req.body;

        if (user.role == 'admin' && req.body.role == 'superadmin') return res.status(401).json({ msg: "Access denied" });
        if (user.role == 'member' && (req.body.role == 'superadmin' || req.body.role == 'admin')) return res.status(401).json({ msg: "Access denied" });

        if (password != confPassword) return res.status(400).json({ message: "Password tidak sesuai" });

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        // Update user in the database
        await Users.update(
            {
                name: name,
                email: email,
                password: hashPassword,
                role: role,
            },
            {
                where: {
                    uuid: user.uuid,
                },
            }
        );

        res.status(200).json({ msg: "User Updated", data: user });

    } catch (error) {
        res.status(400).json({ msg: "error", data: error.message });
    }

};

export const deleteUser = async (req, res) => {
    console.log(req.params);
    const user = await Users.findOne({
        where: {
            uuid: req.params.uuid
        }
    });

    if (!user) return res.status(404).json({ msg: "User not found" });
    if (req.user.role != 'superadmin') return res.status(401).json({ msg: "Access denied" });

    try {
        const response = await Users.destroy({
            where: {
                uuid: user.uuid,
            },
        });
        res.status(200).json({ msg: "User Deleted", data: response });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const Login = async (req, res) => {
    try {

        const user = await Users.findOne({
            where: {
                email: req.body.email,
            }
        });

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(400).json({ msg: "Wrong password.." })


        const userUuid = user.uuid;
        const name = user.name;
        const email = user.email;
        const role = user.role;

        req.userUuid = user.uuid;

        const accessToken = jwt.sign({ userUuid, name, email, role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d'
        })
        const refreshToken = jwt.sign({ userUuid, name, email, role }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        await Users.update({ refresh_token: refreshToken }, {
            where: {
                uuid: userUuid
            }
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        })
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        })

        res.status(200).json({ userUuid, name, email, role, accessToken, refreshToken });

    } catch (error) {
        res.status(404).json({ msg: error.message })
    }
}

export const Me = async (req, res) => {
    console.log("My uuid: ", req.user.uuid);
    const user = await Users.findOne({
        attributes: ['uuid', 'name', 'email', 'role', 'refresh_token'],
        where: {
            uuid: req.user.uuid
        }
    });

    if (!user) return res.status(404).json({ msg: 'user tidak ditemukan...' });

    res.status(200).json({ data: user });
};


export const Logout = async (req, res) => {
    console.log("uuid logout", req.user.uuid);
    try {
        const user = await Users.findOne({
            where: {
                uuid: req.user.uuid
            }
        });

        if (!user) return res.sendStatus(204); // 204: no content

        const userUuid = user.uuid;
        await Users.update({ refresh_token: null }, {
            where: {
                uuid: userUuid
            }
        });
        res.clearCookie('refreshToken');
        log(req.user);
        return res.status(200).json({ msg: "logout berhasil" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}