import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { Layout } from '../../components/Layout'
import { QuestionEditForm } from '../../components/QuestionEditForm'
import { useQueryQuestions } from '../../hooks/useQueryQuestions'
import useStore from '../../store'

const Question: NextPage = () => {
  //useStoreからeditingQuestionを取り出す
  const { editingQuestion } = useStore()
  const router = useRouter()
  const { id } = router.query

  // const { data: questions, status } = useQueryQuestions()
  // const question = questions?.find((ele) => {
  //   if (typeof id !== 'string') return false
  //   return ele.id === parseInt(id)
  // })
  return (
    <Layout title="question">
      <div>Question</div>
      {/* <p>{question?.id}</p>
      <p>{question?.title}</p>
      {question?.id && <QuestionEditForm />} */}
      {typeof id === 'string' && editingQuestion.id === parseInt(id) ? (
        <QuestionEditForm />
      ) : (
        <></>
      )}
    </Layout>
  )
}

export default Question
