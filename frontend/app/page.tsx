import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-12">
      <header className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-playfair mb-6 text-warm-gray">
          Elevate Your <span className="text-soft-red">Productivity</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Transform your tasks into accomplishments with our sophisticated task management solution
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="luxury-card">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-soft-red/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-soft-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-2xl font-playfair ml-4 text-warm-gray">Create Task</h3>
          </div>
          <div className="space-y-5">
            <input
              type="text"
              placeholder="Task title"
              className="luxury-input"
            />
            <textarea
              placeholder="Task description"
              className="luxury-input min-h-[120px] resize-none"
            />
            <button className="luxury-button w-full">
              Add Task
            </button>
          </div>
        </div>

        <div className="luxury-card">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary-gold/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-playfair ml-4 text-warm-gray">Current Tasks</h3>
          </div>
          <div className="space-y-4">
            <div className="task-item">
              <h4 className="font-medium text-warm-gray text-lg">Project Planning</h4>
              <p className="text-gray-600 mt-2">Create project timeline and milestones</p>
            </div>
            <div className="task-item">
              <h4 className="font-medium text-warm-gray text-lg">Team Meeting</h4>
              <p className="text-gray-600 mt-2">Weekly sync with development team</p>
            </div>
          </div>
        </div>

        <div className="luxury-card">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-secondary-gold/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-secondary-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-playfair ml-4 text-warm-gray">Completed</h3>
          </div>
          <div className="space-y-4">
            <div className="task-item opacity-60">
              <h4 className="font-medium text-warm-gray text-lg line-through">Setup Development Environment</h4>
              <p className="text-gray-600 mt-2">Install and configure necessary tools</p>
            </div>
            <div className="task-item opacity-60">
              <h4 className="font-medium text-warm-gray text-lg line-through">Initial Design Review</h4>
              <p className="text-gray-600 mt-2">Review and approve design mockups</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
