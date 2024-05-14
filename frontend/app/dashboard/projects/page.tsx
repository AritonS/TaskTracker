'use client'

import { useState, useEffect } from "react"
import Link from "next/link";

type Project = {
    id: number;
    title: string;
    description: string;
    status: string;
};

type Todo = {
    id: number;
    title: string;
    description: string;
    status: string;
}

export default function Page() {

    const [projects, setProjects] = useState<Project[]>([]);

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

    const fetchTodosForProject = async (projectId: number): Promise<Todo[]> => {
        try {
            const response = await fetch(`http://localhost:4000/projects/${projectId}/todos`);
            const todosData = await response.json();
            return todosData;
        } catch (error) {
            console.error(`Error fetching todos for project ${projectId}:`, error);
            return [];
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold font-serif mb-4 text-center">Projects</h2>
            <ul>
                {projects.map((project: Project) => (
                    <li key={project.id} className="mb-2 border-2 border-red-950 rounded-lg p-2 bg-slate-900">
                        <div className="flex justify-between">
                            <h3 className="text-lg text-red-400 font-semibold underline">{project.title}</h3>
                            <p className="text-xs font-sans">Status: {project.status}</p>
                        </div>
                        <p className="text-slate-400 text-md font-light">{project.description}</p>
                    </li>
                ))}
            </ul>
            <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300">
                <Link href="/dashboard/projects/new">Create New Project</Link>
            </button>

        </div>
    );

}