// import './assets/main.css'
// import '@/assets/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import router from './router'

import './assets/theme.css'

import '@/stores/firebaseAuth'

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)

// app.component('DataTable', DataTable)
// app.component('Column', Column)

app.mount('#app')


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKn1hCOuusjch3ShDYYK5h_KaeBbk8yTY",
  authDomain: "week7-xuqing.firebaseapp.com",
  projectId: "week7-xuqing",
  storageBucket: "week7-xuqing.firebasestorage.app",
  messagingSenderId: "560933900931",
  appId: "1:560933900931:web:52ebf5a7048bc461f8c1b6",
  measurementId: "G-DSSWRDJ7C0"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);