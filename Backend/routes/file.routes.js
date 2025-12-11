import express from "express";
import { deleteDocumentByID, downloadDocumentByID, getAllFile, getDocumentByID, upload, uploadDocument } from "../controller/file.controller.js";

const router = express.Router();

router.route("/documents/upload").post(upload.single("file"), uploadDocument);

router.route("/documents").get(getAllFile);

router.route("/documents/:id").get(getDocumentByID);

router.route("/documents/delete/:id").delete(deleteDocumentByID);

router.route("/documents/downloads/:id").get(downloadDocumentByID);

export default router;