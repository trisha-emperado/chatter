import { useParams } from 'react-router-dom'
import { useUsersByID } from '../hooks/useUsers'
import { Link } from 'react-router-dom'

function Profile() {
  const { id } = useParams()
  const userID = Number(id)
  const { data: user, isPending, isError } = useUsersByID(userID)

  if (isPending) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching that user...</div>
  }

  if (isNaN(userID)) {
    return <div>That user ID does not exist.</div>
  }

  return (
    <>
      <div>
        <h1>Profile Information</h1>
        <h2>{user.username}</h2>
        <div className="userContainer">
          <div className="userPicture">
            <img
              src={user.profile_picture_url}
              alt={user.name}
              className="userProfilePicture"
            />
            <div className="userPicture">
              <h4>Name: </h4>
              <p>{user.name}</p>
              <h4>Age: </h4>
              <p>{user.age}</p>
              <h4>Current Role: </h4>
              <p>{user.current_role}</p>
              <h4>Cohort: </h4>
              <p>{user.cohort}</p>
              <h4>GitHub: </h4>
              <p>{user.github_url}</p>
            </div>
          </div>
        </div>
        <Link to="/userForm">
          <button>Edit your Profile</button>
        </Link>
      </div>
    </>
  )
}

export default Profile
