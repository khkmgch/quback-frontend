import React from 'react'
import { Question_WithRelation } from '../../../../types'
import { DateChartData } from '../types'

export const dateChartUtils = () => {
  //90日前のDateオブジェクトを返すメソッド
  const beforeDate90 = () => {
    //Dateオブジェクト
    const date = new Date()
    //86400000ミリ(１日) * 90
    const startTime = Date.now() - 86400000 * 90
    date.setTime(startTime)

    return date
  }

  //受け取ったquestionsを棒グラフ用に加工して返すメソッド
  const processQuestions = (questions: Question_WithRelation[]) => {
    //90日前のDateオブジェクト
    const startDate = beforeDate90()

    let data: DateChartData[] = new Array(90).fill({ date: '', count: 0 })

    for (let i = 0; i < questions.length; i++) {
      const curr = questions[i]
      const currDate = new Date(curr.createdAt)

      //currの作成日時が９０日以内かどうかをsubtractionで調べる
      const subtraction = currDate.getTime() - startDate.getTime()

      //subtraction >= 0 の場合、９０日以内
      if (subtraction >= 0) {
        const index: number = Math.floor(subtraction / 86400000)
        const date: string = currDate.getMonth() + 1 + '/' + currDate.getDate()

        const count: number = data[index].count
        data[index] = {
          date: date,
          count: count + 1,
        }
      }
    }
    return data
  }
  return { processQuestions }
}
