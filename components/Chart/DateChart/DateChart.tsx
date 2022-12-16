import React, { FC, useEffect, useState } from 'react'
import { Question_WithRelation } from '../../../types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
} from 'recharts'
import { DateChartData, Props } from './types'
import { dateChartUtils } from './utils'

const DateChart: FC<Props> = ({ questions }) => {
  //状態

  //グラフデータ
  const [data, setData] = useState<DateChartData[]>([])

  //メソッド

  //受け取ったquestionsを棒グラフ用に加工して返すメソッド
  const { processQuestions } = dateChartUtils()

  //コンポーネントの状態を初期設定するメソッド
  const init = (questions: Question_WithRelation[]) => {
    //questionsをグラフ用のデータに加工してdataに設定する
    let data: DateChartData[] = processQuestions(questions)
    setData(data)
  }
  useEffect(() => {
    init(questions)
  }, [questions])
  return (
    // <ResponsiveContainer width='100%' height='100%'>
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
    // </ResponsiveContainer>
  )
}

export default DateChart
