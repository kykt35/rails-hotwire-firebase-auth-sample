import { Controller } from "@hotwired/stimulus"
import { initializeApp, getApp } from "firebase/app"
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { firebaseConfig } from "env"

let idToken = null;
let initialized = false;

// Connects to data-controller="auth"
export default class extends Controller {
  static values = {
    require_auth: Boolean,
    uid: String
  }
  static targets = [ "email", "password" ]

  initialize() {
    if(initialized) return;
    console.log("auth_controller initialize");

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    onAuthStateChanged(auth, async (user) => {
      idToken = await user.getIdToken();
      // 認証必要ないページ
      if(!this.requireAuthValue) return;

      // 認証必要なページで認証情報が成功している場合
      if(user && this.uidValue == user.uid) return;

      // 認証チェック表示、再リクエスト
      if(user && this.uidValue == "") {
        const path = location.pathname;
        Turbo.visit(path, { action: "replace" });
        return;
      }

      // 認証必要なページで認証失敗している
      // ログインページにリダイレクト
      Turbo.visit("/", { action: "replace" });
    });

    this.registerBeforeFetchEvent();
    initialized = true;
  }

  async loginWithEmailAndPassword() {
    try{
      const app = getApp();
      const auth = getAuth(app);
      const email = this.emailTarget.value ;
      const password = this.passwordTarget.value ;
      await signInWithEmailAndPassword(auth, email, password)
      Turbo.visit("/mypage", { action: "replace" });
    } catch (error) {
      console.log("login error", error)
    }
  }

  async logout() {
    try{
      const app = getApp();
      const auth = getAuth(app);
      await signOut(auth)
    } catch (error) {
      console.log("logout error", error)
    }
  }

  registerBeforeFetchEvent() {
    document.addEventListener("turbo:before-fetch-request", (event) => {
      if(idToken == null) return;

      event.preventDefault();
      event.detail.fetchOptions.headers["Authorization"] =  "Bearer " + idToken;
      event.detail.resume();
    });
  }
}
