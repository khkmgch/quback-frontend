import { FC, useEffect, useState } from 'react'
import { Image, List, ThemeIcon } from '@mantine/core'
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import { Question, User } from '@prisma/client'
import useStore from '../store'
import { useMutateQuestion } from '../hooks/useMutateQuestion'
import Link from 'next/link'
import { Question_WithRelation, User_WithRelation } from '../types'
import { useQueryUser } from '../hooks/useQueryUser'
import axios from 'axios'

//propsでid, title, description,isPrivate, booksを受け取るため、
//FC<Omit<Question_WithRelation, 'createdAt' | 'updatedAt' | 'userId'>>の型宣言をする
type Props = Omit<Question_WithRelation, 'createdAt' | 'updatedAt'>
export const QuestionItem: FC<Props> = ({
  id,
  title,
  description,
  isPrivate,
  books,
  likes,
  userId,
}) => {
  const PUBLIC_FOLDER = process.env.NEXT_PUBLIC_FOLDER
  const update = useStore((state) => state.updateEditingQuestion)
  const { deleteQuestionMutation } = useMutateQuestion()
  //ログインしているユーザー
  const { data: loginUser, status } = useQueryUser()
  //Questionを作成したユーザー
  const [questionUser, setQuestionUser] = useState<{
    userName: string | null
    profilePicture: string | null
  }>({
    userName: '',
    profilePicture: '',
  })

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
      <div className="flex  h-12 items-center bg-teal-500">
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
          className="ml-1 mr-2 cursor-pointer rounded-full outline outline-2 outline-offset-2 outline-gray-300 hover:outline-indigo-500"
        />
        <span>{questionUser?.userName}</span>
      </div>
      <div className="h-28 bg-blue-400 py-1">
        <span>{title}</span>
      </div>

      {/* float-leftでdivタグの中の要素を左に寄せる */}
      <div className="flex h-8 items-start justify-end bg-rose-400 pt-1">
        <Link href={`/question/${id}`}>
          <PencilAltIcon
            className="mx-1 h-6 w-6 cursor-pointer text-blue-500"
            //クリックされた時に、Zustandのid, title, descriptionの値を現在フォーカスしているQuestionItemの値に書き換える
            onClick={() => {
              update({ id, title, description, isPrivate, books, likes })
            }}
          />
        </Link>
        <TrashIcon
          className="h-6 w-6 cursor-pointer text-blue-500"
          onClick={() => {
            deleteQuestionMutation.mutate(id)
          }}
        />
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
