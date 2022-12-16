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
import { Question_WithRelation } from '../../../types'
import { HourChartData, Props } from './types'
import { hourChartUtils } from './utils'

const HourChart: FC<Props> = ({ questions }) => {
  const [data, setData] = useState<HourChartData[]>([])

  //Questionを加工してグラフ用のデータを返すメソッド
  const { processQuestions } = hourChartUtils()

  //コンポーネントの状態を初期設定するメソッド
  const init = (questions: Question_WithRelation[]) => {
    let data: HourChartData[] = processQuestions(questions)
    setData(data)
  }
  useEffect(() => {
    init(questions)
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
