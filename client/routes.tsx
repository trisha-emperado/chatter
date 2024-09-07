import { createRoutesFromElements, Route } from 'react-router-dom'
import App from './components/App.tsx'
import UserForm from './components/UserForm.tsx'
import Layout from './components/Layout.tsx'
import Profile from './components/Profile.tsx'

const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<Layout />} />
    <Route
      path="/userForm"
      element={<UserForm userID={undefined} isEditing={undefined} />}
    />
    <Route path="/user/:id" element={<Profile />} />
  </Route>,
)

export default routes
