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
        <div className="container mx-auto px-4 py-8 max-w-md">
            <h1 className="text-2xl font-bold font-serif mb-6 text-center">Log In</h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
                <div className="flex flex-col">
                    <label className="text-lg font-semibold mb-2">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={credentials.username}
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 text-black"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold mb-2">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 text-black"
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                >
                    Log In
                </button>
                <div className="text-center mt-4">
                    <p className="text-gray-600">Not signed up yet?</p>
                    <Link 
                        href="/dashboard/users/new"
                        className="text-red-500 hover:text-red-600 font-semibold"
                    >
                        Create an account here
                    </Link>
                </div>
            </form>
        </div>
    );
}
