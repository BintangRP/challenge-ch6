import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteImg = (Path) => {
    const imagePath = path.join(__dirname, '..', 'public', 'assets', Path);

    if (fs.existsSync(imagePath)) {
        // Delete the image file
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Failed to delete image:", err);
            } else {
                console.log("Image deleted:", imagePath);
            }
        });
    } else {
        console.warn("Image file not found:", imagePath);
    }
};

export default deleteImg;