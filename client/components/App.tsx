import NavBar from './NavBar'
import { Link } from 'react-router-dom'

function App() {
  return (
    <>
      <div className="app">
        <h1 className="text-3xl font-bold underline">
          Fullstack Boilerplate - with Fruits!
        </h1>
        <NavBar />
      </div>
      <Link to="/userForm">
        <button>Profile Information</button>
      </Link>
    </>
  )
}

export default App
