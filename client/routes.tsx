import { createRoutesFromElements, Route } from 'react-router-dom'
import App from './components/App.tsx'
import UserForm from './components/UserForm.tsx'
import Layout from './components/Layout.tsx'
import PostDetails from './components/PostDetail.tsx'

const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<App />} />
    <Route path="/userForm" element={<UserForm />} />
    <Route path="/posts/:id" element={<PostDetails />} />
  </Route>,
)

export default routes
