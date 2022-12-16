import React from 'react'
import { useGetUser } from '../../../../hooks/user/useGetUser'
import { User_WithRelation } from '../../../../types'

export const questionItemUtils = () => {
  //idでユーザーを取得するメソッド
  const { getUserById } = useGetUser()

  const fetchQuestionUser = async (userId: number) => {
    const response: { data: Omit<User_WithRelation, 'hashedPassword'> } | null =
      await getUserById(userId)
    if (response) {
      return response.data
    } else return null
  }
  return { fetchQuestionUser }
}
