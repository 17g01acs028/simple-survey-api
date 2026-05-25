import React from "react";
import { Label } from "../ui/label";

export default function Modal({ message, title }: any) {

    return (

        <>
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full dark:bg-slate-600 bg-slate-200 outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                                {title}
                            </h4>
                        </div>
                        {/*body*/}
                        <div className="relative p-6 flex items-center justify-center">
                            <Label className="my-4  text-lg leading-relaxed text-muted-foreground">
                                {message}
                            </Label>
                            <div className="flex space-x-1 p-3 rounded-full justify-center items-center">
                                <div className="bg-blue-600 p-1  w-2 h-2 rounded-full animate-bounce  blue-circle"></div>
                                <div className="bg-green-600 p-1 w-2 h-3 rounded-full animate-bounce green-circle"></div>
                                <div className="bg-red-600 p-1  w-2 h-3 rounded-full animate-bounce red-circle"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>

    );
}