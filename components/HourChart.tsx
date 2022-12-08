import React, { FC, useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from 'recharts'
import { Question_WithRelation } from '../types'

type Props = {
  questions: Question_WithRelation[]
}

const HourChart: FC<Props> = ({ questions }) => {
  type Data = { hour: string; value: number }
  const [data, setData] = useState<Data[]>([])

  //受け取ったquestionsを折れ線グラフ用に加工して、lineDataに設定するメソッド
  const initData = (questions: Question_WithRelation[]) => {
    let data: Data[] = new Array(24)
    for (let i = 0; i < data.length; i++) {
      data[i] = { hour: i.toString(), value: 0 }
    }
    console.log(data)
    for (let i = 0; i < questions.length; i++) {
      const curr = questions[i]
      const currDate = new Date(curr.createdAt)
      const hour = currDate.getHours()
      const value = data[hour].value
      data[hour] = {
        hour: hour.toString(),
        value: value + 1 / questions.length,
      }
    }
    setData(data)
  }
  useEffect(() => {
    initData(questions)
  }, [questions])

  return (
    <LineChart
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
      <XAxis dataKey="hour">
        <Label value="時間" offset={-3} position="insideBottom" />
      </XAxis>
      <YAxis />
      <Tooltip />
      <Legend verticalAlign="top" height={40} iconSize={20} />

      <Line
        name="作成した時間帯"
        type="monotone"
        dataKey="value"
        stroke="#0042EB"
      />
    </LineChart>
  )
}
export default HourChart
