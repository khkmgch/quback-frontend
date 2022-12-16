import React from 'react'
import { useGetQuestion } from '../../../../hooks/question/useGetQuestion'
import { Question_WithRelation } from '../../../../types'

export const questionAllListUtils = () => {
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
  return { fetchQuestions }
}
