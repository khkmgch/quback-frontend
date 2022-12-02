import { useRouter } from 'next/router'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Question_WithRelation } from '../types'

export const useQueryTimeline = () => {
  const router = useRouter()
  const getTimeline = async () => {
    const { data } = await axios.get<Question_WithRelation[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/question/all/timeline`
    )
    return data
  }
  return useQuery<Question_WithRelation[], Error>({
    queryKey: ['timeline'],
    queryFn: getTimeline,
    onError: (err: any) => {
      //401: unauthorized(jwt tokenが無効な場合、期限が切れている場合、)
      //403: csrf token が無効な場合
      if (err.response.status === 401 || err.response.status === 403) {
        router.push('/')
      }
    },
  })
}