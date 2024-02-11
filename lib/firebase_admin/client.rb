# frozen_string_literal: true

require 'firebase-admin-sdk'

module FirebaseAdmin
  class Client
    class << self
      # ひとまず直接ファイルを指定しているが、環境変数にするなどしても良い
      FIREBASE_SERVICE_ACCOUNT_FILE = Rails.root.join('service_account.json')

      # Verify id token
      #
      # @param id_token [String] Firebase id token
      # @return [hash] decoded token
      def verify_id_token!(id_token)
        app.auth.verify_id_token(id_token)
      end

      private

      def app
        @app ||= Firebase::Admin::App.new(
          credentials: Firebase::Admin::Credentials.from_file(FIREBASE_SERVICE_ACCOUNT_FILE)
        )
      end
    end
  end
end
