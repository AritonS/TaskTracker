class CreateProjects < ActiveRecord::Migration[7.1]
  def change
    create_table :projects do |t|
      t.string :title, null: false
      t.text :description, null: false
      t.string :status, null: false, default: "In Progress"

      t.timestamps
    end
  end
end
