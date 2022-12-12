import { Grid, List, Loader, ScrollArea } from '@mantine/core'
import { FC, useEffect, useState } from 'react'
import { Book_WithRelation, Question_WithRelation } from '../types'
import axios from 'axios'
import { useQueryBooks } from '../hooks/useQueryBooks'
import { BookItem } from './BookItem'
import { Link } from '@prisma/client'
import { useMutateQuestion } from '../hooks/useMutateQuestion'
import { useGetBook } from '../hooks/useGetBooks'

type Props = {
  links: Link[]
  questionId?: number | null
}
export const BookList: FC<Props> = ({ links, questionId }) => {
  type Data = Book_WithRelation | null
  const [books, setBooks] = useState<Data[]>([])

  const { getBookById } = useGetBook()

  const { unLinkToBook_QuestionMutation } = useMutateQuestion()

  const unLinkToQuestion = (bookId: number) => {
    if (questionId) {
      unLinkToBook_QuestionMutation.mutate({ questionId, bookId })
    }
  }

  const init = async (links: Link[]) => {
    if (links.length <= 0) return
    else {
      const fetchBooks = async () => {
        const books: Data[] = new Array(links.length)
        for (let i = 0; i < links.length; i++) {
          const book = await getBookById(links[i].bookId)
          books[i] = book
        }
        return books
      }
      const data = await fetchBooks()
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
