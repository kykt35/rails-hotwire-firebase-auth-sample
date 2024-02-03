class ApplicationController < ActionController::Base
  def authenticate
    @require_auth = true

    id_token = request.headers['Authorization']&.split&.last

    if request.method_symbol == :get && id_token.nil?
      render 'shared/check_auth', status: 200
      return
    end

    decorded_token = FirebaseAdmin::Client.verify_id_token!(id_token)
    @uid = decorded_token['user_id']
  end
end
