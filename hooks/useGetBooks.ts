import axios from 'axios'
import React from 'react'
import { Book_WithRelation } from '../types'

export const useGetBook = () => {
  const getBooksById = async (userId: number) => {
    const response: { data: Book_WithRelation[] } = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/book/all/shelf/${userId}`)
      .then((res) => res.data)
      .catch((err) => {
        console.error(err)
        return null
      })
    return response
  }
  const getBookById = async (bookId: number) => {
    const response: Book_WithRelation = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/book/${bookId}`)
      .then((res) => res.data)
      .catch((err) => {
        console.error(err)
        return null
      })
    return response
  }
  return { getBooksById, getBookById }
}
