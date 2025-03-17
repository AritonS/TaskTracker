import Link from "next/link";

export default function Page() {
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            
            <div className="space-y-8">
                {/* User Authentication Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Account Management</h2>
                    <div className="flex gap-4">
                        <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
                            <Link href="/dashboard/users/new">Create an account</Link>
                        </button>
                        <button className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300">
                            <Link href="/dashboard/users/login">Log in</Link>
                        </button>
                    </div>
                </section>

                {/* Project Management Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Project Management</h2>
                    <div className="flex gap-4">
                        <button className="bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-600 transition duration-300">
                            <Link href="/dashboard/projects/new">Create New Project</Link>
                        </button>
                        <button className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300">
                            <Link href="/dashboard/todos/new">Create New To-Do</Link>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}