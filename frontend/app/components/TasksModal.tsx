import { useState, useEffect } from 'react';
import Link from 'next/link';

type Todo = {
  id: number;
  title: string;
  description: string;
  status: string;
  project_id: number | null;
  created_at: string;
  project?: {
    title: string;
  };
};

type TasksModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function TasksModal({ isOpen, onClose }: TasksModalProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    if (isOpen) fetchTodos();
  }, [isOpen]);

  const fetchTodos = async () => {
    try {
      const [todosRes, projectsRes] = await Promise.all([
        fetch('http://localhost:4000/todos'),
        fetch('http://localhost:4000/projects')
      ]);
      
      const todosData = await todosRes.json();
      const projectsData = await projectsRes.json();

      const todosWithProjects = todosData.map((todo: Todo) => ({
        ...todo,
        project: projectsData.find((p: any) => p.id === todo.project_id)
      }));

      setTodos(todosWithProjects);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    return todo.status === filter;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-5 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-playfair text-warm-gray">Your Tasks</h2>
          <div className="flex items-center space-x-2">
            <Link
              href="/dashboard/todos"
              className="px-4 py-2 text-warm-gray hover:bg-gray-100 rounded-lg transition-all"
            >
              View All
            </Link>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button 
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'all' 
                  ? 'text-warm-gray bg-white/50' 
                  : 'text-warm-gray/80 hover:text-warm-gray hover:bg-white/50'
              }`}
              onClick={() => setFilter('all')}
            >
              All Tasks
            </button>
            <button 
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'in_progress' 
                  ? 'text-warm-gray bg-white/50' 
                  : 'text-warm-gray/80 hover:text-warm-gray hover:bg-white/50'
              }`}
              onClick={() => setFilter('in_progress')}
            >
              In Progress
            </button>
            <button 
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'completed' 
                  ? 'text-warm-gray bg-white/50' 
                  : 'text-warm-gray/80 hover:text-warm-gray hover:bg-white/50'
              }`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredTodos.map((todo) => (
            <div key={todo.id} className="luxury-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-soft-red/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-soft-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-playfair text-warm-gray">{todo.title}</h3>
                      {todo.project && (
                        <p className="text-sm text-gray-500">
                          Project: {todo.project.title}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{todo.description}</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Created {new Date(todo.created_at).toLocaleDateString()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${todo.status === 'completed' ? 'bg-green-100 text-green-800' :
                        todo.status === 'in_progress' ? 'bg-soft-red/10 text-soft-red' :
                        'bg-gray-100 text-gray-800'}`}>
                      {todo.status.replace('_', ' ').charAt(0).toUpperCase() + todo.status.slice(1).replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 