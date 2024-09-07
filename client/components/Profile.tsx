import { useParams } from 'react-router-dom'
import { useState } from 'react'
import UserForm from './UserForm'
import { useUsersByID } from '../hooks/useUsers'
import { useAuth0 } from '@auth0/auth0-react'

function Profile() {
  const { id } = useParams()
  const userID = Number(id)

  const { data: user, isPending, isError } = useUsersByID(userID)
  const [editUser, setEditUser] = useState(false)
  const { user: authUser } = useAuth0()

  if (isPending) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching your feed...</div>
  }

  if (isNaN(userID)) {
    return <div>That user ID does not exist.</div>
  }

  const handleEditProfile = () => {
    setEditUser(true)
  }

  if (editUser) {
    return <UserForm userID={id} isEditing={true} />
  }

  return (
    <>
      <div>
        <h1>Profile Information</h1>
        <h2>{user.username}</h2>
        <div className="profileContainer">
          <div className="profilePicture">
            <img
              src={user.profile_picture_url}
              alt={user.name}
              className="profilePicture"
            />
            <div className="profileInformation">
              <div className="profileInput">
                <h4>Name: </h4>
                <p>{user.name}</p>
              </div>
              <div className="profileInput">
                <h4>Age: </h4>
                <p>{user.age}</p>
              </div>
              <div className="profileInput">
                <h4>Current Role: </h4>
                <p>{user.current_role}</p>
              </div>
              <div className="profileInput">
                <h4>Cohort: </h4>
                <p>{user.cohort}</p>
              </div>
              <div className="profileInput">
                <h4>GitHub: </h4>
                <p>{user.github_url}</p>
              </div>
              <div>
                {authUser && authUser.sub === user.auth_id ? (
                  <button onClick={handleEditProfile}>Edit</button>
                ) : (
                  <button>Follow</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
