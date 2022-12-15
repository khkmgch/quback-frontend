import { Center, SegmentedControl } from '@mantine/core'
import { IconChartBar, IconChartDots2 } from '@tabler/icons'
import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { useGetQuestion } from '../hooks/useGetQuestion'
import { useQueryQuestions } from '../hooks/useQueryQuestions'
import { Question_WithRelation } from '../types'
import DateChart from './DateChart'
import HourChart from './HourChart'

type Props = {
  userId: number
  isMine: boolean
}

const Charts: FC<Props> = ({ isMine, userId }) => {
  const { data: loginQuestions, status: QuestionsStatus } = useQueryQuestions()

  const [questions, setQuestions] = useState<Question_WithRelation[]>([])

  const [chart, setChart] = useState('date')

  const { getQuestionsByUserId } = useGetQuestion()

  const fetchQuestions = async () => {
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
  const init = async () => {
    const questions = await fetchQuestions()
    setQuestions(questions)
  }
  useEffect(() => {
    init()
  }, [])

  return (
    <>
      <div className="flex w-256 justify-center">
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
    </>
  )
}

export default Charts
