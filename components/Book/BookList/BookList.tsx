import { Grid, List, Loader, ScrollArea } from '@mantine/core'
import { FC, useEffect, useState } from 'react'
import { Book_WithRelation, Question_WithRelation } from '../../../types'
import axios from 'axios'
import { useQueryBooks } from '../../../hooks/book/useQueryBooks'
import { BookItem } from '../BookItem/BookItem'
import { Link } from '@prisma/client'
import { useMutateQuestion } from '../../../hooks/question/useMutateQuestion'
import { useGetBook } from '../../../hooks/book/useGetBook'
import { bookListUtils } from './utils'

type Props = {
  links: Link[]
  questionId?: number | null
}
export const BookList: FC<Props> = ({ links, questionId }) => {
  //状態

  //本のリスト
  const [books, setBooks] = useState<Array<Book_WithRelation | null>>([])

  //メソッド

  //fetchBooks:本のリストを取得して返すメソッド
  const { unLinkTo, fetchBooks } = bookListUtils()

  //Questionと本の紐づけを切るメソッド
  const unLinkToQuestion = (bookId: number) => {
    return unLinkTo(bookId, questionId)
  }

  //コンポーネントを初期設定するメソッド
  const init = async (links: Link[]) => {
    if (links.length <= 0) return
    else {
      const data = await fetchBooks(links)
      if (data) {
        setBooks(data)
      }
    }
  }

  useEffect(() => {
    init(links)
  }, [])
  return (
    <ScrollArea style={{ height: 700 }} offsetScrollbars>
      <List my="lg" spacing="sm" size="sm" className="list-none">
        {books?.map(
          (book) =>
            book && (
              <BookItem
                id={book.id}
                createdAt={book.createdAt}
                googleBooksId={book.googleBooksId}
                isbn={book.isbn}
                title={book.title}
                authors={book.authors}
                publisher={book.publisher}
                publishedDate={book.publishedDate}
                pageCount={book.pageCount}
                imgLink={book.imgLink}
                previewLink={book.previewLink}
                links={book.links}
                userId={book.userId}
                isMine={true}
                key={book.id}
                isShelf={false}
                isLinked={true}
                unLinkToQuestion={unLinkToQuestion}
              />
            )
        )}
      </List>
    </ScrollArea>
  )
}
