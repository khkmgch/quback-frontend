import { FC, useEffect, useState } from 'react'
import { Image, List } from '@mantine/core'
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import useStore from '../store'
import { useMutateQuestion } from '../hooks/useMutateQuestion'
import Link from 'next/link'
import { Question_WithRelation, User_WithRelation } from '../types'
import { useQueryUser } from '../hooks/useQueryUser'
import axios from 'axios'

import TimeAgo from 'timeago-react'
import * as timeago from 'timeago.js'
import ja from 'timeago.js/lib/lang/ja'
import { IconCopy } from '@tabler/icons'
import { useRouter } from 'next/router'
import { useGetUser } from '../hooks/useGetUser'

type Props = Omit<Question_WithRelation, 'updatedAt'> & { isMine: boolean }
export const QuestionItem: FC<Props> = ({
  id,
  title,
  description,
  isPrivate,
  createdAt,
  books,
  likes,
  userId,
  isMine,
}) => {
  const PUBLIC_FOLDER = process.env.NEXT_PUBLIC_FOLDER
  const router = useRouter()

  //useStoreからupdateCreatingQuestionを取り出す
  const updateCreating = useStore((state) => state.updateCreatingQuestion)
  const updateEditing = useStore((state) => state.updateEditingQuestion)
  const { deleteQuestionMutation } = useMutateQuestion()

  const { getUserById } = useGetUser()

  //Questionを作成したユーザー
  const [questionUser, setQuestionUser] = useState<{
    userName: string | null
    profilePicture: string | null
  }>({
    userName: '',
    profilePicture: '',
  })

  timeago.register('ja', ja)

  const fetchQuestionUser = async () => {
    const response: { data: Omit<User_WithRelation, 'hashedPassword'> } | null =
      await getUserById(userId)
    if (response) {
      return response.data
    } else return null
  }
  const init = async () => {
    const user = await fetchQuestionUser()
    if (user) {
      setQuestionUser({
        userName: user.userName,
        profilePicture: user.profilePicture,
      })
    }
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <List.Item className="m-4 flex h-56 w-192 flex-col bg-white p-4">
      <div className="flex  h-12 items-center ">
        <Link
          href={`/profile/${userId}`}
          className="mx-5 flex items-center justify-center"
        >
          <Image
            radius="xl"
            width={40}
            height={40}
            fit="cover"
            src={
              questionUser?.profilePicture
                ? PUBLIC_FOLDER + "/" + questionUser.profilePicture
                : PUBLIC_FOLDER + '/person/noAvatar.png'
            }
            alt=""
            className="ml-1 mr-2 cursor-pointer rounded-full outline outline-2 outline-offset-2 outline-gray-300 hover:outline-custom-blue-4"
          />
        </Link>
        <div className="flex flex-col">
          <h4 className="my-1 text-custom-blue-4">{questionUser?.userName}</h4>

          <TimeAgo
            datetime={createdAt}
            locale="ja"
            className="text-custom-blue-2"
          />
        </div>
      </div>
      <div className="h-28  py-5 px-3">
        <span className="text-lg">{title}</span>
      </div>

      <div className="flex h-8 items-start justify-end  pt-1">
        {isMine ? (
          <>
            <Link href={`/question/${id}`}>
              <PencilAltIcon
                className="mx-1 h-6 w-6 cursor-pointer text-custom-blue-2 hover:text-custom-blue-4"
                //クリックされた時に、Zustandのid, title, descriptionの値を現在フォーカスしているQuestionItemの値に書き換える
                onClick={() => {
                  updateEditing({
                    id,
                    title,
                    description,
                    isPrivate,
                    books,
                    likes,
                  })
                }}
              />
            </Link>
            <TrashIcon
              className="h-6 w-6 cursor-pointer text-custom-blue-2 hover:text-custom-blue-4"
              onClick={() => {
                deleteQuestionMutation.mutate(id)
              }}
            />
          </>
        ) : (
          <IconCopy
            className="h-6 w-6 cursor-pointer text-gray-500 hover:text-teal-500"
            onClick={() => {
              updateCreating({ title: title, isPrivate: false })
              router.push('/plaza')
              // window.scroll({ top: 0, behavior: 'smooth' })
            }}
          />
        )}
      </div>
    </List.Item>
  )
}
