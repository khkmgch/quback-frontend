import { LogoutIcon } from '@heroicons/react/solid'
import axios from 'axios'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Layout } from '../../components/Layout' 
import { UserInfo } from '../../components/UserInfo' 
import { useQueryClient } from '@tanstack/react-query'
import { QuestionCreateForm } from '../../components/QuestionCreateForm' 
import { QuestionList } from '../../components/QuestionList' 

const Plaza: NextPage = () => {
//   //ログアウトのルーティングのためにuseRouterを実行
//   const router = useRouter()
//   const queryClient = useQueryClient()
//   const logout = async () => {
//     //カスタムhook(useQueryUser)でapiから取得したデータをブラウザにキャッシュしていたので、
//     //ログアウト時にuseQueryClientのremoveQueriesを使って、キャッシュを削除する。
//     queryClient.removeQueries(['user'])
//     queryClient.removeQueries(['questions'])
//     await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`)
//     //index.tsxのログイン画面に遷移
//     router.push('/')
//   }
  return (
    <Layout title="Question Board">
      {/* <LogoutIcon
        className="mb-6 h-6 w-6 cursor-pointer text-blue-500"
        onClick={logout}
      /> */}
      {/* <UserInfo /> */}
      <QuestionCreateForm />
      <QuestionList mode='Timeline'/>
    </Layout>
  )
}

export default Plaza
