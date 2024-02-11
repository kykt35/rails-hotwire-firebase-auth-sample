# Pin npm packages by running ./bin/importmap

pin 'application'
pin 'firebase/app', to: 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js'
pin 'firebase/auth', to: 'https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js'
pin '@hotwired/turbo-rails', to: 'turbo.min.js', preload: true
pin '@hotwired/stimulus', to: 'stimulus.min.js'
pin '@hotwired/stimulus-loading', to: 'stimulus-loading.js'
pin_all_from 'app/javascript/controllers', under: 'controllers'

if Rails.env == 'production'
  pin 'env', to: 'env/env_prod.js'
else
  pin 'env', to: 'env/env_dev.js'
end
