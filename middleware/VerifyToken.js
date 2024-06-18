import jwt from "jsonwebtoken";
import Users from "../models/UserModel.js";

export const verifyToken = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization;
        const token = bearerToken.split(" ")[1]
        const tokenPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // console.log(tokenPayload);
        req.user = await Users.findOne({
            where: {
                uuid: tokenPayload.userUuid
            }
        });
        console.log(req.user);

        if (!req.user) return res.status(400).json({ msg: "User tidak ditemukan pada token" })

        // console.log(req.user.uuid);
        console.log("verify token berhasil");
        next();
    } catch (err) {
        res.status(401).json({ msg: "Unauthorized: you aren't log on", data: err })
    }
}


