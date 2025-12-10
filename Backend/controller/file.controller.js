
import multer from "multer";
import fs from "fs"
import sql from "../database.js";


if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
})

export const upload = multer({ storage: storage });

export async function uploadDocument(req, res) {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "File is required"
            })
        }
        const file = req.file;

        const filename = file.originalname;
        const savedName = file.filename;
        const filepath = `uploads/${savedName}`;
        const filesize = file.size;

        const result = await sql`
            INSERT INTO files (filename, filepath, filesize)
            VALUES (${filename}, ${filepath}, ${filesize})
            RETURNING *
        `;

        return res.status(200).json({
            message: "File uploaded successfully",
            file: result[0]
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export async function getAllFile(req, res) {
    try {
        const files = await sql`SELECT * FROM files ORDER BY id DESC`

        if (!files) {
            return res.status(404).json({
                message: "Files not found"
            })
        }

        return res.status(200).json({
            message: "Files found",
            files
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }

}

export async function getDocumentByID(req, res) {
    try {
        const fileId = req.params.id;
        const file = await sql`SELECT * FROM files WHERE id = ${fileId}`;

        if (!file) {
            return res.status(404).json({
                message: "File not found"
            })
        }

        return res.status(200).json({
            message: "File found",
            file
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export async function deleteDocumentByID(req, res) {
    try {
        const fileId = req.params.id;

        if (!fileId) {
            return res.status(400).json({
                message: "File ID is required"
            })
        }

        const file = await sql`DELETE FROM files WHERE id = ${fileId}`;

        if (!file) {
            return res.status(404).json({
                message: "File not found"
            })
        }

        return res.status(200).json({
            message: "File deleted",
            file
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}
