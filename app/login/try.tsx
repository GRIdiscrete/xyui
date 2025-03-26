"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";



interface Organization {
    id: string;
    organiz: string;
}



const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    // Transform the data for react-select

    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const employeesResponse = await axios.post('https://accounts.protracc.com/api/login', {
            // This is the request body
            email: email,
            password: password
        }, {
            headers: {
                'x-api-key': 'proTract22$'
            }
        });
        
        
        if(employeesResponse.status == 200){
            console.log(employeesResponse.data.data)

            sessionStorage.setItem("user", employeesResponse.data.data.id)
            sessionStorage.setItem("org", employeesResponse.data.data.company_id)
            router.push('/')
        }
        else{
            setError("Login Failed")
        }

      
    };

    return (
        <>
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-green-50 via-white to-green-50 p-4">
                <Image src={'/logo-3.png'} alt="logo" width={400} height={500} />
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl">Sign In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleLogin}>
                            
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <Button type="submit" className="w-full">
                                Log In
                            </Button>
                            <div className="text-center text-sm">
                                Don&apos;t have an account?{' '}
                                <a href="/signup" className="text-purple-600 hover:text-purple-500">
                                    Sign up
                                </a>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default Login;