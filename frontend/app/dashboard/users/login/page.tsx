'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {

    const router = useRouter();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/session', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials)
            });

            if (response.ok) {
                router.push('/dashboard');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('An unexpected error occurred. Please try again.');
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold font-serif mb-4 text-center">Log In</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label className="text-lg font-semibold mb-1">Username:
                        <br />
                        <input
                            type="text"
                            id="username"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
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
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            className="border border-gray-300 rounded-lg px-1 focus:outline-none focus:border-red-500 text-black"
                        />
                    </label>
                </div>
                <button type="submit" className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300">
                    Log In
                </button>
                <br />
                Not signed up yet?
                <button className="bg-red-500 text-white font-semibold py-2 px-4 ml-2 rounded-lg hover:bg-red-600 transition duration-300">
                    <Link href="/signup">
                        Create an account here
                    </Link>
                </button>
            </form>
        </div>
    );
}
