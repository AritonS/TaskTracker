class ProjectsController < ApplicationController

    def index
        @projects = Project.all
        render json: @projects
    end

    def new
        @project = Project.new
    end

    def create
        @project = Project.new(project_params)
        if @project.save
            render json: @project, status: :created
        else
            render json: { errors: @project.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def show
        @project = Project.find(params[:id])
        @todos = @project.todos
        @available_todos = Todo.where(project_id: nil)
        render json: @project
    end

    def edit
        @project = Project.find(params[:id])
        @available_todos = Todo.where(project_id: [nil, @project.id])
    end

    def update
        @project = Project.find(params[:id])
        if @project.update(project_params)
            render json: @project
        else
            render json: { errors: @project.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def add_todo
        @project = Project.find(params[:id])
        @todo = Todo.find(params[:todo_id])
        @todo.update(project: @project)
        redirect_to project_path(@project), notice: 'Todo was successfully added to project.'
    end

    def remove_todo
        @project = Project.find(params[:id])
        @todo = Todo.find(params[:todo_id])
        @todo.update(project: nil)
        redirect_to project_path(@project), notice: 'Todo was successfully removed from project.'
    end

    def destroy
        @project = Project.find(params[:id])
        @project.destroy
        head :no_content
    end

    private

    def project_params
        params.require(:project).permit(:title, :description, :status, todo_ids: [])
    end

end