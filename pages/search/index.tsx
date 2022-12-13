import { Button, Group, List, TextInput } from '@mantine/core'
import axios from 'axios'
import { NextPage } from 'next'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { Layout } from '../../components/Layout'
import { SearchBookItem } from '../../components/SearchBookItem'
import { useQueryBooks } from '../../hooks/useQueryBooks'

const Search: NextPage = () => {
  const keywordRef = useRef<HTMLInputElement>(null)

  type Data = {
    kind: string
    totalItems: number
    items: Array<any>
  }
  const [data, setData] = useState<Data>({
    kind: '',
    totalItems: 0,
    items: [],
  })

  const fetchBooks = async (keyword: string) => {
    const reaponse: {
      data: Data
    } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/book/search/${keyword}`
    )
    console.log('キーワード：', keyword)
    // console.log('レスポンスデータ：', reaponse)
    const data = reaponse.data
    setData(data)
    console.log('本のデータ：', data)
  }
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (keywordRef.current !== null) {
      fetchBooks(keywordRef.current?.value)
    }
  }
  return (
    <Layout title="Search">
      <div>
        <h3>本の検索</h3>
      </div>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex items-center justify-center"
      >
        <TextInput
          placeholder="キーワードを入力してください。"
          variant="filled"
          radius="lg"
          size="md"
          ref={keywordRef}
          className="mr-5 w-96"
        />
        {/* <Group position="right" mt="md"> */}
        <Button type="submit" variant="light" color="teal">
          探す
        </Button>
        {/* </Group> */}
      </form>

      <List my="lg" spacing="sm" size="sm" className="list-none">
        {data.items.map((item) => (
          <SearchBookItem
            key={item.id.toString()}
            id={item.id}
            info={item.volumeInfo}
          />
        ))}
      </List>
    </Layout>
  )
}

export default Search
