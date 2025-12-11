import { useMutation } from "@tanstack/react-query";
import { downloadDocumentByID } from "../../api/File";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import toast from "react-hot-toast";


import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const DownloadFile = ({ file }) => {

    const downloadFile = async (id) => {
        const response = await downloadDocumentByID(id);

        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = fileURL;

        link.download = "document.pdf";

        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const downloadMutation = useMutation({
        mutationFn: downloadFile,
        onSuccess: () => {
            toast.success("Document downloaded successfully");
        },
        onError: () => {
            toast.error("Document downloaded failed");
        }
    })
    return (
        <div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button className="rounded-xl" variant="outline" onClick={() => downloadMutation.mutate(file.id)}>
                            <Download className="w-5 text-blue-500 h-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="italic font-semibold text-blue-500">Download Document in pdf format</p>
                    </TooltipContent>
                </Tooltip>

            </TooltipProvider>


        </div>
    )
}

export default DownloadFile