import { Link } from '@prisma/client'
import React from 'react'
import { useGetBook } from '../../../../hooks/book/useGetBook'
import { useMutateQuestion } from '../../../../hooks/question/useMutateQuestion'
import { Book_WithRelation } from '../../../../types'

export const bookListUtils = () => {
  //Questionと本の紐づけを切るためのapi通信を行うメソッド
  const { unLinkToBook_QuestionMutation } = useMutateQuestion()

  //Questionと本の紐づけを切るメソッド
  const unLinkTo = (bookId: number, questionId: number | null | undefined) => {
    if (questionId) {
      unLinkToBook_QuestionMutation.mutate({ questionId, bookId })
    }
  }

  type Data = Book_WithRelation | null
  //本棚から特定の本を取得するメソッド
  const { getBookById } = useGetBook()

  //本のリストを取得して返すメソッド
  const fetchBooks = async (links: Link[]) => {
    const books: Data[] = new Array(links.length)
    for (let i = 0; i < links.length; i++) {
      const book = await getBookById(links[i].bookId)
      books[i] = book
    }
    return books
  }
  return { unLinkTo, fetchBooks }
}
