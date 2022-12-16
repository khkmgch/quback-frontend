import axios from 'axios'
import React from 'react'
import { Question_WithRelation } from '../../types'

export const useGetQuestion = () => {
  const getQuestionById = async (id: number) => {
    const response: { data: Question_WithRelation } | null = await axios
      .get<Question_WithRelation>(
        `${process.env.NEXT_PUBLIC_API_URL}/question/${id}`
      )
      .then((res) => res)
      .catch((err) => {
        console.error(err)
        return null
      })
    return response
  }
  //ログインしているユーザーのタイムラインに表示するクエスチョンを全て取得
  const getTimelineQuestions = async () => {
    const response: { data: Question_WithRelation[] } | null = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/question/all/timeline`)
      .then((res) => res)
      .catch((err) => {
        console.error(err)
        return null
      })
    return response
  }
  //ユーザーのクエスチョンを全て取得
  const getQuestionsByUserId = async (userId: number) => {
    const response: { data: Question_WithRelation[] } | null = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/question/all/profile/${userId}`)
      .then((res) => res)
      .catch((err) => {
        console.error(err)
        return null
      })
    return response
  }
  const getAllQuestions = async () => {
    const response: { data: Question_WithRelation[] } | null = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/question/all/allusers`)
      .then((res) => res)
      .catch((err) => {
        console.error(err)
        return null
      })
    return response
  }

  return {
    getTimelineQuestions,
    getQuestionsByUserId,
    getAllQuestions,
    getQuestionById,
  }
}