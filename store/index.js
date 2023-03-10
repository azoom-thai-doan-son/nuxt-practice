import Vuex from "vuex";
import pathify, { make } from 'vuex-pathify'
import { DEFAULT_LIMIT } from "../utils/constansts";
import JWTDecode from "jwt-decode";
import cookieparser from "cookieparser";
import { postsCollection, usersCollection } from "~/plugins/firebase";

const state = {
  allPosts: [],
  currentPosts: [],
  authors: [],
  userInfo: {
  },
  isLoading: false
}

const mutations = {
  ...make.mutations(state),
  ADD_POST(state, newPost) {
    state.allPosts.push(newPost)
  }
}

const actions = {
  async nuxtServerInit({ commit }, { req }) {
    if (process.server && process.static) return;
    if (!req.headers.cookie) return;

    const parsed = cookieparser.parse(req.headers.cookie);
    const accessTokenCookie = parsed.access_token;

    if (!accessTokenCookie) return;

    const decoded = JWTDecode(accessTokenCookie);

    if (decoded) {
      const response = await usersCollection.doc(decoded.user_id).get()
      commit('SET_USER_INFO', {
        id: decoded.user_id,
        ...response.data()
      })
    }
  }
  ,
  async getAllPosts({ commit, dispatch, state }) {
    await dispatch('getAuthors')
    const postSnapshots = await postsCollection.get()
    const allPosts = []
    postSnapshots.forEach(post => {
      const data = post.data()
      const author = state.authors.find(author => author.id === data.authorId)
      allPosts.push({ id: post.id, ...data, author })
    })
    commit('SET_ALL_POSTS', allPosts)
  },
  async getCurrentPosts({ state, commit, }, currentPage = 1) {

    const offset = (currentPage - 1) * DEFAULT_LIMIT
    let currentPosts = state.allPosts.slice(offset, offset + DEFAULT_LIMIT)
    commit('SET_CURRENT_POSTS', currentPosts)

  },


  async getAuthors({ commit }) {
    const usersSnapshots = await usersCollection.get()
    const authors = []
    usersSnapshots.forEach((user) => {
      authors.push({
        id: user.id,
        ...user.data()
      })
    });
    commit('SET_AUTHORS', authors)
  },
  async searchPosts({ dispatch, state, commit }, { search, authorId }) {
    await dispatch('getAllPosts')

    let filtered = state.allPosts
    if (authorId !== null) {
      filtered = filtered.filter(post => post.authorId === authorId)
    }
    if (search) {
      filtered = filtered.filter(post => post.title.toLowerCase().includes(search.toLowerCase()) || post.body.toLowerCase().includes(search.toLowerCase()))
    }
    commit('SET_ALL_POSTS', filtered)
    await dispatch('getCurrentPosts')
  }
}

const createStore = () => {
  const store = new Vuex.Store({
    plugins: [pathify.plugin],
    state,
    mutations,
    actions,
  });
  // window.store = store
  return store
}
export default createStore
