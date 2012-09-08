class Pitch < ActiveRecord::Base
  attr_accessible :name, :pitcher, :tokbox_id, :twilio_number
end
