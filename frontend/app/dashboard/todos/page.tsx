'use client'

import { useState, useEffect } from "react"
import Link from "next/link";
type Todo = {
    id: number;
    title: string;
    description: string;
    status: string;
};

export default function Page() {

    const [todos, setTodos] = useState([]);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await fetch('http://localhost:4000/todos');
                const data = await response.json();
                setTodos(data);
            } catch (error) {
                console.error('Error fetching todos:', error);
            }
        };

        fetchTodos();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold font-serif mb-4 text-center">To-Dos</h2>
            <ul>
                {todos.map((todo: Todo) => (
                    <li key={todo.id} className="mb-2 border-2 border-red-950 rounded-lg p-2 bg-slate-900">
                        <div className="flex justify-between">
                            <h3 className="text-lg text-red-400 font-semibold underline">{todo.title}</h3>
                            <p className="text-xs font-sans">Status: {todo.status}</p>
                        </div>
                        <p className="text-slate-400 text-md font-light">{todo.description}</p>
                    </li>
                ))}
            </ul>
            <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300">
                <Link href="/dashboard/todos/new">Create New To-Do</Link>
            </button>
        </div>
    );

}