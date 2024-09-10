import { useEffect } from 'react'
import { useLikesByPostId } from '../hooks/useLikes'
import { useAuth0 } from '@auth0/auth0-react'
import { useUserByAuthId } from '../hooks/useUsers'

const LikesCounter = ({ handleLikeToggle, postId, likedPosts }) => {
  const { user: authUser } = useAuth0()
  const { data: userData } = useUserByAuthId(authUser?.sub || '')
  const { data: likes, refetch } = useLikesByPostId(postId)

  useEffect(() => {
    refetch()
  }, [likedPosts, refetch])

  const checkIfLiked = (postId: number) => {
    return (
      likedPosts[postId] || likes?.find((like) => like.user_id === userData?.id)
    )
  }

  // Lets wait for postId and likes to load before we show the heart
  if (!postId || !likes) return null

  return (
    <button
      className="hideShowLike"
      onClick={() => handleLikeToggle(postId, checkIfLiked(postId))}
      // disabled={isLiking || isUnliking}
    >
      {checkIfLiked(postId) ? (
        <img
          className="heart"
          src="https://www.freeiconspng.com/thumbs/heart-icon/valentine-heart-icon-6.png"
          alt="heart"
        />
      ) : (
        <img
          className="heart"
          src="https://freesvg.org/img/heart-15.png"
          alt="heart"
        />
      )}
      <p>{likes?.length}</p>
    </button>
  )
}

export default LikesCounter
