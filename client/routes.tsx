import { createRoutesFromElements, Route } from 'react-router-dom'
import App from './components/App.tsx'
import UserForm from './components/UserForm.tsx'
import Layout from './components/Layout.tsx'
import Profile from './components/Profile.tsx'
import Feed from './components/Feed.tsx'
import PostForm from './components/PostForm.tsx'
import SignInPage from './components/SignInPage.tsx'
import Home from './components/Home.tsx'
import Following from './components/Following.tsx'
import Friends from './components/Friends.tsx'

const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<App />} />
    <Route
      path="/userForm"
      element={<UserForm userID={undefined} isEditing={undefined} />}
    />
    <Route path="/Home" element={<Home />} />
    <Route path="/user/:id" element={<Profile />} />
    <Route path="/feed" element={<Feed />} />
    <Route path="/postForm" element={<PostForm />} />
    <Route path="/signInPage" element={<SignInPage />} />
    <Route path="/following" element={<Following />} />
    <Route path="/friends" element={<Friends />} />
  </Route>,
)

export default routes
