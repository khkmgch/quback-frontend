import { List, Loader } from '@mantine/core'
import { QuestionItem } from './QuestionItem'
import { FC, useEffect, useState } from 'react'
import { Question_WithRelation } from '../types'
import axios from 'axios'
import { useQueryQuestions } from '../hooks/useQueryQuestions'
import { stat } from 'fs'

//SSRの場合
//contextにはユーザーがリクエストした情報が入る
// export async function getServerSideProps(context) {
//   return {
//     props: {
//       //コンポーネントに渡すためのprops
//     },
//   }
// }

type Props = {
  isTimeline: boolean
  isMine: boolean
  userId: number
}
export const QuestionList: FC<Props> = ({ isTimeline, isMine, userId }) => {
  //mode === 'Profile'の場合、ログインしているユーザーのQuestion一覧をuseQueryQuestionsから取得
  //mode === 'Timeline'の場合、ログインしているユーザーとフォローしているユーザーのQuestionの一覧をuseQueryTimelineから取得
  const [questions, setQuestions] = useState<Question_WithRelation[]>([])

  const { data: loginQuestions, status } = useQueryQuestions()

  //タイムライン、他の人のプロフィール、自分のプロフィールで場合分け
  useEffect(() => {
    if (userId !== 0) {
      const fetchQuestions = async () => {
        const response: { data: Question_WithRelation[] } = isTimeline
          ? await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/question/all/timeline`
            )
          : !isMine
          ? await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/question/all/profile/${userId}`
            )
          : typeof loginQuestions !== 'undefined'
          ? { data: loginQuestions }
          : { data: [] }
        console.log(response)
        const questions = response.data
        setQuestions(questions)
      }
      fetchQuestions()
    }
  }, [status, userId, isMine])

  if (status === 'loading') return <Loader />
  else
    return (
      <List my="lg" spacing="sm" size="sm" className="list-none">
        {questions?.map((question) => (
          <QuestionItem
            key={question.id}
            id={question.id}
            title={question.title}
            description={question.description}
            isPrivate={question.isPrivate}
            createdAt={question.createdAt}
            books={question.books}
            likes={question.likes}
            userId={question.userId}
            isMine={isMine}
          />
        ))}
      </List>
    )
}
