import { Grid, List, Loader } from '@mantine/core'
import { FC, useEffect, useState } from 'react'
import { Book_WithRelation } from '../types'
import axios from 'axios'
import { useQueryBooks } from '../hooks/useQueryBooks'
import { BookItem } from './BookItem'

type Props = {
  userId: number
  isMine: boolean
}
export const BookShelf: FC<Props> = ({ userId, isMine }) => {
  const [books, setBooks] = useState<Book_WithRelation[]>([])

  const { data: loginShelf, status } = useQueryBooks()

  //他の人の本棚、自分の本棚で場合分け
  useEffect(() => {
    type FetchBooks = () => Promise<void>
    const fetchBooks: FetchBooks = async () => {
      const response: { data: Book_WithRelation[] } = await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/book/all/shelf/${userId}`)
        .then((res) => res.data)
        .catch((err) => {
          console.error(err)
        })
      if (response) {
        setBooks(response.data)
      }
    }
    if (!isMine) {
      fetchBooks()
    } else if (status === 'success' && loginShelf) {
      console.log('loginshelf:', loginShelf)
      setBooks(loginShelf)
    }
  }, [status])
  if (status === 'loading') return <Loader />
  else
    return (
      <div className="mt-5  flex items-center justify-center bg-orange-200 p-5">
        <Grid className="w-256" gutter={30} align="flex-end ">
          {books?.map((book) => (
            <Grid.Col md={3} lg={2} key={book.id}>
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
              />
            </Grid.Col>
          ))}

          {/* <Grid.Col md={6} lg={3}>
            2
          </Grid.Col>
          <Grid.Col md={6} lg={3}>
            3
          </Grid.Col>
          <Grid.Col md={6} lg={3}>
            4
          </Grid.Col> */}
        </Grid>

        {/* <List my="lg" spacing="sm" size="sm" className="list-none">
          {books?.map((book) => (
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
            />
          ))}
        </List> */}
      </div>
    )
}
