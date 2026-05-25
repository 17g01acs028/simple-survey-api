
"use client"

import React from 'react'
import Container from "@/components/ui/Container"
import Link from 'next/link'
import { icons } from 'lucide-react';
import { Button } from '../ui/button';
import { Menu, Moon, Sun } from "lucide-react"
import { useTheme } from 'next-themes';
const routes = [
    {
        href: "/",
        label: "Survey",
        icon: "Album"
    },
    {
        href: "/response",
        label: "Responses",
        icon: "Home"

    }

]



const Header = () => {
    const { theme, setTheme } = useTheme();

    return (
        <header className="fixed   m-h-[100px]  w-full top-0 bg-slate-50 shadow-lg dark:bg-slate-950 z-20 sm:flex sm:justify-between py-3 px-4 border-b mb-6">
            <Container>

                {/* Left */}
                <div className="flex justify-between  items-center">
                    <Link href="/" className="ml-4 lg:ml-0">
                        <h1 className="text-xl hidden md:block font-bold">
                            Survey System
                        </h1>
                        <h1 className="text-lg md:hidden font-bold">
                            S.S
                        </h1>
                    </Link>

                    {/* Center Links */}
                    <div className="flex items-center justify-center ">
                        <div className="fixed bg-white dark:bg-slate-950 left-0 md:hidden bottom-0 py-2 px-4  right-0  border-t">
                            <div className="flex items-center px-4  justify-between  ">
                                {routes.map((route, i) => (
                                    <Link
                                        href={route.href}
                                        className="text-xs font-medium transition-colors flex gap-3  flex-col items-center justify-center"
                                        key={i}
                                    >

                                        {route.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <nav className="mx-6 flex items-center justify-center space-x-4 lg:space-x-6 hidden md:block">

                            {
                                routes.map((route, i) => (

                                    <Link href={route.href} key={i} className="text-sm font-medium transition-colors">
                                        <Button variant="ghost" >
                                            {route.label}
                                        </Button>
                                    </Link>
                                ))
                            }
                        </nav></div>

                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="shopping cart"
                        className="mr-6"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    > <Sun className="h-5 w-5 md:h-6 md:w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 md:h-6 md:w-6 rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100" />

                        <span className="sr-only">
                            Toggle Theme
                        </span>
                    </Button>
                </div>

            </Container>
        </header >
    )
}

export default Header