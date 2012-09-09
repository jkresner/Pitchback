class CreateFeedbacks < ActiveRecord::Migration
  def change
    create_table :feedbacks do |t|
      t.text :text
      t.integer :score
      t.text :phone_number
      t.integer :pitch_id
      t.string :sms_id

      t.timestamps
    end
  end
end
