import { useGetQuestion } from '../../../../hooks/question/useGetQuestion'
import { Question_WithRelation } from '../../../../types'

export const chartsUtils = () => {
  const { getQuestionsByUserId } = useGetQuestion()

  //開いているページが自分or他の人によって、異なるQuestionsを返すメソッド
  const fetchQuestions = async (
    isMine: boolean,
    userId: number,
    loginQuestions: Question_WithRelation[] | undefined
  ) => {
    let questions: Question_WithRelation[] = []
    if (!isMine) {
      const response: { data: Question_WithRelation[] } | null =
        await getQuestionsByUserId(userId)
      if (response) {
        questions = response.data
      }
    } else if (loginQuestions !== undefined) {
      questions = loginQuestions
    }
    return questions
  }
  return { fetchQuestions }
}
