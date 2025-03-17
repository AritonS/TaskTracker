'use client'

import { useState, useEffect } from 'react';

type Project = {
  id: number;
  title: string;
};

type Todo = {
  id: number;
  title: string;
  description: string;
  status: string;
  project_id: number | null;
  created_at: string;
  due_date: string | null;
  project?: {
    title: string;
  };
};

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isNewTodoModalOpen, setIsNewTodoModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    fetchTodos();
    fetchProjects();
  }, []);

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

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:4000/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleCreateTodo = async (todoData: Omit<Todo, 'id' | 'created_at'>) => {
    try {
      const response = await fetch('http://localhost:4000/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          todo: {
            ...todoData,
            project_id: todoData.project_id || null,
            due_date: todoData.due_date || null
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to create todo');
      
      fetchTodos();
      setIsNewTodoModalOpen(false);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleEditTodo = async (todoId: number, todoData: Partial<Todo>) => {
    try {
      const response = await fetch(`http://localhost:4000/todos/${todoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });

      if (!response.ok) throw new Error('Failed to update todo');
      
      fetchTodos();
      setEditingTodo(null);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleCompleteTodo = async (todoId: number) => {
    try {
      const response = await fetch(`http://localhost:4000/todos/${todoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todo: { status: 'completed' } }),
      });

      if (!response.ok) throw new Error('Failed to complete todo');
      
      fetchTodos();
    } catch (error) {
      console.error('Error completing todo:', error);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`http://localhost:4000/todos/${todoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete todo');
      
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    return todo.status === filter;
  });

  return (
    <div className="space-y-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-playfair mb-4 text-warm-gray">
          Your <span className="text-soft-red">Tasks</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Track and manage your tasks with precision
        </p>
      </header>

      <div className="flex justify-between items-center mb-8">
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
        <button 
          className="luxury-button"
          onClick={() => setIsNewTodoModalOpen(true)}
        >
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Task
          </span>
        </button>
      </div>

      <div className="grid gap-4">
        {filteredTodos.map((todo) => (
          <div key={todo.id} className="luxury-card group">
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
                  {todo.due_date && (
                    <span className="text-sm text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Due {new Date(todo.due_date).toLocaleDateString()}
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${todo.status === 'completed' ? 'bg-green-100 text-green-800' :
                      todo.status === 'in_progress' ? 'bg-soft-red/10 text-soft-red' :
                      'bg-gray-100 text-gray-800'}`}>
                    {todo.status.replace('_', ' ').charAt(0).toUpperCase() + todo.status.slice(1).replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setEditingTodo(todo)}
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                {todo.status !== 'completed' && (
                  <button 
                    className="p-2 rounded-lg hover:bg-green-50 transition-colors"
                    onClick={() => handleCompleteTodo(todo.id)}
                  >
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                )}
                <button 
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  <svg className="w-5 h-5 text-deep-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Todo Modal */}
      {isNewTodoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-playfair text-warm-gray mb-4">Create New Task</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleCreateTodo({
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                status: formData.get('status') as string,
                project_id: formData.get('project_id') ? parseInt(formData.get('project_id') as string) : null,
                due_date: formData.get('due_date') as string || null
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="luxury-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    required
                    className="luxury-input w-full h-32"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date (Optional)</label>
                  <input
                    type="date"
                    name="due_date"
                    className="luxury-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    required
                    defaultValue="not_started"
                    className="luxury-input w-full"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project (Optional)</label>
                  <select
                    name="project_id"
                    className="luxury-input w-full"
                  >
                    <option value="">No Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsNewTodoModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="luxury-button"
                  >
                    Create Task
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Todo Modal */}
      {editingTodo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-playfair text-warm-gray mb-4">Edit Task</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleEditTodo(editingTodo.id, {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                status: formData.get('status') as string,
                project_id: parseInt(formData.get('project_id') as string),
                due_date: formData.get('due_date') as string || null
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingTodo.title}
                    className="luxury-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    required
                    defaultValue={editingTodo.description}
                    className="luxury-input w-full h-32"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date (Optional)</label>
                  <input
                    type="date"
                    name="due_date"
                    defaultValue={editingTodo.due_date?.split('T')[0] || ''}
                    className="luxury-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                  <select
                    name="project_id"
                    required
                    defaultValue={editingTodo.project_id || ''}
                    className="luxury-input w-full"
                  >
                    <option value="">No Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={editingTodo.status}
                    className="luxury-input w-full"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingTodo(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="luxury-button"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}