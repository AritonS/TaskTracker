'use client'

import { useState, useEffect } from "react"
import Link from "next/link";

type Project = {
    id: number;
    title: string;
    description: string;
    status: string;
    todos?: Todo[];
};

type Todo = {
    id: number;
    title: string;
    description: string;
    status: string;
    project_id: number;
}

export default function Page() {

    const [projects, setProjects] = useState<Project[]>([]);
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        const fetchProjectsAndTodos = async () => {
            try {
                const projectResponse = await fetch('http://localhost:4000/projects');
                const projectsData = await projectResponse.json();

                const todosResponse = await fetch('http://localhost:4000/todos');
                const todosData = await todosResponse.json();

                const projectsWithTodos = projectsData.map((project: Project) => {
                    const filteredTodos = todosData.filter((todo: Todo) => todo.project_id === project.id);
                    return { ...project, todos: filteredTodos };
                });

                setProjects(projectsWithTodos);
            } catch (error) {
                console.error('Error fetching projects and todos:', error);
            }
        };

        fetchProjectsAndTodos();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold font-serif mb-4 text-center">Projects</h2>
            <ul>
                {projects.map((project: Project) => (
                    <li key={project.id} className="mb-2 border-2 border-red-950 rounded-lg p-2 bg-slate-900">
                        <div className="flex justify-between">
                            <h3 className="text-xl text-red-400 font-semibold underline">{project.title}</h3>
                            <p className="text-xs font-sans">{project.status}</p>
                        </div>
                        <p className="text-slate-300 text-md font-light">{project.description}</p>
                        {project.todos && project.todos.length > 0 && (
                            <div className="mt-4 border-2 border-slate-800 p-1 rounded-md">
                                <h4 className="text-sm text-center font-semibold">To-Dos</h4>
                                <ul className="">
                                    {project.todos.map((todo: Todo) => (
                                        <li key={todo.id}>
                                            <div className="flex space-x-1 ml-4 mt-1">
                                                <p className="text-red-400 text-sm">- {todo.title}</p>
                                                <p className="text-slate-400 text-xs">({todo.status})</p>
                                            </div>
                                            <p className="text-slate-300 text-sm">{todo.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300">
                <Link href="/dashboard/projects/new">Create New Project</Link>
            </button>

        </div>
    );

}