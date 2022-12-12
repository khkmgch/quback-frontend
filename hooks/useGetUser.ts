import axios from 'axios'
import React from 'react'
import { User_WithRelation } from '../types'

export const useGetUser = () => {
  const getUserById = async (userId: number) => {
    const response: { data: Omit<User_WithRelation, 'hashedPassword'> } | null =
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`)
        .then((res) => res)
        .catch((err) => {
          console.error(err)
          return null
        })
    return response
  }
  return { getUserById }
}
