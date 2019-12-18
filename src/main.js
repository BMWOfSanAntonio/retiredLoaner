// ! Default Vue.js settings
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
Vue.config.productionTip = false;

// * Import Firebase & Vuefire
import firebase from "firebase";
import { firestorePlugin } from "vuefire";
import "firebase/firestore";

// * Plugins
Vue.use(firestorePlugin);

// * Initialize Firebase
// * Setting database config
const config = {
  apiKey: "AIzaSyBzBeNpGg4hANEkpxw25Z-8FF_r3QJr2gg",
  authDomain: "testtest-6350a.firebaseapp.com",
  databaseURL: "https://testtest-6350a.firebaseio.com",
  projectId: "testtest-6350a",
  storageBucket: "testtest-6350a.appspot.com",
  messagingSenderId: "560921073477",
  appId: "1:560921073477:web:a2f6f65988188c3c66902c"
};

// * Initalizing Firebase
firebase.initializeApp(config);

// * Exporting the database
export const db = firebase.firestore();

let app = null;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount("#app");
  }
});

// * Initial Roll Out 10/2/19
