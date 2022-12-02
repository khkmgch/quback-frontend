import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

//プロジェクト内でreactqueryを使用できるようにするために、queryClientを作成。
//retry: REST APIへのfetchに失敗した場合に、自動的に3回までリトライを繰り返す機能
//refetchOnWindowFocus: ユーザーがブラウザにフォーカスを当てた時にREST APIへのfetchが走る機能
//2つともreactqueryに標準でついている機能で、今回は必要ないのでfalseにする。
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  //フロンドエンドとサーバーサイドでcookieのやり取りを行う場合はtrueに設定。
  axios.defaults.withCredentials = true

  //このコンポーネントがマウントされた時に実行される処理をuseEffectを使って設定
  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/csrf`
      )
      //axiosで、headerにcsrf-tokenという名前を付けてトークンを設定。
      //これにより、これ以降REST APIにリクエストを送るときには、headerにCsrf Tokenが付与されるようになる。
      axios.defaults.headers.common['csrf-token'] = data.csrfToken
    }
    getCsrfToken()
  }, [])
  return (
    //プロジェクト全体でreactqueryを使用できるようにするために、QueryClientProviderで囲む。
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          // colorScheme: 'light',
          //プロジェクト全体のカラーテーマとフォントを設定
          colorScheme: 'light',
          fontFamily: 'Verdana, sans-serif',
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
      {/* reactqueryのデベロップメントツールを使用できるようにするためにReactQueryDevtoolsを追加 */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
