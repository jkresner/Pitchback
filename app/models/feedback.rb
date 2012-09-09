class Feedback < ActiveRecord::Base
  attr_accessible :phone_number, :pitch, :score, :sms_id, :text
  before_create :parse_text
  validates_presence_of :text
  SCORE_REGEX = /\+\d+/
  def parse_text
    if self.text
      match = self.text.scan(SCORE_REGEX).first
      self.score = match[1..-1].to_i if match
    end
  end
end
