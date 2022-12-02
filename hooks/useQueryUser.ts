//カスタムhook(useQueryUser)

//React Queryはサーバからのデータ取得だけではなく、
//取得したデータをキャッシュする機能、サーバ上のデータと同期する機能がある

import { User } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import { User_WithRelation } from '../types'

export const useQueryUser = () => {
  const router = useRouter()
  const getUser = async () => {
    const { data } = await axios.get<Omit<User_WithRelation, 'hashedPassword'>>(
      `${process.env.NEXT_PUBLIC_API_URL}/user`
    )
    return data
  }
  //useQueryで、REST APIから取得したデータをブラウザにキャッシュする
  //対応するキャッシュデータがどこに格納されているかを識別するためのキー(queryKey)を設定
  //api通信(getUser)でエラーが発生した場合の処理をonErrorで設定
  return useQuery<Omit<User_WithRelation, 'hashedPassword'>, Error>({
    queryKey: ['user'],
    queryFn: getUser,
    onError: (err: any) => {
      //401: unauthorized(jwt tokenが無効な場合、期限が切れている場合)
      //403: csrf token が無効な場合
      if (err.response.status === 401 || err.response.status === 403) {
        router.push('/')
      }
    },
  })
}
