import React, { FC, useEffect, useState } from 'react'
import { Question_WithRelation } from '../types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from 'recharts'

type Props = {
  questions: Question_WithRelation[]
}
const DateChart: FC<Props> = ({ questions }) => {
  type Data = { date: string; count: number }
  const [data, setData] = useState<Data[]>([])

  //受け取ったquestionsを棒グラフ用に加工して、barDataに設定するメソッド
  const init = (questions: Question_WithRelation[]) => {
    //90日前のDateオブジェクト
    const startDate = new Date()
    //86400000ミリ(１日)
    const startTime = Date.now() - 86400000 * 90
    startDate.setTime(startTime)

    let data: Data[] = new Array(90).fill({ date: '', count: 0 })
    for (let i = 0; i < questions.length; i++) {
      const curr = questions[i]
      //currの作成日時が９０日以内かどうかをsubtractionで調べる
      const currDate = new Date(curr.createdAt)
      //   console.log(currDate)
      //   console.log(curr.createdAt)
      const subtraction = new Date(currDate).getTime() - startDate.getTime()
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
    setData(data)
  }
  useEffect(() => {
    init(questions)
  }, [questions])
  return (
    <BarChart
      width={1024}
      height={400}
      data={data}
      margin={{
        top: 50,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="date"
        interval={7}
        angle={-30}
        dy={5}
        tick={{
          fontSize: 10,
          fill: '#000',
        }}
      >
        <Label value="作成日" offset={-3} position="insideBottom" />
      </XAxis>
      <YAxis />
      <Tooltip />
      <Legend verticalAlign="top" height={40} iconSize={20} />
      <Bar name="作成した数" dataKey="count" fill="#660A24" />
    </BarChart>
  )
}

export default DateChart
