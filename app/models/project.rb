class Project < ApplicationRecord

    validates :title, :description, :status, presence:true

    belongs_to :user, optional: true
    has_many :todos, dependent: :destroy

end