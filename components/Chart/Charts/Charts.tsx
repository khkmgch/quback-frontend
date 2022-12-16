import { Center, SegmentedControl } from '@mantine/core'
import { IconChartBar, IconChartDots2 } from '@tabler/icons'
import { FC, useEffect, useState } from 'react'
import { useQueryQuestions } from '../../../hooks/question/useQueryQuestions'
import { Question_WithRelation } from '../../../types'
import DateChart from '../DateChart/DateChart'
import HourChart from '../HourChart/HourChart'
import { Props } from './types'
import { chartsUtils } from './utils'

const Charts: FC<Props> = ({ isMine, userId }) => {
  //状態

  //ログインしているユーザーのQuestions
  const { data: loginQuestions, status: QuestionsStatus } = useQueryQuestions()

  //グラフに使用するQuestionの配列
  const [questions, setQuestions] = useState<Question_WithRelation[]>([])

  //画面に表示するグラフのタイプ(グラフの切り替えに使用)"date"or"hour"
  const [chart, setChart] = useState('date')

  //開いているページが自分or他の人によって、異なるQuestionsを返すメソッド
  const { fetchQuestions } = chartsUtils()

  //コンポーネントの状態を初期設定するメソッド
  const init = async () => {
    const questions = await fetchQuestions(isMine, userId, loginQuestions)
    setQuestions(questions)
  }
  useEffect(() => {
    init()
  }, [])

  return (
    <div className='flex flex-col w-full h-196 items-center'>
      <div className="flex w-full justify-center">
        <SegmentedControl
          fullWidth
          radius={10}
          color="gray"
          transitionDuration={500}
          transitionTimingFunction="linear"
          value={chart}
          onChange={setChart}
          data={[
            {
              label: (
                <Center>
                  <IconChartBar size={32} className="text-gray-300" />
                </Center>
              ),
              value: 'date',
            },
            {
              label: (
                <Center>
                  <IconChartDots2 size={32} className="text-gray-300" />
                </Center>
              ),
              value: 'hour',
            },
          ]}
        />
      </div>
      {chart === 'date' ? (
        <DateChart questions={questions} />
      ) : chart === 'hour' ? (
        <HourChart questions={questions} />
      ) : (
        <></>
      )}
    </div>
  )
}

export default Charts
