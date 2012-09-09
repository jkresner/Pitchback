class Feedback < ActiveRecord::Base
  belongs_to :pitch
  attr_accessible :phone_number, :pitch, :pitch_id, :score, :sms_id, :text
  before_create :parse_text
  after_create :publish_pb
  validates_presence_of :text
  SCORE_REGEX = /\+\d+/
  def parse_text

    if self.text && !Feedback.where(:phone_number => self.phone_number, :pitch_id => self.pitch_id ).exists?
      match = self.text.scan(SCORE_REGEX).first
      self.score = match[1..-1].to_i if match
    end
  end

  def publish_pb
    pubnub = Pubnub.new(
      "pub-a7d5b0a7-f46d-44c5-9d19-37469552064d",  ## PUBLISH_KEY
      "sub-0ce8b14a-fa3b-11e1-9fab-7907aaed5aa2",  ## SUBSCRIBE_KEY
      "sec-ZDFkM2U4MDktZjVjYi00ZTIyLTg2NmYtOTA5NzJmYTU4YTI2",  ## SECRET_KEY
      false    ## SSL_ON?
    )

    pubnub.publish({
      'channel' => pitch.tokbox_id,
      'message' => {:text => self.text, :score =>self.score}
    })

  end
end
