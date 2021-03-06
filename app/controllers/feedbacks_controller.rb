class FeedbacksController < ApplicationController
  def index
    @feedbacks = Feedback.all
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @feedbacks }
    end
  end
  def create
    pitch = Pitch.where(:twilio_number =>params["To"]).last
    if pitch
      Feedback.create! :phone_number => params["From"],
                    :text => params["Body"],
                    :sms_id => params["SmsSid"],
                    :pitch => pitch
    end
    head :ok
  end

  def get
      @timestamp = params[:timestamp]
      if @timestamp && @timestamp!="nil"
        @feedback = Feedback.where('created_at>?', @timestamp)
      else
        @feedback = Feedback.all
      end
      
      respond_to do |format|
        format.html # show.html.erb
        format.json { render json: @feedback }
      end
    end
end
