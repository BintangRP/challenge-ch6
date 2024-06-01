import deleteImg from "../helper/saveImg.js";
import { getUserByUuid } from "../helper/userById.js";
import { Cars } from "../models/CarModel.js";
import { Users } from "../models/UserModel.js";
import { Op, where } from "sequelize";
import path from "path";
import fs from "fs";



const saveImg = (image) => {
    if (!image || !image.name || !image.data) {
        throw new Error("Invalid image object");
    }

    const imgPath = path.join(__dirname, "../public/assets", image.name);
    fs.writeFileSync(imgPath, image.data);
    return `../public/assets/${image.name}`;
};

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const getCars = async (req, res) => {
    try {
        let response;
        if (req.role == 'superadmin' || req.role == 'admin') {
            response = await Cars.findAll({
                attributes: ['uuid', 'name', 'price', 'img', 'size', 'createdBy', 'updatedBy', 'deletedBy', 'is_deleted'],
                include: [
                    {
                        model: Users,
                        as: "createdByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["uuid", "name", "email", "role"],
                    },
                    {
                        model: Users,
                        as: "updatedByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["uuid", "name", "email", "role"],
                    },
                    {
                        model: Users,
                        as: "deletedByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["uuid", "name", "email", "role"],
                    },
                ],
            });
        } else {
            response = await Cars.findAll({
                attributes: ['uuid', 'name', 'price', 'img', 'size'],
                where: {
                    userUuid: req.userUuid,
                    is_deleted: 0
                },
                include: [
                    {
                        model: Users,
                        as: "createdByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["name", "email", "role"],
                    },
                    {
                        model: Users,
                        as: "updatedByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["name", "email", "role"],
                    },
                    {
                        model: Users,
                        as: "deletedByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["name", "email", "role"],
                    },
                ],
            });
        }
        res.status(200).json({ msg: "Fetched data", data: response });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getCarByUuid = async (req, res) => {
    try {
        getUserByUuid(req.user.uuid);

        const car = await Cars.findOne({
            where: {
                uuid: req.params.uuid
            }
        });

        if (!car) return res.status(404).json({ msg: "Data tidak ditemukan" });

        if (car.is_deleted == 1) return res.status(404).json({ msg: "Data tidak ditemukan", data: car });

        let response;
        if (req.role === 'superadmin' || req.role === 'admin') {
            response = await Cars.findOne({
                attributes: ['uuid', 'name', 'price', 'img', 'size', 'createdBy', 'updatedBy', 'deletedBy', 'is_deleted'],
                where: {
                    uuid: car.uuid
                },
                include: [
                    {
                        model: Users,
                        as: "createdByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["uuid", "name", "email", "role"],
                    },
                    {
                        model: Users,
                        as: "updatedByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["uuid", "name", "email", "role"],
                    },
                    {
                        model: Users,
                        as: "deletedByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["uuid", "name", "email", "role"],
                    },
                ],
            });
        } else {
            response = await Cars.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    [Op.and]: [{ id: product.id }, { userUuid: req.user.uuid }]
                },
                include: [
                    {
                        model: Users,
                        as: "createdByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["name", "email", "role"],
                    },
                    {
                        model: Users,
                        as: "updatedByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["name", "email", "role"],
                    },
                    {
                        model: Users,
                        as: "deletedByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["name", "email", "role"],
                    },
                ],
            });
        }
        res.status(200).json({ data: response });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createCar = async (req, res) => {

    const { name, price, size } = req.body;
    const img = req.file ? req.file.path : '';

    try {
        const response = await Cars.create({
            name: name,
            price: price,
            size: size,
            img: img,
            userUuid: req.user.uuid,
            createdBy: req.user.uuid,
            is_deleted: 0,
        });

        res.status(201).json({ msg: "Car created successfully", data: response });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const updateCar = async (req, res) => {
    try {
        const car = await Cars.findOne({
            where: {
                uuid: req.params.uuid
            }
        });
        if (!car) return res.status(404).json({ msg: "Data mobil tidak ditemukan" });

        if (car.is_deleted == 1) return res.status(404).json({ msg: "Data sudah dihapus", data: car });

        console.log(req.body);
        const { name, price, size } = req.body;
        const img = req.file ? req.file.path : req.body.oldImg;

        let response;
        if (req.role === 'superadmin' || req.role === 'admin') {
            // console.log("super admin atau admin");

            await Cars.update({
                name: name,
                price: price,
                size: size,
                img: img,
                updatedBy: req.user.uuid
            }, {
                where: {
                    uuid: car.uuid,
                }
            });

            response = await Cars.findOne({
                attributes: ['uuid', 'name', 'price', 'img', 'size', 'createdBy', 'updatedBy', 'deletedBy'],
                where: {
                    uuid: car.uuid
                },
                include: [
                    {
                        model: Users,
                        as: "createdByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["uuid", "name", "email", "role"],
                    },
                    {
                        model: Users,
                        as: "updatedByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["uuid", "name", "email", "role"],
                    },
                    {
                        model: Users,
                        as: "deletedByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["uuid", "name", "email", "role"],
                    },
                ],
            });

        } else {
            // console.log("member");

            if (req.user.uuid !== car.userUuid) return res.status(403).json({ msg: "Car tidak ditemukan" });

            await Cars.update({
                name: name,
                price: price,
                size: size,
                img: img,
                updatedBy: req.user.uuid,
            }, {
                where: {
                    [Op.and]: [{ uuid: car.uuid }, { userUuid: req.user.uuid }]
                }
            });

            response = await Cars.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    [Op.and]: [{ id: product.id }, { userUuid: req.user.uuid }]
                },
                include: [
                    {
                        model: Users,
                        as: "createdByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["name", "email", "role"],
                    },
                    {
                        model: Users,
                        as: "updatedByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["name", "email", "role"],
                    },
                    {
                        model: Users,
                        as: "deletedByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["name", "email", "role"],
                    },
                ],
            });

        }
        res.status(200).json({ msg: "Car updated successfully", data: response });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const deleteCar = async (req, res) => {
    try {
        const car = await Cars.findOne({
            where: {
                uuid: req.params.uuid
            }
        });

        if (!car) return res.status(404).json({ msg: "Car tidak ditemukan" });

        deleteImg(car.img);

        let response;
        if (req.role === 'admin' || req.role === 'superadmin') {

            await Cars.update({ deletedBy: req.user.uuid, is_deleted: 1 }, {
                where: {
                    uuid: car.uuid,
                }
            });

            response = await Cars.findOne({
                attributes: ['uuid', 'name', 'price', 'img', 'size', 'createdBy', 'updatedBy', 'deletedBy'],
                where: {
                    uuid: car.uuid
                },
                include: [
                    {
                        model: Users,
                        as: "createdByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["uuid", "name", "email", "role"],
                    },
                    {
                        model: Users,
                        as: "updatedByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["uuid", "name", "email", "role"],
                    },
                    {
                        model: Users,
                        as: "deletedByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["uuid", "name", "email", "role"],
                    },
                ],
            });

        } else {
            if (req.user.uuid !== car.userUuid) return res.status(403).json({ msg: "access denied" });

            await Cars.update({ deletedBy: req.user.uuid, is_deleted: 1 }, {
                where: {
                    [Op.and]: [{ uuid: car.uuid }, { userUuid: req.user.uuid }]
                }
            });

            response = await Cars.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    [Op.and]: [{ id: product.id }, { userUuid: req.user.uuid }]
                },
                include: [
                    {
                        model: Users,
                        as: "createdByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["name", "email", "role"],
                    },
                    {
                        model: Users,
                        as: "updatedByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["name", "email", "role"],
                    },
                    {
                        model: Users,
                        as: "deletedByUser", // Gunakan alias yang telah ditentukan
                        attributes: ["name", "email", "role"],
                    },
                ],
            });
        }
        res.status(200).json({ msg: "Car deleted successfully", data: response });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}