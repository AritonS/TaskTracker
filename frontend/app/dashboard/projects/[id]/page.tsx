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

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [projectTasks, setProjectTasks] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  useEffect(() => {
    fetchProjectData();
  }, [params.id]);

  const fetchProjectData = async () => {
    try {
      const [projectResponse, tasksResponse] = await Promise.all([
        fetch(`http://localhost:4000/projects/${params.id}`),
        fetch(`http://localhost:4000/todos?project_id=${params.id}`)
      ]);

      if (!projectResponse.ok) throw new Error('Failed to fetch project');
      if (!tasksResponse.ok) throw new Error('Failed to fetch tasks');

      const projectData = await projectResponse.json();
      const tasksData = await tasksResponse.json();
      
      setProject(projectData);
      setProjectTasks(tasksData.filter((task: Todo) => task.project_id === parseInt(params.id)));
    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProject = async (projectData: Partial<Project>) => {
    try {
      const response = await fetch(`http://localhost:4000/projects/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          project: {
            ...projectData,
            status: projectData.status || 'not_started'
          } 
        }),
      });

      if (!response.ok) throw new Error('Failed to update project');
      
      fetchProjectData();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleCreateTask = async (taskData: Omit<Todo, 'id' | 'created_at'>) => {
    try {
      const response = await fetch('http://localhost:4000/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          todo: {
            ...taskData,
            project_id: parseInt(params.id),
            due_date: taskData.due_date || null,
            status: taskData.status || 'not_started'
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to create task');
      
      fetchProjectData();
      setIsNewTaskModalOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-gold"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-playfair text-warm-gray mb-4">Project not found</h1>
        <Link href="/dashboard/projects" className="text-primary-gold hover:text-primary-gold/80 transition-colors">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/projects" className="text-primary-gold hover:text-primary-gold/80 transition-colors">
          ← Back to Projects
        </Link>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit Project</span>
          </button>
          <span className={`px-3 py-1 rounded-full text-sm font-medium
            ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
              project.status === 'in_progress' ? 'bg-primary-gold/10 text-primary-gold' :
              'bg-gray-100 text-gray-800'}`}>
            {project.status.replace('_', ' ').charAt(0).toUpperCase() + project.status.slice(1).replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="luxury-card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary-gold/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-3xl font-playfair text-warm-gray">{project.title}</h1>
        </div>
        
        <p className="text-gray-600 text-lg mb-6">{project.description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
          {project.due_date && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Due {new Date(project.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="luxury-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-playfair text-warm-gray">Project Tasks</h2>
          <button 
            className="luxury-button"
            onClick={() => setIsNewTaskModalOpen(true)}
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Task
            </span>
          </button>
        </div>
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
                  {task.due_date && (
                    <span className="text-sm text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Due {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
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

      {/* Edit Project Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-playfair text-warm-gray mb-4">Edit Project</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleEditProject({
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
                    defaultValue={project.title}
                    className="luxury-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    required
                    defaultValue={project.description}
                    className="luxury-input w-full h-32"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date (Optional)</label>
                  <input
                    type="date"
                    name="due_date"
                    defaultValue={project.due_date?.split('T')[0] || ''}
                    className="luxury-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    required
                    defaultValue={project.status}
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
                    onClick={() => setIsEditModalOpen(false)}
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

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-playfair text-warm-gray mb-4">Add New Task</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleCreateTask({
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                status: formData.get('status') as string,
                project_id: parseInt(params.id),
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
                    onClick={() => setIsNewTaskModalOpen(false)}
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
    </div>
  );
} 