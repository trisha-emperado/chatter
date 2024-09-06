import { createRoutesFromElements, Route } from 'react-router-dom'
import App from './components/App.tsx'
import UserForm from './components/UserForm.tsx'
import Home from './components/Home.tsx'

const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="/userForm" element={<UserForm />} />
  </Route>,
)

export default routes
