import { User } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import React from 'react'
import { number, string } from 'yup'
import { User_WithRelation } from '../types'

export const useMutateUser = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  type Data = {
    id: number
    userName: string
    profilePicture: string
    coverPicture: string
  }
  const updateUserMutation = useMutation(
    async (user: Data) => {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/user`,
        user
      )
      return res.data
    },
    {
      onSuccess: (res, variables) => {
        const previousUser = queryClient.getQueryData<User_WithRelation>([
          'user',
        ])
        if (previousUser) {
          queryClient.setQueryData(['user'], res)
        }
      },
      onError: (err: any) => {
        if (err.response.status === 401 || err.response.status === 403) {
          router.push('/')
        }
      },
    }
  )
  return { updateUserMutation }
}
