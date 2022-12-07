import { Button, Center, List } from '@mantine/core'
import axios from 'axios'
import React, { FC, FormEvent, useEffect, useState } from 'react'
import { useMutateBook } from '../hooks/useMutateBook'

// googleBooksId String
//   isbn String?
//   title String?
//   authors String[]
//   publisher String?
//   publishedDate String?
//   pageCount String?
//   imgLink String?
//   previewLink String?

type Item = {
  id: string
  volumeInfo: {
    allowAnonLogging: boolean
    authors: string[]
    canonicalVolumeLink: string
    categories: string[]
    contentVersion: string
    description: string
    imageLinks: { smallThumbnail: string; thumbnail: string }
    industryIdentifiers: Array<{ type: string; identifier: string }>
    infoLink: string
    language: string
    maturityRating: string
    pageCount: number
    previewLink: string
    printType: string
    publishedDate: string
    readingModes: { text: boolean; image: boolean }
    title: string
  }
}

type Props = {
  id: string
  info: {
    authors?: string[] | null
    categories?: string[] | null
    description?: string | null
    imageLinks?: { smallThumbnail: string; thumbnail: string } | null
    industryIdentifiers?: Array<{ type: string; identifier: string }> | null
    pageCount?: number | null
    previewLink?: string | null
    publishedDate?: string | null
    readingModes?: { text: boolean; image: boolean } | null
    title?: string | null
  }
}

{
  /* // googleBooksId String
//   isbn String?
//   title String?
//   authors String[]
//   publisher String?
//   publishedDate String?
//   pageCount String?
//   imgLink String?
//   previewLink String? */
}
export const SearchBookItem: FC<Props> = ({ id, info }) => {
  const { createBookMutation } = useMutateBook()
  const [isbn13, setIsbn13] = useState('')
  const [detailData, setDetailData] = useState<{ anix: any; summary: any }>({
    anix: null,
    summary: null,
  })

  const findIsbn13 = () => {
    if (info.industryIdentifiers) {
      for (let i = 0; i < info.industryIdentifiers.length; i++) {
        let curr = info.industryIdentifiers[i]
        if (curr.type === 'ISBN_13') {
          setIsbn13(curr.identifier)
          break
        }
      }
    }
  }
  const fetchDetailData = async () => {
    const response = await fetch(
      `https://api.openbd.jp/v1/get?isbn=${isbn13}&pretty`
    )
      .then((res) => res)
      .catch((err) => {
        console.error(err)
        return null
      })
    if (response) {
      const json = await response
        .json()
        .then((json) => json)
        .catch((err) => {
          console.error(err)
          return null
        })
      if (json) {
        console.log(json[0])
        setDetailData(json[0])
      }
    }
  }
  const addBook = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = {
      title: info.title || '',
      googleBooksId: id,
      isbn: isbn13,
      authors: info.authors || [],
      publisher: detailData?.summary?.publisher || '',
      publishedDate: info.publishedDate || '',
      pageCount: info.pageCount ? info.pageCount.toString() : '',
      imgLink: info.imageLinks?.thumbnail || '',
      previewLink: info.previewLink || '',
    }
    createBookMutation.mutate(data)
  }

  useEffect(() => {
    findIsbn13()
  }, [])
  useEffect(() => {
    if (isbn13 !== '') {
      fetchDetailData()
    }
  }, [isbn13])
  return (
    <List.Item className="m-4 bg-white p-4">
      <div className="flex h-56 w-192 flex-row">
        <div className="flex h-full w-1/4 flex-initial items-center justify-center border-2 border-dotted border-gray-400 bg-slate-100">
          <img
            src={info.imageLinks?.thumbnail || ''}
            className="object-cover"
          />
        </div>
        <div className="flex w-1/2 flex-col ">
          {/* <div>googleBooksId: {id}</div>
          <div>isbn13: {isbn13}</div> */}

          <div>
            <h3>「{info.title || ''}」</h3>
          </div>
          <div className="ml-10 w-4/5 ">
            <div className="mb-3 flex">
              <div className="w-1/6">初版: </div>
              <div className="w-5/6">{info.publishedDate}</div>
            </div>
            <div className="mb-3 flex">
              <div className="w-1/6">著者: </div>
              <div className="w-5/6">
                {info.authors?.map((author, index) => (
                  <span key={index}>{author} 、</span>
                ))}
              </div>
            </div>
            <div className="mb-3 flex">
              <div className="w-1/6">出版: </div>
              <div className="w-5/6">{detailData?.summary?.publisher}</div>
            </div>

            <div className="flex">
              <div className="w-1/6">ページ: </div>
              <div className="w-5/6">{info.pageCount}</div>
            </div>
          </div>
        </div>
        <div className="flex w-1/4 flex-col items-center justify-around ">
          <Button variant="light" color="gray">
            <a href={info.previewLink || ''} style={{ textDecoration: 'none' }}>
              詳しく見る
            </a>
          </Button>
          <form
            onSubmit={(e) => {
              addBook(e)
            }}
            className="flex justify-center"
          >
            <Button type="submit" variant="light" color="orange">
              本棚に追加
            </Button>
          </form>
        </div>
      </div>
    </List.Item>
  )
}
