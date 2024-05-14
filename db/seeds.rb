# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

Project.find_or_create_by!(title: 'Create App', description: 'Create an app where users can keep track of tasks', status: 'In Progress')
Todo.find_or_create_by!(title: 'Add Models', description: 'Create models for projects and todos, with todos optionally associated with projects', status: 'In Progress', project_id: '1')