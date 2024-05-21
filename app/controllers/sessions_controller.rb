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

      def create
        user = User.find_by(username: params[:username])

        if user&.authenticate(params[:session][:password])
            session[:user_id] = user.id
            render json: { status: 'logged_in', user: user }
        else
            render json: { status: 401, error: 'Invalid username or password' }
        end
    end

    def destroy
        logout!
        render json: { status: 'logged_out' }
    end

end