import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) return res.sendStatus(401); //unauthorize

        const user = await Users.findOne({
            where: {
                refresh_token: refreshToken
            }
        });

        console.log(user);

        if (!user) return res.sendStatus(403); // forbidden

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
            if (error) return res.sendStatus(403);
            const uuid = user.uuid;
            const name = user.name;
            const email = user.email;
            const role = user.role;
            const accessToken = jwt.sign({ uuid, name, email, role }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error.message);
    }
}