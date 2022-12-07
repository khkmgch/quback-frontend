import { LogoutIcon } from '@heroicons/react/solid'
import axios from 'axios'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Layout } from '../../components/Layout'
import { UserInfo } from '../../components/UserInfo'
import { useQueryClient } from '@tanstack/react-query'
import { QuestionCreateForm } from '../../components/QuestionCreateForm'
import { QuestionList } from '../../components/QuestionList'
import { useQueryUser } from '../../hooks/useQueryUser'
import { Loader } from '@mantine/core'

const Plaza: NextPage = () => {
  const { data: user, status } = useQueryUser()
  if (status === 'loading') {
    return (
      <Layout title="Plaza">
        <Loader />
      </Layout>
    )
  } else
    return (
      <Layout title="Plaza">
        <QuestionCreateForm />
        {typeof user?.id !== 'undefined' ? (
          <QuestionList isTimeline={true} isMine={true} userId={user?.id} />
        ) : (
          <Loader />
        )}
      </Layout>
    )
}

export default Plaza
