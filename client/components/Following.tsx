import { useAuth0 } from "@auth0/auth0-react"



function Following() {
  const { user } = useAuth0() 
  const {data: followedUsers, isPending, isError} = useFollowedUsers(user?.sub || '')
}

export default Following
