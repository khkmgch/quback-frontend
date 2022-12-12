import { List, Loader } from '@mantine/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useGetQuestion } from '../hooks/useGetQuestions'
import { useQueryUser } from '../hooks/useQueryUser'
import { Question_WithRelation } from '../types'
import { QuestionItem } from './QuestionItem'

export const QuestionAllList = () => {
  const [questions, setQuestions] = useState<Question_WithRelation[]>([])

  const { data: loginUser, status } = useQueryUser()

  const { getAllQuestions } = useGetQuestion()

  //apiからデータを取ってくる
  const fetchQuestions = async () => {
    let questions: Question_WithRelation[] = []
    const response: { data: Question_WithRelation[] } | null =
      await getAllQuestions()
    if (response) {
      questions = response?.data
    }
    return questions
  }
  //apiから取ってきたデータをsetQuestionに渡して状態をセットする初期化メソッド
  const init = async () => {
    let data = await fetchQuestions()
    if (data.length > 0) {
      setQuestions(data)
    }
  }

  //タイムライン、他の人のプロフィール、自分のプロフィールで場合分け
  useEffect(() => {
    init()
  }, [status])
  if (status === 'loading' || !loginUser) return <Loader />

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
