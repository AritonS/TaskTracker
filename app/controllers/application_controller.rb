class ApplicationController < ActionController::Base
    protect_from_forgery with: :exception
    skip_before_action :verify_authenticity_token
    before_action :set_csrf_cookie

    helper_method :current_user

    def login!(user)
        @current_user = user
        session[:session_token] = user.session_token
    end

    def logout!
        current_user.try(:reset_session_token!)
        session[:session_token] = nil
        @current_user = nil
    end

    def current_user
        return nil if session[:session_token].nil?
        @current_user ||= User.find_by(session_token: session[:session_token])
    end

    def require_current_user!
        render json: { error: 'Unauthorized' }, status: :unauthorized unless current_user
    end

    private

    def set_csrf_cookie
        cookies['CSRF-TOKEN'] = form_authenticity_token
    end
end