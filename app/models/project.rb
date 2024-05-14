class Project < ApplicationRecord

    validates :title, :description, :status, presence:true

    has_many :todos, dependent: :destroy

end