class ProjectsController < ApplicationController

    def index
        @projects = Project.all
        render json: @projects
    end

    def create
        @project = Project.new(project_params)
        if @project.save!
            redirect_to projects_path
        else
            render :new
        end
    end

    def show
        @project = Project.find(params[:id])
        @todos = @project.todos
    end

    private

    def project_params
        params.require(:project).permit(:title, :description, :status)
    end

end