import { List, Loader } from '@mantine/core'
import { QuestionItem } from './QuestionItem'
import { FC, useEffect, useId, useState } from 'react'
import { Question_WithRelation } from '../types'
import axios from 'axios'
import { useQueryQuestions } from '../hooks/useQueryQuestions'
import { stat } from 'fs'
import { useQueryUser } from '../hooks/useQueryUser'
import { useGetQuestion } from '../hooks/useGetQuestions'

type Props = {
  isTimeline: boolean
  isMine: boolean
  userId: number
}
export const QuestionList: FC<Props> = ({ isTimeline, isMine, userId }) => {
  const [questions, setQuestions] = useState<Question_WithRelation[]>([])

  const { data: loginQuestions, status: questionStatus } = useQueryQuestions()

  const { data: loginUser, status: userStatus } = useQueryUser()

  const { getTimelineQuestions, getQuestionsByUserId } = useGetQuestion()

  //apiからデータを取ってくる
  //タイムライン、他の人のプロフィール画面、自分のプロフィール画面で場合分け
  const fetchQuestions = async () => {
    let questions: Question_WithRelation[] = []
    if (isTimeline) {
      const response: { data: Question_WithRelation[] } | null =
        await getTimelineQuestions()
      if (response) {
        questions = response?.data
      }
    } else if (!isMine) {
      const response: { data: Question_WithRelation[] } | null =
        await getQuestionsByUserId(userId)
      if (response) {
        questions = response?.data
      }
    } else if (loginQuestions) {
      questions = loginQuestions
    }
    return questions
  }
  //apiから取ってきたデータをsetQuestionに渡して状態をセットする初期化メソッド
  //Questionの公開・非公開の状態(isPrivate)によって、filter関数にかける。
  const init = async () => {
    let questions = await fetchQuestions()
    let data: Question_WithRelation[] = []
    if (isTimeline) {
      data = await Promise.all(
        questions.filter(
          (question) =>
            question.userId === loginUser?.id ||
            (question.userId !== loginUser?.id && !question.isPrivate)
        )
      )
    } else if (!isMine) {
      data = await Promise.all(
        questions.filter((question) => !question.isPrivate)
      )
    } else data = questions
    if (data.length > 0) {
      setQuestions(data)
    }
  }

  useEffect(() => {
    if (userId !== 0) {
      init()
    }
  }, [questionStatus, userId, isMine, isTimeline, userStatus])

  if (
    questionStatus === 'loading' ||
    userStatus === 'loading' ||
    !loginUser ||
    userId === 0
  )
    return <Loader />
  else
    return (
      <List my="lg" spacing="sm" size="sm" className="list-none">
        {questions?.map((question) => {
          return (
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
              isMine={loginUser.id === question.userId}
            />
          )
        })}
      </List>
    )
}
