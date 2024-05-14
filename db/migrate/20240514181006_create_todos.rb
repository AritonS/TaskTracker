class CreateTodos < ActiveRecord::Migration[7.1]
  def change
    create_table :todos do |t|
      t.string :title, null: false
      t.text :description, null: false
      t.string :status, null: false, default: "In Progress"
      t.references :project, null: true, foreign_key: true

      t.timestamps
    end
  end
end
