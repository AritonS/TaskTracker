'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTodoForm() {

    const router = useRouter();
    const [todo, setTodo] = useState({ title: '', description: '', status: '', project_id: '' });
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:4000/projects');
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    const createTodo = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todo)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const todoToCreate = {
            ...todo,
            project_id: todo.project_id ? parseInt(todo.project_id, 10) : null
        };
        await fetch('http://localhost:4000/todos', createTodo)
        router.push('/dashboard/todos')
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold font-serif mb-4 text-center">Create New To-Do</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label className="text-lg font-semibold mb-1">Title:
                        <br />
                        <input
                            type="text"
                            id="title"
                            onChange={(e) => setTodo({ ...todo, title: e.target.value })}
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
                            onChange={(e) => setTodo({ ...todo, description: e.target.value })}
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
                            onChange={(e) => setTodo({ ...todo, status: e.target.value })}
                            className="border border-gray-300 rounded-lg px-1 focus:outline-none focus:border-red-500 text-black"
                        />
                    </label>
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold mb-1">Project:
                        <br />
                        <select
                            value={todo.project_id}
                            onChange={(e) => setTodo({ ...todo, project_id: e.target.value })}
                            className="border border-gray-300 rounded-lg px-1 py-2 focus:outline-none focus:border-red-500 text-black"
                        >
                            <option value="">Select a project</option>
                            {projects.map((project: any) => (
                                <option key={project.id} value={project.id}>{project.title}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <button type="submit" className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300">
                    Create Todo
                </button>
                <br />
                <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300">
                    <Link href="/dashboard/todos">Back to List of To-Dos</Link>
                </button>
            </form>
        </div>
    );

}