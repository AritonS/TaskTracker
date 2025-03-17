'use client'

import { useState } from 'react';
import ProjectsModal from '../components/ProjectsModal';
import TasksModal from '../components/TasksModal';

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
  project?: {
    title: string;
  };
};

export default function Dashboard() {
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:4000/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

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

  const filteredItems = (items: Project[] | Todo[]) => {
    return items.filter(item => {
      if (filter === 'all') return true;
      return item.status === filter;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-playfair text-center mb-12 text-warm-gray">
        Welcome to <span className="text-soft-red">Task Tracker</span>
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Projects Card */}
        <button 
          onClick={() => setIsProjectsModalOpen(true)} 
          className="group text-left"
        >
          <div className="luxury-card h-full transition-transform group-hover:scale-[1.02]">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-gold/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-2xl font-playfair text-warm-gray">Projects</h2>
            </div>
            <p className="text-gray-600">
              Manage your projects and track their progress. Create new projects and assign tasks to them.
            </p>
          </div>
        </button>

        {/* Tasks Card */}
        <button 
          onClick={() => setIsTasksModalOpen(true)}
          className="group text-left"
        >
          <div className="luxury-card h-full transition-transform group-hover:scale-[1.02]">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-soft-red/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-soft-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-2xl font-playfair text-warm-gray">Tasks</h2>
            </div>
            <p className="text-gray-600">
              View and manage your tasks. Create new tasks and track their completion status.
            </p>
          </div>
        </button>
      </div>

      <ProjectsModal 
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
      />

      <TasksModal 
        isOpen={isTasksModalOpen}
        onClose={() => setIsTasksModalOpen(false)}
      />
    </div>
  );
}