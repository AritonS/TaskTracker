class User < ApplicationRecord

    has_secure_password
    attr_reader :password
    
    validates :username, :email, :session_token, presence: true
    validates :username, :email, uniqueness: true
    validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
    validates :password_digest, presence: { message: "Password can't be blank" }
    validates :password, length: { minimum: 6, allow_nil: true }

    has_many :projects
    has_many :todos

    after_initialize :ensure_session_token
    
    def password=(password)
        @password = password
        self.password_digest = BCrypt::Password.create(password)
    end
    
    def is_password?(password)
        BCrypt::Password.new(self.password_digest).is_password?(password)
    end
    
    def self.generate_session_token
        SecureRandom::urlsafe_base64(16)
    end
    
    def reset_session_token!
        self.session_token = self.class.generate_session_token
        self.save!
        self.session_token
    end

    def self.find_by_credentials(username, password)
        user = User.find_by(username: username)
        return nil if user.nil?
        user.is_password?(password) ? user : nil
    end
    
    private

    def ensure_session_token
        self.session_token ||= self.class.generate_session_token
    end
    
end