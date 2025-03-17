class UsersController < ApplicationController

    before_action :require_current_user!, except: [:create, :new]

    def create
        @user = User.new(user_params)

        if @user.save
            login!(@user)
            render json: @user, status: :created
        else
            render json: { error: @user.errors.full_messages.join(", ") }, status: :unprocessable_entity
        end
    end

    def new
        @user = User.new
    end

    def index
        @users = User.all
        render json: @users
    end

    def show
        @user = User.find(params[:id])
        render json: @user
    end

    private

    def user_params
        params.require(:user).permit(:username, :email, :password)
    end

end
