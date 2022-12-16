import React from 'react'
import { useGetQuestion } from '../../../../hooks/question/useGetQuestion'
import { Question_WithRelation, User_WithRelation } from '../../../../types'

export const questionListUtils = () => {
  //getTimelineQuestions:タイムラインに表示するQuesitionsを取得するメソッド
  //getQuestionsByUserId:特定のユーザーのQuestionsをuserIdで取得するメソッド
  const { getTimelineQuestions, getQuestionsByUserId } = useGetQuestion()

  //Questionsを取得するメソッド
  //タイムラインor他の人のプロフィール画面or自分のプロフィール画面で場合分け
  const fetchQuestions = async (
    isTimeline: boolean,
    isMine: boolean,
    loginQuestions: Question_WithRelation[] | undefined,
    userId: number
  ) => {
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
  const filterQuestions = async (
    isTimeline: boolean,
    isMine: boolean,
    loginUser: Omit<User_WithRelation, 'hashedPassword'> | undefined,
    questions: Question_WithRelation[]
  ) => {
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

    return data
  }
  return { fetchQuestions, filterQuestions }
}
