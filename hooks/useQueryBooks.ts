import { useRouter } from 'next/router'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Book } from '@prisma/client'
import { Book_WithRelation } from '../types'

export const useQueryBooks = () => {
  const router = useRouter()
  const getBooks = async () => {
    const { data } = await axios.get<Book_WithRelation[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/book/all/shelf`
    )
    return data
  }
  return useQuery<Book_WithRelation[], Error>({
    queryKey: ['books'],
    queryFn: getBooks,
    onError: (err: any) => {
      //401: unauthorized(jwt tokenが無効な場合、期限が切れている場合、)
      //403: csrf token が無効な場合
      if (err.response.status === 401 || err.response.status === 403) {
        router.push('/')
      }
    },
  })
}
