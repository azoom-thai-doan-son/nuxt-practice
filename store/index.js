import ky from "@/plugins/ky";
import Vuex from "vuex";
import pathify, { make } from 'vuex-pathify'
import { DEFAULT_LIMIT } from "../utils/constansts";

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
  async getAllPosts({ commit }) {
    const allPosts = await ky.get('posts').json()
    commit('SET_ALL_POSTS', allPosts)
  },
  async getCurrentPosts({ state, commit, }, currentPage = 1) {

    const offset = (currentPage - 1) * DEFAULT_LIMIT
    let currentPosts = state.allPosts.slice(offset, offset + DEFAULT_LIMIT)
    // for each post, get corresponding user info

    const users = await Promise.all(currentPosts.map(async post => await ky.get(`users/${post.userId}`).json()))
    currentPosts.forEach((post, idx) => post.user = users[idx])
    commit('SET_CURRENT_POSTS', currentPosts)

  },
  async addPost(_, newPost) {
    return await ky.post('posts', { json: newPost }).json();
  },
  async getAuthors(ctx) {
    const users = await ky.get('users').json()
    const authors = users.map((user) => ({
      value: user.id,
      text: user.username,
    }));
    ctx.commit('SET_AUTHORS', authors)
  },
  async searchPosts({ dispatch, state, commit }, { search, authorId }) {
    await dispatch('getAllPosts')
    let filtered = [...state.allPosts]
    if (authorId !== null) {
      filtered = filtered.filter(post => post.userId === authorId)
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
