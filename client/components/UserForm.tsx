import React, { useState } from 'react'
import { useAddUser, useEditUser } from '../hooks/useUsers'
import { User } from '../../models/users'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'

interface UserFormProps {
  userID: number | undefined
  isEditing: boolean
}

function UserForm({ userID, isEditing }: UserFormProps) {
  const { getAccessTokenSilently, user } = useAuth0()
  const { mutate: addUser, isPending, isSuccess, isError } = useAddUser()
  const { mutate: editUser } = useEditUser()
  const userDetails = {
    username: '',
    name: '',
    current_role: '',
    age: 0,
    profile_picture_url: '',
    cohort: '',
    facilitator: false,
    github_url: '',
    auth_id: '',
  }

  const [newUser, setNewUser] = useState<User>(userDetails)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewUser((prev) => ({ ...prev, [name]: value === 'yes' ? true : false }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isEditing) {
      const token = await getAccessTokenSilently()
      editUser({ user: { ...newUser, auth_id: user?.sub }, userID, token })
    } else {
      const token = await getAccessTokenSilently()
      addUser({ user: { ...newUser, auth_id: user?.sub }, token })
    }
  }

  return (
    <div className="userForm">
      {isError && <div>Failed to add user details</div>}
      {isSuccess && <div>New user details have been added</div>}
      {isPending && <div>Loading...</div>}
      <Link to="/">
        <button className="backButton">Go Back</button>
      </Link>
      <div className="userFormContainer">
        <div className="userFormImageBox">
          <h1 className="welcome">
            Welcome <br /> Username
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="userFormBox">
          <div className="userFormInputBox">
            <div className="textBox">
              <h1 className="editH1">Edit your details</h1>
            </div>
            <div className="userFormInputs">
              <div className="userFormInput userName">
                <label htmlFor="username">Username:</label>
                <input
                  required
                  id="username"
                  type="text"
                  name="username"
                  value={newUser.username}
                  className="textInput"
                  onChange={handleChange}
                />
              </div>

              <div className="userFormInput">
                <label htmlFor="name">Name:</label>
                <input
                  required
                  id="name"
                  type="text"
                  name="name"
                  value={newUser.name}
                  className="textInput"
                  onChange={handleChange}
                />
              </div>

              <div className="userFormInput">
                <label htmlFor="current_role">Current Role:</label>
                <input
                  required
                  id="current_role"
                  type="text"
                  name="current_role"
                  value={newUser.current_role}
                  className="textInput"
                  onChange={handleChange}
                />
              </div>

              <div className="userFormInput">
                <label htmlFor="age">Age:</label>
                <input
                  required
                  id="age"
                  type="number"
                  name="age"
                  value={newUser.age}
                  className="numberInput"
                  onChange={handleChange}
                />
              </div>

              <div className="userFormInput">
                <label htmlFor="profile_picture_url">Profile Picture:</label>
                <input
                  required
                  id="profile_picture_url"
                  type="text"
                  name="profile_picture_url"
                  value={newUser.profile_picture_url}
                  className="textInput"
                  onChange={handleChange}
                />
              </div>

              <div className="userFormInput">
                <label htmlFor="cohort">Cohort:</label>
                <input
                  required
                  id="cohort"
                  type="text"
                  name="cohort"
                  value={newUser.cohort}
                  className="textInput"
                  onChange={handleChange}
                />
              </div>

              <div className="userFormInput">
                <label htmlFor="facilitator">Facilitator:</label>
                <select
                  required
                  id="facilitator"
                  name="facilitator"
                  value={newUser.facilitator ? 'yes' : 'no'}
                  className="dropDownInput"
                  onChange={handleSelectChange}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="userFormInput">
                <label htmlFor="github_url">GitHub:</label>
                <input
                  required
                  id="github_url"
                  type="text"
                  name="github_url"
                  value={newUser.github_url}
                  className="textInput"
                  onChange={handleChange}
                />
              </div>
            </div>
            <button type="submit" className="submitButton">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserForm
