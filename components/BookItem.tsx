import { FC, useEffect, useState } from 'react'
import { Image, List } from '@mantine/core'
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

type Props = Omit<Book_WithRelation, 'updatedAt'> & {
  isMine: boolean
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
}) => {
  //本を本棚から削除するメソッド
  //
  //   const { deleteQuestionMutation } = useMutateQuestion()

  useEffect(() => {}, [])

  return (
    <div className="p-1 cursor-pointer drop-shadow-md hover:drop-shadow-2xl hover:contrast-200">
      <div className="flex h-full items-center justify-center">
        <img src={imgLink || ''} alt="" className="object-cover" />
      </div>

      {/* <div className="flex h-8 items-start justify-end  pt-1">
        {isMine ? (
          <>
            <Link href={`/question/${id}`}>
              <PencilAltIcon className="mx-1 h-6 w-6 cursor-pointer text-gray-500 hover:text-teal-500" />
            </Link>
            <TrashIcon
              className="h-6 w-6 cursor-pointer text-gray-500 hover:text-teal-500"
              onClick={() => {
                // deleteQuestionMutation.mutate(id)
              }}
            />
          </>
        ) : (
          <></>
        )}
      </div> */}
    </div>
  )
}

// export const QuestionItem: FC<Props> = ({}) => {
//   const PUBLIC_FOLDER = process.env.NEXT_PUBLIC_FOLDER
//   //useStoreからcreatingQuestionを取り出す
//   const { creatingQuestion } = useStore()
//   //useStoreからupdateCreatingQuestionを取り出す
//   const updateCreating = useStore((state) => state.updateCreatingQuestion)
//   const updateEditing = useStore((state) => state.updateEditingQuestion)
//   const { deleteQuestionMutation } = useMutateQuestion()
//   //ログインしているユーザー
//   const { data: loginUser, status } = useQueryUser()
//   //Questionを作成したユーザー
//   const [questionUser, setQuestionUser] = useState<{
//     userName: string | null
//     profilePicture: string | null
//   }>({
//     userName: '',
//     profilePicture: '',
//   })

//   useEffect(() => {
//     // useEffect内で、非同期関数を作成して呼び出す必要がある
//     const fetchQuestionUser = async () => {
//       const reaponse: { data: Omit<User_WithRelation, 'hashedPassword'> } =
//         await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`)
//       console.log(reaponse)
//       const user = reaponse.data
//       setQuestionUser({
//         userName: user.userName,
//         profilePicture: user.profilePicture,
//       })
//     }
//     fetchQuestionUser()
//   }, [])

//   return (
//     <List.Item className="m-4 flex h-56 w-192 flex-col bg-white p-4">
//       <div className="flex  h-12 items-center "></div>
//       <div className="h-28  py-1">
//         <span>{title}</span>
//       </div>

//       {/* float-leftでdivタグの中の要素を左に寄せる */}
//       <div className="flex h-8 items-start justify-end  pt-1">
//         {userId === loginUser?.id ? (
//           <>
//             <Link href={`/question/${id}`}>
//               <PencilAltIcon className="mx-1 h-6 w-6 cursor-pointer text-gray-500 hover:text-teal-500" />
//             </Link>
//             <TrashIcon
//               className="h-6 w-6 cursor-pointer text-gray-500 hover:text-teal-500"
//               onClick={() => {
//                 deleteQuestionMutation.mutate(id)
//               }}
//             />
//           </>
//         ) : (
//           <IconCopy
//             className="h-6 w-6 cursor-pointer text-gray-500 hover:text-teal-500"
//             onClick={() => {
//               updateCreating({ title: title, isPrivate: false })
//               window.scroll({ top: 0, behavior: 'smooth' })
//             }}
//           />
//         )}
//       </div>
//     </List.Item>
//   )
// }
