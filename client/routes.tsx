import { createRoutesFromElements, Route } from 'react-router-dom'
import App from './components/App.tsx'
import UserForm from './components/UserForm.tsx'
import Home from './components/Home.tsx'
import PostDetails from './components/PostDetail.tsx'
import Profile from './components/Profile.tsx'
import PostForm from './components/PostForm.tsx'

const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route
      path="/userForm"
      element={<UserForm userID={undefined} isEditing={false} />}
    />
    <Route path="/user/:id" element={<Profile />} />
    <Route path="/feed" element={<Home />} />
    <Route path="/posts/:id" element={<PostDetails />} />
    <Route path="/postForm" element={<PostForm />} />
  </Route>,
)

export default routes
