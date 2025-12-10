import axios from "axios";

export const BASE_URL = "http://localhost:8000/api/v1/files";


export async function uploadDocument(file, values) {
    try {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("filename", values.filename);
        formData.append("filesize", file.size);

        const response = await axios.post(`${BASE_URL}/documents/upload`,
            formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.table(response);

        return response.data;

    } catch (error) {
        throw new Error(error);
    }

}

export async function getAllFile() {
    try {
        const response = await axios.get(`${BASE_URL}/documents`);

        return response.data;
    } catch (error) {

        throw new Error(error);
    }

}

export async function getDocumentByID(id) {
    try {
        const response = await axios.get(`${BASE_URL}/documents/${id}`);

        return response.data;
    } catch (error) {

        throw new Error(error);
    }

}


export async function deleteDocumentByID(id) {
    try {
        const response = await axios.delete(`${BASE_URL}/documents/delete/${id}`);

        return response.data;
    } catch (error) {

        throw new Error(error);
    }

}