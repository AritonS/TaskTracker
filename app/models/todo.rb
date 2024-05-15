class Todo < ApplicationRecord

    validates :title, :description, :status, presence: true

    belongs_to :user, optional: true
    belongs_to :project, optional: true
    
end
