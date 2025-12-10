
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { uploadDocument } from "../../api/File"
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const UploadFileData = () => {

    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState("");

    const queryClient = useQueryClient();

    const uploadFile = async ({ file, fileName }) => {
        console.log("uploadFile called with:", { file, fileName });
        try {
            return await uploadDocument(file, { filename: fileName });
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const uploadMutation = useMutation({
        mutationFn: uploadFile,
        onSuccess: () => {
            console.log("Upload successful");
            queryClient.invalidateQueries({ queryKey: ["getAllFileData"] });
        },
        onError: (error) => {
            console.error("Upload failed in mutation:", error);
        }
    });

    const handleUpload = (e) => {
        e.preventDefault();
        console.log("handleUpload triggered");

        if (!file) {
            alert("Please select a file");
            return;
        }

        console.log("Calling mutation with:", { file, fileName });
        uploadMutation.mutate({ file, fileName });
    };


    return (
        <>
            <form action="">

                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Document Name</Label>
                        <Input
                            type="text"
                            onChange={(e) => setFileName(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Document</Label>
                        <Input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </div>
                </div>
                <button onClick={handleUpload}>
                    Submit
                </button>
            </form>
            {/* <Dialog>
                <form onSubmit={handleUpload}>
                    <DialogTrigger asChild>
                        <Button variant="outline">Upload document</Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Enter document details</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label>Document Name</Label>
                                <Input
                                    type="text"
                                    onChange={(e) => setFileName(e.target.value)}
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label>Document</Label>
                                <Input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>

                            <Button type="submit" disabled={uploadMutation.isPending}>
                                {uploadMutation.isPending ? "Uploading..." : "Upload Document"}
                            </Button>
                        </DialogFooter>

                    </DialogContent>
                </form>
            </Dialog> */}

        </>
    )
}

export default UploadFileData;