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
import { Eye, Trash } from "lucide-react";
import { deleteDocumentByID, getAllFile } from "../../api/File"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UploadFileData from "./Uppload";

const Home = () => {
    const queryClient = useQueryClient();

    const fetchAllFile = async () => {
        try {
            const response = await getAllFile();
            return response.files;
        } catch (error) {
            console.log(error);
        }
    }

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
        },
    })

    const { data, isLoading, isError } = useQuery({
        queryKey: ["getAllFileData"],
        queryFn: fetchAllFile,
    })

    if (isLoading) return <div>Loading...</div>

    if (isError) return <div>Error</div>

    return (
        <>
            <div className="flex justify-between p-10">
                <div>
                    <div>
                        <h1 className="text-3xl font-bold">INI8 Labs.</h1>
                    </div>
                    <div>
                        <UploadFileData />
                    </div>
                </div>
                <Table>
                    <TableCaption>A list of your Documents.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Id</TableHead>
                            <TableHead> Doc Name</TableHead>
                            <TableHead>Doc Size</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.map(file => (
                            <TableRow key={file.id}>
                                <TableCell className="font-medium">{file.id} </TableCell>
                                <TableCell>{file.filename}</TableCell>
                                <TableCell>{file.filesize}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" onClick={() => getDocumentByID(file.id)}>
                                        <Eye />
                                    </Button>
                                    <Button variant="destructive" onClick={() => deleteMutation.mutate(file.id)}>
                                        <Trash />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

export default Home;