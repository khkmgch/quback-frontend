import axios from 'axios'

export const useUpdateUser = () => {
  //フォローとフォロー解除のメソッド
  const followUser = async (
    userId: number | undefined,
    targetUserId: number,
    isFollow: boolean
  ) => {
    if (userId !== undefined && userId !== targetUserId) {
      if (!isFollow) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${targetUserId}/follow`
        )
      } else {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${targetUserId}/unfollow`
        )
      }
    }
  }
  return { followUser }
}
