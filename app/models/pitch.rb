class Pitch < ActiveRecord::Base
  attr_accessible :name, :pitcher, :tokbox_id, :twilio_number
  attr_accessor :twilio_client

  before_create :request_twilio_number

  #protected
  def twilio_client
  	if @twilio_client.nil?
  		# put your own credentials here
			account_sid = 'ACe41d60a4b156054d8e47fb7fb5e07cfc'
			auth_token = 'ec5f00453ff66ce69e4c40e47e0f5e1b'

			# set up a client to talk to the Twilio REST API
			@twilio_client = Twilio::REST::Client.new account_sid, auth_token
		end
		@twilio_client
  end

  def request_twilio_number
  	# get some available numbers
		@numbers = self.twilio_client.account.available_phone_numbers.get('US').local.list(
			:area_code => '415'
		)

		self.twilio_number = Pitchback::Application.config.default_number
		# buy the first one
		#@number = @numbers[0].phone_number
		#self.twilio_client.account.incoming_phone_numbers.create(:phone_number => @number)
  end
end
