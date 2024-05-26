'use client'

import { useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewUserForm() {

    const router = useRouter();
    const [user, setUser] = useState({ username: '', password: '' });

    const createUser = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({user})
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await fetch('http://localhost:4000/users', createUser)
        router.push('/dashboard')
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold font-serif mb-4 text-center">Sign Up</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label className="text-lg font-semibold mb-1">Username:
                        <br />
                        <input
                            type="text"
                            id="username"
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            className="border border-gray-300 rounded-lg px-1 focus:outline-none focus:border-red-500 text-black"
                        />
                    </label>
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold mb-1">Password:
                        <br />
                        <input
                            type="password"
                            id="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            className="border border-gray-300 rounded-lg px-1 focus:outline-none focus:border-red-500 text-black"
                        />
                    </label>
                </div>
                <button type="submit" className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300">
                    Create Account
                </button>
                <br />
                Already have an account?
                <button className="bg-red-500 text-white font-semibold py-2 px-4 ml-2 rounded-lg hover:bg-red-600 transition duration-300">
                    <Link href="/dashboard/users/login">Log in here</Link>
                </button>
            </form>
        </div>
    );

}