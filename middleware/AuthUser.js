import { where } from "sequelize";
import { Users } from "../models/UserModel.js";

// middleware verifikasi authentication user
export const verifyUser = async (req, res, next) => {
    const user = await Users.findOne({
        where: {
            uuid: req.user.uuid
        }
    });

    if (!user) return res.status(404).json({ msg: 'user tidak ditemukan' });
    req.userUuid = user.uuid;
    req.role = user.role;

    next();
}

// middleware verifikasi hanya admin
export const adminOnly = async (req, res, next) => {

    const user = await Users.findOne({
        where: {
            uuid: req.user.uuid
        }
    });

    if (user.role !== 'admin') return res.status(403).json({ msg: 'access denied' });
    if (!user) return res.status(404).json({ msg: 'user tidak ditemukan' });

    next();
}

// middleware verifikasi admin and super admin only
export const adminSuperAdminOnly = async (req, res, next) => {

    const user = await Users.findOne({
        where: {
            uuid: req.user.uuid
        }
    });

    if (!user) return res.status(404).json({ msg: 'user tidak ditemukan' });
    if (user.role !== 'superadmin' && user.role !== 'admin') return res.status(403).json({ msg: 'access denied' });

    next();
}



// middleware verifikasi super admin only
export const superAdminOnly = async (req, res, next) => {

    const user = await Users.findOne({
        where: {
            uuid: req.body.userUuid
        }
    });

    if (user.role !== 'superadmin') return res.status(403).json({ msg: 'access denied' });
    if (!user) return res.status(404).json({ msg: 'user tidak ditemukan' });

    next();
}

