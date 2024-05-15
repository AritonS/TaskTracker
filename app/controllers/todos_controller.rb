class TodosController < ApplicationController

    def index
        @todos = Todo.all 
        render json: @todos
    end

    def create
        @todo = Todo.new(todo_params)
        @todo.save
    end

    private

    def todo_params
        params.require(:todo).permit(:title, :description, :status, :project_id)
    end

end