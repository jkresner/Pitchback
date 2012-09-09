class FeedbacksController < ApplicationController
  def create
    pitch = Pitch.find_by_twilio_number params["To"]
    if pitch
      Feedback.create! :phone_number => params["From"],
                    :text => params["Body"],
                    :sms_id => params["SmsSid"],
                    :pitch => pitch
    end
    head :ok
  end
end
