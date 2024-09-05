import React, { useState } from 'react'
import { useAddUser } from '../hooks/useUsers'
import { User } from '../../models/user'

function UserForm() {
  const { mutate: addUser, isPending, isSuccess, isError } = useAddUser()
  const userDetails = {
    username: '',
    name: '',
    current_role: '',
    age: '',
    profile_picture_url: '',
    cohort: '',
    github_url: '',
  }
  const [newUser, setNewUser] = useState<User>(userDetails)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    addUser(newUser)
    setNewUser(userDetails)
  }

  return (
    <>
      {isError && <div>Failed to add user details</div>}
      {isSuccess && <div>New user details have been added</div>}
      {isPending && <div>Loading...</div>}
      <h2>User information</h2>
      <div className="userFormContainer">
        <form onSubmit={handleSubmit}>
          <div className="userFormInput">
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
          <br></br>
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
          <br></br>
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
          <br></br>
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
          <br></br>
          <div className="userFormInput">
            <label htmlFor="profile_picture_url">Profile Picture URL:</label>
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
          <br></br>
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
          <br></br>
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
          <br></br>
          <div></div>
          <button className="submitButton">Submit</button>
        </form>
      </div>
    </>
  )
}

export default UserForm
