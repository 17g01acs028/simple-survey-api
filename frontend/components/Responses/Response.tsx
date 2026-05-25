"use client"
import { Button } from "@/components/ui/button"
import parser from 'xml2js';
import { useEffect, useState } from "react"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,

} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link";
import { DownloadIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import Loading from "./Loading";


const Response = () => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const d_url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    const [isloading, setLoading] = useState(true);
    const [response, setResponse] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [email, setEmail] = useState("");
    const [count, setCount] = useState(10);

    useEffect(() => {
        setLoading(true);
        // Fetch Questions
        fetch(`${url}/api/questions/responses?page=${page}&pageSize=${pageSize}&email=${email}`)
            .then((response) => response.text())
            .then((xmlData) => {

                // Parse the XML into a JavaScript object
                parser.parseString(xmlData, (err, result) => {
                    if (!err) {
                        setCount(result.question_responses.$.total_count);
                        // Access the parsed data, which should be similar to JSON
                        setResponse(result.question_responses.question_response);
                        setLoading(false);
                    }
                });
            })
            .catch((error) => {
                console.error('Error fetching or parsing XML:', error);
            });
    }, [page, pageSize, email]);



    function generateDownloadLink(fileName: any) {
        return `${d_url}/api/questions/response/download/${fileName}`;
    }


    function Prev() {
        setPage((pre) => pre - 1);
    }

    function Next() {
        setPage((pre) => pre + 1);
    }
    return (
        <div className="mt-[100px] flex justify-center items-center">
            <Card className="w-full sm:w-[95%] lg:w-[90%]  max-h-[calc(100vh-100px)] ">
                <CardHeader>
                    <div className="flex justify-between p-2 border rounded-lg items-center">
                        <div className="flex items-center gap-[0.2rem]">
                            Show
                            <Select onValueChange={(value) => { setPageSize(parseInt(value)); setPage(1) }} defaultValue="10">
                                <SelectTrigger className="w-[50px]">
                                    <SelectValue placeholder="10" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Entries</SelectLabel>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            Entries
                        </div>
                        <div className="flex justify-center items-center"><Label className="text-lg mr-2">Search:</Label><Input onChange={(e) => setEmail(e.target.value)} /></div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isloading ? (
                        <Loading />
                    ) : (
                        <div className="overflow-hidden my_table  max-h-[calc(100vh-290px)]">
                            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8 z-10">
                                <div className="overflow-hidden">
                                    <table className="min-w-full text-left text-sm font-light">
                                        <thead className="border-b font-medium dark:border-neutral-500">
                                            <tr>
                                                <th scope="col" className="px-6 py-4">Full Name</th>
                                                <th scope="col" className="px-6 py-4">Email</th>
                                                <th scope="col" className="px-6 py-4">Description</th>
                                                <th scope="col" className="px-6 py-4">Gender</th>
                                                <th scope="col" className="px-6 py-4">Programming_Stacks</th>
                                                <th scope="col" className="px-6 py-4">Certificates</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {response && response.map((value: any, index: any) => (
                                                <tr key={index} className="border-b dark:border-neutral-500">
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">{value.full_name}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{value.email_address}</td>
                                                    <td className="whitespace-pre-wrap px-6 py-4">{value.description}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{value.gender}</td>
                                                    <td className="whitespace-pre-wrap px-6 py-4">
                                                        {value.programming_stack.map((value: any, index: any) => {
                                                            let stringWithoutBrackets = value;
                                                            // Remove square brackets using slice
                                                            if (value.startsWith('[') && value.endsWith(']')) {
                                                                stringWithoutBrackets = value.slice(1, -1);
                                                            }


                                                            // Remove double quotes using replace
                                                            const stringWithoutQuotes = stringWithoutBrackets.replace(/"/g, '');
                                                            return (

                                                                <div key={`T1` + index}  >
                                                                    {stringWithoutQuotes}
                                                                </div>

                                                            )
                                                        })}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {value.certificates.map((value: any, index: any) => (value.certificate).map((value: any, index: any) =>
                                                        (

                                                            <div key={`T2` + index} className="border m-0.5 p-1 flex  items-center overflow-hidden" >


                                                                <p title={value} className="cursor-pointer  text-ellipsis overflow-hidden w-[100px] ...">{value}
                                                                    
                                                                </p>
                                                                <Link href={generateDownloadLink(value)} className="ml-3">
                                                                    <span><DownloadIcon /></span>
                                                                </Link>
                                                            </div>

                                                        )
                                                        ))}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}





                    {/* End of table content */}
                </CardContent>

                <CardFooter className="flex justify-between">
                    {<Button type="button" onClick={Prev} disabled={page < 2 ? true : false} >Previous</Button>}
                    {<Button variant={"outline"}>Page {page} of {`${count && Math.ceil(count / pageSize)}`}</Button>}
                    {<Button type="button" onClick={Next} disabled={page >= Math.ceil(count / pageSize) ? true : false} >Next</Button>}

                </CardFooter>
            </Card>
        </div >
    )
}

export default Response 