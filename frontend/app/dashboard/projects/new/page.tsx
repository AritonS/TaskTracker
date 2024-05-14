'use client'

import { useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProjectForm() {

    const router = useRouter();
    const [project, setProject] = useState({ title: '', description: '', status: '' });

    const createProject = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(project)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await fetch('http://localhost:4000/projects', createProject)
        router.push('/dashboard/projects')
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold font-serif mb-4 text-center">Create New Project</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label className="text-lg font-semibold mb-1">Title:
                        <br />
                        <input
                            type="text"
                            id="title"
                            onChange={(e) => setProject({ ...project, title: e.target.value })}
                            className="border border-gray-300 rounded-lg px-1 focus:outline-none focus:border-red-500 text-black"
                        />
                    </label>
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold mb-1">Description:
                        <br />
                        <input
                            type="text"
                            id="description"
                            onChange={(e) => setProject({ ...project, description: e.target.value })}
                            className="border border-gray-300 rounded-lg px-1 py-2 focus:outline-none focus:border-red-500 text-black"
                        />
                    </label>
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold mb-1">Status:
                        <br />
                        <input
                            type="text"
                            id="status"
                            onChange={(e) => setProject({ ...project, status: e.target.value })}
                            className="border border-gray-300 rounded-lg px-1 focus:outline-none focus:border-red-500 text-black"
                        />
                    </label>
                </div>
                <button type="submit" className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300">
                    Create Project
                </button>
                <br />
                <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300">
                    <Link href="/dashboard/projects">Back to List of Projects</Link>
                </button>
            </form>
        </div>
    );

}