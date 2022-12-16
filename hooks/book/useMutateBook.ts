import { Book } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Book_WithRelation } from '../../types'

export const useMutateBook = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const createBookMutation = useMutation(
    async (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/book`,
        book
      )
      if (!res.data) {
        alert('既に本棚に存在します。')
        throw new Error('既に本棚に存在します。')
      } else return res.data
    },
    {
      onSuccess: (res) => {
        console.log('res: ', res.data)
        //既存のキャッシュをqueryClientのgetQueryDataを使って取得
        const previousBooks = queryClient.getQueryData<Book_WithRelation[]>([
          'books',
        ])
        if (previousBooks) {
          //既存のキャッシュの配列の先頭にresを追加してキャッシュを更新する
          queryClient.setQueryData(['books'], [res, ...previousBooks])
        }

        alert('本棚に追加しました。')
      },
      onError: (err: any) => {
        if (err.response.status === 401 || err.response.status === 403) {
          router.push('/')
        }
      },
    }
  )
  const deleteBookMutation = useMutation(
    async (id: number) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/book/${id}`)
    },
    {
      onSuccess: (_, variables) => {
        const previousBooks = queryClient.getQueryData<Book_WithRelation[]>([
          'books',
        ])
        if (previousBooks) {
          queryClient.setQueryData(
            ['books'],
            previousBooks.filter((book) => book.id !== variables)
          )
        }
        //ページをリロードする
        // window.location.reload()
      },
      onError: (err: any) => {
        if (err.response.status === 401 || err.response.status === 403) {
          router.push('/')
        }
      },
    }
  )
  return { createBookMutation, deleteBookMutation }
}
