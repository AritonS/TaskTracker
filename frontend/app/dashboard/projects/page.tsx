'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Todo = {
  id: number;
  title: string;
  description: string;
  status: string;
  project_id: number | null;
  created_at: string;
  due_date: string | null;
};

type Project = {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  due_date: string | null;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [unassignedTodos, setUnassignedTodos] = useState<Todo[]>([]);
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);
  const [currentTodoPage, setCurrentTodoPage] = useState(0);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projectTasks, setProjectTasks] = useState<Todo[]>([]);

  useEffect(() => {
    fetchProjects();
    fetchUnassignedTodos();
  }, []);

  const fetchUnassignedTodos = async () => {
    try {
      const response = await fetch('http://localhost:4000/todos');
      const data = await response.json();
      setUnassignedTodos(data.filter((todo: Todo) => !todo.project_id));
    } catch (error) {
      console.error('Error fetching unassigned todos:', error);
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

  const handleCreateProject = async (projectData: Omit<Project, 'id' | 'created_at'>) => {
    try {
      const response = await fetch('http://localhost:4000/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project: {
            ...projectData,
            todo_ids: selectedTodos,
            due_date: projectData.due_date || null
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to create project');
      
      fetchProjects();
      setIsNewProjectModalOpen(false);
      setSelectedTodos([]);
      setCurrentTodoPage(0);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleEditProject = async (projectId: number, projectData: Partial<Project>) => {
    try {
      const response = await fetch(`http://localhost:4000/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project: projectData }),
      });

      if (!response.ok) throw new Error('Failed to update project');
      
      fetchProjects();
      setEditingProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`http://localhost:4000/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete project');
      
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleTodoSelection = (todoId: number) => {
    setSelectedTodos(prev => 
      prev.includes(todoId)
        ? prev.filter(id => id !== todoId)
        : [...prev, todoId]
    );
  };

  const TODOS_PER_PAGE = 3;
  const totalPages = Math.ceil(unassignedTodos.length / TODOS_PER_PAGE);
  const visibleTodos = unassignedTodos.slice(
    currentTodoPage * TODOS_PER_PAGE,
    (currentTodoPage + 1) * TODOS_PER_PAGE
  );

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  const fetchProjectTasks = async (projectId: number) => {
    try {
      const response = await fetch(`http://localhost:4000/todos?project_id=${projectId}`);
      const data = await response.json();
      // Filter tasks to only include those matching the project ID
      const filteredTasks = data.filter((task: Todo) => task.project_id === projectId);
      setProjectTasks(filteredTasks);
    } catch (error) {
      console.error('Error fetching project tasks:', error);
    }
  };

  const handleProjectClick = (projectId: number) => {
    if (selectedProjectId === projectId) {
      // If clicking the same project, close it
      setSelectedProjectId(null);
      setProjectTasks([]);
    } else {
      // If clicking a different project, show its tasks
      setSelectedProjectId(projectId);
      fetchProjectTasks(projectId);
    }
  };

  return (
    <div className="space-y-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-playfair mb-4 text-warm-gray">
          Your <span className="text-primary-gold">Projects</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Manage and track your ongoing projects with elegance
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
            All Projects
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
          onClick={() => setIsNewProjectModalOpen(true)}
        >
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Project
          </span>
        </button>
      </div>

      <div className="grid gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="luxury-card group">
            <div 
              className="flex items-start justify-between cursor-pointer"
              onClick={() => handleProjectClick(project.id)}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-gold/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-playfair text-warm-gray">{project.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Created {new Date(project.created_at).toLocaleDateString()}
                    </span>
                    {project.due_date && (
                      <span className="text-sm text-gray-500">
                        Due {new Date(project.due_date).toLocaleDateString()}
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'in_progress' ? 'bg-primary-gold/10 text-primary-gold' :
                        'bg-gray-100 text-gray-800'}`}>
                      {project.status.replace('_', ' ').charAt(0).toUpperCase() + project.status.slice(1).replace('_', ' ')}
                    </span>
                  </div>
                  <Link 
                    href={`/dashboard/projects/${project.id}`}
                    className="text-sm text-primary-gold hover:text-primary-gold/80 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Full Project →
                  </Link>
                </div>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingProject(project);
                  }}
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                >
                  <svg className="w-5 h-5 text-deep-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tasks Section */}
            {selectedProjectId === project.id && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-lg font-playfair text-warm-gray mb-4">Project Tasks</h4>
                {projectTasks.length === 0 ? (
                  <p className="text-gray-600">No tasks assigned to this project yet.</p>
                ) : (
                  <div className="grid gap-4">
                    {projectTasks.map((task) => (
                      <div key={task.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-soft-red/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-soft-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-playfair text-warm-gray">{task.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-4">{task.description}</p>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            Created {new Date(task.created_at).toLocaleDateString()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium
                            ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                              task.status === 'in_progress' ? 'bg-soft-red/10 text-soft-red' :
                              'bg-gray-100 text-gray-800'}`}>
                            {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.slice(1).replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl">
            <h2 className="text-2xl font-playfair text-warm-gray mb-4">Create New Project</h2>
            <div className="flex gap-6">
              {/* Task Selection Sidebar */}
              <div className="w-96 border-r border-gray-200 pr-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Available Tasks</h3>
                <div className="space-y-4">
                  {visibleTodos.map(todo => (
                    <div
                      key={todo.id}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        selectedTodos.includes(todo.id)
                          ? 'border-primary-gold bg-primary-gold/5'
                          : 'border-gray-200 hover:border-primary-gold/50'
                      }`}
                      onClick={() => handleTodoSelection(todo.id)}
                    >
                      <h4 className="font-medium text-warm-gray">{todo.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{todo.description}</p>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => setCurrentTodoPage(prev => Math.max(0, prev - 1))}
                      disabled={currentTodoPage === 0}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentTodoPage + 1} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentTodoPage(prev => Math.min(totalPages - 1, prev + 1))}
                      disabled={currentTodoPage === totalPages - 1}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Project Form */}
              <div className="flex-1">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleCreateProject({
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                    status: formData.get('status') as string,
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
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsNewProjectModalOpen(false);
                          setSelectedTodos([]);
                          setCurrentTodoPage(0);
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="luxury-button"
                      >
                        Create Project
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-playfair text-warm-gray mb-4">Edit Project</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleEditProject(editingProject.id, {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                status: formData.get('status') as string,
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
                    defaultValue={editingProject.title}
                    className="luxury-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    required
                    defaultValue={editingProject.description}
                    className="luxury-input w-full h-32"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date (Optional)</label>
                  <input
                    type="date"
                    name="due_date"
                    defaultValue={editingProject.due_date?.split('T')[0] || ''}
                    className="luxury-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={editingProject.status}
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
                    onClick={() => setEditingProject(null)}
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