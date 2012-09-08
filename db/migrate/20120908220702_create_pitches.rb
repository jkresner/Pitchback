class CreatePitches < ActiveRecord::Migration
  def change
    create_table :pitches do |t|
      t.text :name
      t.text :pitcher
      t.text :tokbox_id
      t.text :twilio_number

      t.timestamps
    end
  end
end
