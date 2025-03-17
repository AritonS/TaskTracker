# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Create Demo user
demo_user = User.create!(
  username: 'Demo',
  email: 'demo@example.com',
  password: 'password123'
)

# Create sample projects
projects = [
  {
    title: 'Personal Website',
    description: 'Build and deploy a personal portfolio website',
    status: 'in_progress'
  },
  {
    title: 'Reading List',
    description: 'Books to read in 2024',
    status: 'not_started'
  },
  {
    title: 'Fitness Goals',
    description: 'Track workout progress and nutrition',
    status: 'in_progress'
  },
  {
    title: 'Home Renovation',
    description: 'Planning and tracking home improvement projects',
    status: 'not_started'
  }
]

created_projects = projects.map do |project|
  demo_user.projects.create!(project)
end

# Create sample tasks
tasks = [
  {
    title: 'Design mockups',
    description: 'Create wireframes and design mockups in Figma',
    status: 'completed',
    project: created_projects[0]
  },
  {
    title: 'Set up React environment',
    description: 'Initialize React project and configure build tools',
    status: 'in_progress',
    project: created_projects[0]
  },
  {
    title: 'Implement responsive design',
    description: 'Ensure website works well on all devices',
    status: 'not_started',
    project: created_projects[0]
  },
  {
    title: 'Read "Atomic Habits"',
    description: 'Complete by end of month',
    status: 'in_progress',
    project: created_projects[1]
  },
  {
    title: 'Start "The Pragmatic Programmer"',
    description: 'Technical reading for skill improvement',
    status: 'not_started',
    project: created_projects[1]
  },
  {
    title: 'Create workout schedule',
    description: 'Plan weekly workout routine',
    status: 'completed',
    project: created_projects[2]
  },
  {
    title: 'Track daily calories',
    description: 'Log meals and track macros',
    status: 'in_progress',
    project: created_projects[2]
  },
  {
    title: 'Research gym memberships',
    description: 'Compare local gym options and prices',
    status: 'not_started',
    project: created_projects[2]
  },
  {
    title: 'Get contractor quotes',
    description: 'Contact contractors for kitchen remodel',
    status: 'not_started',
    project: created_projects[3]
  },
  {
    title: 'Create renovation budget',
    description: 'Plan expenses for home improvements',
    status: 'in_progress',
    project: created_projects[3]
  },
  {
    title: 'Design kitchen layout',
    description: 'Draw up plans for kitchen renovation',
    status: 'not_started',
    project: created_projects[3]
  }
]

tasks.each do |task|
  demo_user.todos.create!(task)
end