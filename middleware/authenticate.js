export default function ({ store, redirect }) {
  if (!store.state.userInfo.id) redirect('/auth')
}
