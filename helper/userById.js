import Users from "../models/UserModel.js";

// get user by id
export const getUserByUuid = async (userUuid) => {
    try {
        await Users.findOne({
            where: {
                uuid: userUuid,
            }
        });

    } catch (error) {
        console.log(error.message);
    }
};
