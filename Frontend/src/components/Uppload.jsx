import { uploadDocument } from "../../api/File"
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import toast from "react-hot-toast";
import { UploadCloud } from "lucide-react";

const UploadFileData = ({ closeDialog }) => {

    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState("");

    const queryClient = useQueryClient();

    const uploadFile = async ({ file, fileName }) => {
        return await uploadDocument(file, { filename: fileName });
    };


    const uploadMutation = useMutation({
        mutationFn: uploadFile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getAllFileData"] });
            toast.success("Document uploaded successfully");
            closeDialog();
        },
        onError: (error) => {
            toast.error("Document uploaded failed");
        }
    });

    const handleUpload = (e) => {
        e.preventDefault();

        if (!file) {
            toast.error("Please select a file");
            return;
        }

        uploadMutation.mutate({ file, fileName });
    };


    return (
        <>
            <form
                onSubmit={handleUpload}
                className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto space-y-6"
            >
                <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Document Name</Label>
                    <Input
                        type="text"
                        placeholder="Enter document name"
                        onChange={(e) => setFileName(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Document</Label>
                    <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 border border-blue-300 rounded-md cursor-pointer hover:bg-blue-100 transition"
                    >
                        <UploadCloud className="w-5 h-5 text-blue-500" />
                        <span className="text-blue-700 font-medium">Choose File</span>
                    </label>
                    <Input
                        type="file"
                        id="file-upload"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                            const selectedFile = e.target.files[0];
                            if (selectedFile && selectedFile.type !== "application/pdf") {
                                toast.error("Only PDF files are allowed!");
                                e.target.value = ""; // clear input
                                return;
                            }
                            setFile(selectedFile);
                        }}
                    />
                    {file && <p className="text-gray-600 text-sm mt-1">{file.name}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition"
                >
                    <UploadCloud className="w-5 h-5" />
                    Submit
                </button>
            </form>

        </>
    )
}

export default UploadFileData;