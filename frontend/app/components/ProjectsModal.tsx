import { useState, useEffect } from 'react';
import Link from 'next/link';

type Project = {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
};

type Todo = {
  id: number;
  title: string;
  description: string;
  status: string;
  project_id: number | null;
  created_at: string;
};

type ProjectsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ProjectsModal({ isOpen, onClose }: ProjectsModalProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projectTasks, setProjectTasks] = useState<Todo[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      // Reset selected project and tasks when modal opens
      setSelectedProjectId(null);
      setProjectTasks([]);
    }
  }, [isOpen]);

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

  const handleBackClick = () => {
    setSelectedProjectId(null);
    setProjectTasks([]);
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

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-5 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-playfair text-warm-gray">Your Projects</h2>
          <div className="flex items-center space-x-2">
            <Link
              href="/dashboard/projects"
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
        </div>

        <div className="grid gap-4">
          {filteredProjects.map((project) => (
            <div key={project.id} className="luxury-card">
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
                    <h3 className="text-xl font-playfair text-warm-gray">{project.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        Created {new Date(project.created_at).toLocaleDateString()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium
                        ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'in_progress' ? 'bg-primary-gold/10 text-primary-gold' :
                          'bg-gray-100 text-gray-800'}`}>
                        {project.status.replace('_', ' ').charAt(0).toUpperCase() + project.status.slice(1).replace('_', ' ')}
                      </span>
                    </div>
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="px-4 py-2 text-warm-gray hover:bg-gray-100 rounded-lg transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Full Project
                    </Link>
                  </div>
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
      </div>
    </div>
  );
} 