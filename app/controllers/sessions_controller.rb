class SessionsController < ApplicationController

    # def create
    #     user = User.find_by_credentials(
    #     params[:user][:username],
    #     params[:user][:password]
    #     )

    #     if user.nil?
    #         render json: 'Credentials were wrong'
    #     else
    #         login!(user)
    #         redirect_to user_url(user)
    #     end
    # end

    def show
        if current_user
            render json: current_user
        else
            render json: { error: "No active session" }, status: :unauthorized
        end
    end

    def create
        @user = User.find_by_credentials(
            params[:username],
            params[:password]
        )

        if @user
            login!(@user)
            render json: @user
        else
            render json: { error: "Invalid username or password" }, status: :unauthorized
        end
    end

    def destroy
        logout!
        render json: { status: 'logged_out' }
    end

end