import { FC, MouseEvent, useEffect, useState } from 'react'
import { Image, List, Menu } from '@mantine/core'
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import useStore from '../store'
import { useMutateQuestion } from '../hooks/useMutateQuestion'
import Link from 'next/link'
import {
  Book_WithRelation,
  Question_WithRelation,
  User_WithRelation,
} from '../types'
import { useQueryUser } from '../hooks/useQueryUser'
import axios from 'axios'
import { Book } from '@prisma/client'
import { IconArrowsLeftRight, IconExternalLink, IconTrash } from '@tabler/icons'
import { useMutateBook } from '../hooks/useMutateBook'

type Props = Omit<Book_WithRelation, 'updatedAt'> & {
  isMine: boolean
  isShelf: boolean
  isLinked: boolean
  linkToQuestion?: (bookId: number) => void
  unLinkToQuestion?: (bookId: number) => void
}
export const BookItem: FC<Props> = ({
  id,
  createdAt,
  googleBooksId,
  isbn,
  title,
  authors,
  publisher,
  publishedDate,
  pageCount,
  imgLink,
  previewLink,
  links,
  userId,
  isMine,
  isShelf,
  isLinked,
  linkToQuestion,
  unLinkToQuestion,
}) => {
  const { updateQuestionMutation } = useMutateQuestion()
  //本を本棚から削除するメソッド
  const { deleteBookMutation } = useMutateBook()

  //Questionと本を紐づけするメソッド
  const createLinkToQuestion = () => {
    if (linkToQuestion) {
      linkToQuestion(id)
    }
  }
  const deleteLinkToQuestion = () => {
    if (unLinkToQuestion) {
      unLinkToQuestion(id)
    }
  }
  const deleteBookFromShelf = () => {
    deleteBookMutation.mutate(id)
  }
  useEffect(() => {}, [])

  //Questionの編集画面で、Questionと紐づけされた本を縦のリスト表示する場合
  if (isLinked)
    return (
      <Menu shadow="md" position="bottom" offset={-40} withArrow>
        <Menu.Target>
          <div className="my-3 cursor-pointer p-1 drop-shadow-md hover:contrast-200 hover:drop-shadow-2xl">
            <div className="flex h-full items-center justify-center">
              <img src={imgLink || ''} alt="" className="object-cover" />
            </div>
          </div>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            icon={<IconExternalLink size={14} />}
            component="a"
            href={previewLink || ''}
            target="_blank"
          >
            詳しく見る
          </Menu.Item>
          <Menu.Divider />

          <Menu.Item
            color="red"
            icon={<IconTrash size={14} />}
            onClick={() => deleteLinkToQuestion()}
          >
            削除
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    )
  //Questionの編集画面に、My本棚の本を縦にリスト表示する場合
  else if (isMine && !isShelf)
    return (
      <Menu shadow="md" position="bottom" offset={-40} withArrow>
        <Menu.Target>
          <div className="my-3 cursor-pointer p-1 drop-shadow-md hover:contrast-200 hover:drop-shadow-2xl">
            <div className="flex h-full items-center justify-center">
              <img src={imgLink || ''} alt="" className="object-cover" />
            </div>
          </div>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            icon={<IconArrowsLeftRight size={14} />}
            onClick={() => createLinkToQuestion()}
          >
            追加
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    )
  //自分のプロフィールの本棚閲覧画面の場合
  else if (isMine)
    return (
      <Menu shadow="md" position="bottom" offset={-40} withArrow>
        <Menu.Target>
          <div className="my-3 cursor-pointer p-1 drop-shadow-md hover:contrast-200 hover:drop-shadow-2xl">
            <div className="flex h-full items-center justify-center">
              <img src={imgLink || ''} alt="" className="object-cover" />
            </div>
          </div>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            icon={<IconExternalLink size={14} />}
            component="a"
            href={previewLink || ''}
            target="_blank"
          >
            詳しく見る
          </Menu.Item>
          <Menu.Divider />

          <Menu.Item
            color="red"
            icon={<IconTrash size={14} />}
            onClick={() => deleteBookFromShelf()}
          >
            削除
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    )
  //他の人のプロフィールの本棚閲覧画面の場合
  else
    return (
      <Menu shadow="md" position="bottom" offset={-40} withArrow>
        <Menu.Target>
          <div className="my-3 cursor-pointer p-1 drop-shadow-md hover:contrast-200 hover:drop-shadow-2xl">
            <div className="flex h-full items-center justify-center">
              <img src={imgLink || ''} alt="" className="object-cover" />
            </div>
          </div>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            icon={<IconExternalLink size={14} />}
            component="a"
            href={previewLink || ''}
            target="_blank"
          >
            詳しく見る
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    )
}
