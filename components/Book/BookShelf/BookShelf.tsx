import { Grid, List, Loader, ScrollArea } from '@mantine/core'
import { FC, useEffect, useState } from 'react'
import { Book_WithRelation } from '../../../types'
import { useQueryBooks } from '../../../hooks/book/useQueryBooks'
import { BookItem } from '../BookItem/BookItem'
import { bookShelfUtils } from './utils'

type Props = {
  userId: number
  isMine: boolean
  questionId?: number | null
}
export const BookShelf: FC<Props> = ({ userId, isMine, questionId }) => {
  //状態

  //本棚に表示する本
  const [books, setBooks] = useState<Book_WithRelation[]>([])

  //ログインしているユーザーの本棚
  const { data: loginShelf, status } = useQueryBooks()

  //メソッド

  //fetchBooks:userIdで特定のユーザーの本棚を取得して配列を返すメソッド
  const { linkTo, fetchBooks } = bookShelfUtils()

  //本とQuestionを紐づけするメソッド
  const linkToQuestion = (bookId: number) => {
    return linkTo(bookId, questionId)
  }

  //コンポーネントの状態を初期化するメソッド
  //他の人の本棚or自分の本棚で場合分け
  const init = async (isMine: boolean, userId: number) => {
    if (!isMine) {
      const books = await fetchBooks(userId)
      console.log('books: ', books)
      setBooks(books)
    } else if (status === 'success' && loginShelf) {
      setBooks(loginShelf)
    }
  }

  useEffect(() => {
    init(isMine, userId)
  }, [status, loginShelf])

  if (status === 'loading') return <Loader />
  //プロフィール本棚閲覧の場合
  else if (!questionId)
    return (
      <div className="mt-5  flex w-4/5 items-center justify-center bg-custom-yellow lg:w-256 lg:p-5">
        <ScrollArea
          w={{ base: 350, sm: 500, md: 750, lg: 1024 }}
          h={{ base: 350, sm: 500, md: 750, lg: 750 }}
          offsetScrollbars
        >
          <Grid className="" gutter={30} align="flex-end ">
            {books?.map((book) => (
              <Grid.Col sm={6} md={4} lg={2} key={book.id}>
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
                  isMine={isMine}
                  isShelf={true}
                  isLinked={false}
                />
              </Grid.Col>
            ))}
          </Grid>
        </ScrollArea>
      </div>
    )
  //Question編集画面に本のリストとして表示する場合
  else
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
                  isLinked={false}
                  linkToQuestion={linkToQuestion}
                />
              )
          )}
        </List>
      </ScrollArea>
    )
}
