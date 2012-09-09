class Feedback < ActiveRecord::Base
  belongs_to :pitch
  attr_accessible :phone_number, :pitch, :pitch_id, :score, :sms_id, :text
  before_create :parse_text
  validates_presence_of :text
  SCORE_REGEX = /\+\d+/
  def parse_text

    if self.text && !Feedback.where(:phone_number => self.phone_number, :pitch_id => self.pitch_id ).exists?
      match = self.text.scan(SCORE_REGEX).first
      @score = match[1..-1].to_i if match
      if @score > 5
	self.score = 5
      else
        self.score = @score
      end 
    end
  end

end
