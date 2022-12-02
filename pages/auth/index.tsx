import { ExclamationCircleIcon, ShieldCheckIcon } from "@heroicons/react/solid"
import { Alert, Anchor, Button, Group, PasswordInput, TextInput } from "@mantine/core"
import { useForm, yupResolver } from "@mantine/form"
import { IconDatabase } from "@tabler/icons"
import axios from "axios"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useState } from "react"

import * as Yup from 'yup'
import { Layout } from "../../components/Layout" 
import { AuthForm } from "../../types" 

//入力フォームのバリデーションのため、Yupのスキーマを定義
const schema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('No email provided'),
    password: Yup.string()
      .required('No password provided')
      .min(8, 'Password should be min 8 chars'),
  })

const Auth: NextPage = () => {
  //ルーティングのために、useRouterを使用
  const router = useRouter()
  //ログインモードと新規登録モードを切り替えるためのisRegister(デフォルトはfalseでログインモード)
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')

  //mantineのuseForm
  //ジェネリクスでフォームのデータ型（types/index.tsで定義したAuthForm）に指定する
  const form = useForm<AuthForm>({
    validate: yupResolver(schema),
    initialValues: {
      email: '',
      password: '',
    },
  })

  const handleSubmit = async () => {
    try {
      //新規登録モードの場合、登録が成功したら続いてログインも行う
      if (isRegister) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
          email: form.values.email,
          password: form.values.password,
        })
      }
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email: form.values.email,
        password: form.values.password,
      })
      //useFormのresetメソッドで初期値にリセット
      form.reset()
      //ダッシュボードに遷移
      router.push('/plaza')
    } catch (e: any) {
      //setErrorでerrorステートにエラーメッセージを格納
      setError(e.response.data.message)
    }
  }
  return (
    <Layout title="Home">
      <div className="flex flex-col items-center justify-center rounded-md border-2 border-solid border-indigo-600 p-10">
        {/* <ShieldCheckIcon className="h-16 w-16 text-blue-500" /> */}
        {/* errorに何らかの文字列が存在する場合にアラートを表示 */}
        {error && (
          <Alert
            my="md"
            variant="filled"
            icon={<ExclamationCircleIcon />}
            title="Authorization Error"
            color="red"
            radius="md"
          >
            {error}
          </Alert>
        )}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            mt="md"
            id="email"
            label="メールアドレス"
            withAsterisk
            placeholder="example@gmail.com"
            //useFormのgetInputPropsを使う。(value, onChange, useStateを使わなくて済む)
            {...form.getInputProps('email')}
          />
          <PasswordInput
            mt="md"
            id="password"
            label="パスワード"
            withAsterisk
            placeholder="password"
            description="8文字以上"
            {...form.getInputProps('password')}
          />
          <Group mt="xl" position="apart">
            <Anchor
              // テキストをクリックできるようにしたいのでcomponentとtypeをbuttonに設定
              component="button"
              type="button"
              size="xs"
              className="text-gray-300"
              onClick={() => {
                setIsRegister(!isRegister)
                //登録とログインを切り替えた時に何らかのエラーが発生していれば、エラーをリセットする
                setError('')
              }}
            >
              {isRegister
                ? 'アカウントをお持ちの方はこちら'
                : "新しくアカウントを作成したい方はこちら"}
            </Anchor>
            <Button
              leftIcon={<IconDatabase size={14} />}
              color="cyan"
              type="submit"
            >
              {isRegister ? '登録' : 'ログイン'}
            </Button>
          </Group>
        </form>
      </div>
    </Layout>
  )
}
export default Auth