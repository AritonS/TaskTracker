class ApplicationController < ActionController::Base
    skip_before_action :verify_authenticity_token

    helper_method :current_user

    def login!(user)
        @current_user = user
        session[:session_token] = user.session_token
    end

    def logout!
        current_user.try(:reset_session_token!)
        session[:session_token] = nil
    end

    def current_user
        return nil if session[:session_token].nil?
        @current_user ||= User.find_by(session_token: session[:session_token])
    end

    def require_current_user!
        redirect_to new_user_url if current_user.nil?
    end

end