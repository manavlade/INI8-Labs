import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "./ui/button";
import { Trash, UploadCloud } from "lucide-react";
import { deleteDocumentByID, getAllFile } from "../../api/File"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UploadFileData from "./Uppload";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import toast from "react-hot-toast";
import { useState } from "react";
import { Separator } from "./ui/separator";
import DownloadFile from "./downloadFile";
import { Skeleton } from "./ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

import tablebg from "../../public/health.jpg";

const fetchAllFile = async () => {
    try {
        const response = await getAllFile();
        toast.success("Document fetched successfully");
        return response.files;
    } catch (error) {
        console.log(error);
        toast.error("Document fetched failed");
    }
}

const Home = () => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const deleteFile = async (id) => {
        try {
            const response = await deleteDocumentByID(id);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    const deleteMutation = useMutation({
        mutationFn: deleteFile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getAllFileData"] });
            toast.success("Document deleted successfully");
        },
        onError: () => {
            toast.error("Document deleted failed");
        }
    })


    const { data, isLoading, isError } = useQuery({
        queryKey: ["getAllFileData"],
        queryFn: fetchAllFile,
        refetchOnWindowFocus: false,
        staleTime: 60 * 60 * 1000,
    })


    return (
        <>
            <Separator />
           <div className="flex items-center justify-between p-10 py-5 border border-black rounded-lg 
                bg-gradient-to-r from-blue-500 via-blue-700 to-purple-800">

                <div>
                    <h1 className="text-3xl italic font-bold">INI8 Labs.</h1>
                </div>
                <div className="max-w-md mt-6">
                    <AlertDialog open={open} onOpenChange={setOpen}>

                        <AlertDialogTrigger
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 
           bg-gradient-to-r from-purple-600 to-blue-500 
           hover:from-purple-700 hover:to-blue-600 
           text-white font-semibold rounded-lg shadow-md transition"

                        >
                            <UploadCloud className="w-5 h-5" />
                            Upload Documents
                        </AlertDialogTrigger>

                        <AlertDialogContent className="bg-white rounded-xl shadow-xl p-6 border border-gray-200 max-w-lg mx-auto mt-4">
                            <AlertDialogHeader className="space-y-2">
                                <AlertDialogTitle className="text-xl font-bold text-gray-800">
                                    Store your Documents on Cloud
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    <UploadFileData closeDialog={() => setOpen(false)} />
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
            <Separator />
            <div className="flex p-7">
                <div
                    className="relative p-4 rounded-xl overflow-hidden w-full"
                    style={{
                        backgroundImage: `url(${tablebg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-lg"></div>

                    <div className="relative">
                        <Table
                            className="border border-black" >
                            <TableCaption>A list of your Documents.</TableCaption>
                            <TableHeader>
                                <TableRow className="">
                                    <TableHead className="w-[100px] font-bold text-xl italic">Id</TableHead>
                                    <TableHead className="font-bold text-xl italic"> Doc Name</TableHead>
                                    <TableHead className="font-bold text-xl italic">Doc Size (bytes)</TableHead>
                                    <TableHead className="font-bold text-xl italic">Uploaded On</TableHead>
                                    <TableHead className=" font-bold text-xl italic">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <Separator />
                            <TableBody>
                                {isLoading || isError ? (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <Skeleton className="h-10 w-full" />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data?.map(file => (
                                        <TableRow key={file.id}>
                                            <TableCell className="font-medium text-lg">{file.id} </TableCell>
                                            <TableCell className="text-lg">{file.filename}</TableCell>
                                            <TableCell className="text-lg">{file.filesize}</TableCell>
                                            <TableCell className="text-lg"> {new Date(file.created_at).toLocaleString()} </TableCell>
                                            <TableCell className="text-right">
                                                <div className=" flex items-center gap-5" >

                                                    <DownloadFile file={file} />

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button className="rounded-xl" variant="outline" onClick={() => deleteMutation.mutate(file.id)}>
                                                                    <Trash className="text-red-500" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="italic font-semibold text-red-500">Once Document is deleted it can not be restored</p>
                                                            </TooltipContent>
                                                        </Tooltip>

                                                    </TooltipProvider>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Home;