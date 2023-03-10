import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

if (!firebase.apps.length) {
  const config = {
    apiKey: "AIzaSyCmhjoOzSjBAlrEwwaxrKo3ThZyH457cfM",
    authDomain: "nuxt-app-a951d.firebaseapp.com",
    databaseURL: "https://nuxt-app-a951d-default-rtdb.firebaseio.com",
    projectId: "nuxt-app-a951d",
    storageBucket: "nuxt-app-a951d.appspot.com",
    messagingSenderId: "930454941618",
    appId: "1:930454941618:web:ffc7f25085f87808fffeab"
  }
  firebase.initializeApp(config)
}
const auth = firebase.auth()
const db = firebase.firestore()
const postsCollection = db.collection('posts')
const usersCollection = db.collection('users')
const commentsCollection = db.collection('comments')

export { auth, postsCollection, usersCollection, commentsCollection, db }
