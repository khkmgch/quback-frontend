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

//propsでid, title, description,isPrivate, booksを受け取るため、
//FC<Omit<Question_WithRelation, 'createdAt' | 'updatedAt' | 'userId'>>の型宣言をする
type Props = Omit<Question_WithRelation, 'updatedAt'> & {isMine: boolean}
export const QuestionItem: FC<Props> = ({
  id,
  title,
  description,
  isPrivate,
  createdAt,
  books,
  likes,
  userId,
  isMine
}) => {
  const PUBLIC_FOLDER = process.env.NEXT_PUBLIC_FOLDER
  //useStoreからcreatingQuestionを取り出す
  const { creatingQuestion } = useStore()
  //useStoreからupdateCreatingQuestionを取り出す
  const updateCreating = useStore((state) => state.updateCreatingQuestion)
  const updateEditing = useStore((state) => state.updateEditingQuestion)
  const { deleteQuestionMutation } = useMutateQuestion()
  
  //Questionを作成したユーザー
  const [questionUser, setQuestionUser] = useState<{
    userName: string | null
    profilePicture: string | null
  }>({
    userName: '',
    profilePicture: '',
  })

  timeago.register('ja', ja)

  useEffect(() => {
    // useEffect内で、非同期関数を作成して呼び出す必要がある
    const fetchQuestionUser = async () => {
      const reaponse: { data: Omit<User_WithRelation, 'hashedPassword'> } =
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`)
      console.log(reaponse)
      const user = reaponse.data
      setQuestionUser({
        userName: user.userName,
        profilePicture: user.profilePicture,
      })
    }
    fetchQuestionUser()
  }, [])

  return (
    <List.Item className="m-4 flex h-56 w-192 flex-col bg-white p-4">
      <div className="flex  h-12 items-center ">
        <Link href={`/profile/${userId}`} className="mx-5 flex items-center justify-center">
          <Image
            radius="xl"
            width={40}
            height={40}
            fit="contain"
            src={
              questionUser?.profilePicture
                ? PUBLIC_FOLDER + questionUser.profilePicture
                : PUBLIC_FOLDER + '/person/noAvatar.png'
            }
            alt=""
            className="ml-1 mr-2 cursor-pointer rounded-full outline outline-2 outline-offset-2 outline-gray-300 hover:outline-custom-blue-4"
          />
        </Link>
        <div className="flex flex-col">
          <h4 className='my-1 text-custom-blue-4'>{questionUser?.userName}</h4>

          <TimeAgo datetime={createdAt} locale="ja" className="text-custom-blue-2" />
        </div>
      </div>
      <div className="h-28  py-5 px-3">
        <span>{title}</span>
      </div>

      {/* float-leftでdivタグの中の要素を左に寄せる */}
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
              window.scroll({ top: 0, behavior: 'smooth' })
            }}
          />
        )}
      </div>
    </List.Item>
  )
}
// {allPostsData.map(({ id, title, date, thumbnail }) => (
//   <article key={id}>
//     <Link href={`/posts/${id}`}>
//       <img src={`${thumbnail}`} className={styles.thumbnailImage} />
//     </Link>
//     <Link href={`/posts/${id}`} className={utilStyle.boldText}>
//       {title}
//     </Link>
//     <br />
//     <small className={utilStyle.lightText}>{date}</small>
//   </article>
// ))}
