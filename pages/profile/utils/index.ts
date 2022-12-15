import axios from 'axios'
import { FormEvent } from 'react'
import { useMutateUser } from '../../../hooks/useMutateUser'
import { usePostFile } from '../../../hooks/usePostFile'
import { User_WithRelation } from '../../../types'

export const profileUtils = () => {
  
  //画像ファイルをアップロードするメソッド
  const { fileUpload } = usePostFile()
  //ユーザー情報を更新するMutation
  const { updateUserMutation } = useMutateUser()

  //ユーザ名を更新するメソッド
  const handleSubmitUserName = async (
    e: FormEvent<HTMLFormElement>,
    user: Omit<User_WithRelation, 'createdAt' | 'updatedAt' | 'hashedPassword'>,
    userNameInput: string
  ) => {
    e.preventDefault()
    try {
      updateUserMutation.mutate({
        id: user.id,
        userName: userNameInput,
        profilePicture: user.profilePicture || '',
        coverPicture: user.coverPicture || '',
      })
    } catch (err) {
      console.log(err)
    }
  }
  //プロフィール画像を変更するメソッド
  const handleProfilePicture: (
    file: File | null,
    user: Omit<User_WithRelation, 'createdAt' | 'updatedAt' | 'hashedPassword'>
  ) => Promise<void> = async (file, user) => {
    if (file !== null) {
      const data = new FormData()
      data.append('file', file)

      try {
        const uploaded = await fileUpload(data)
        const fileName = uploaded?.data.fileName

        updateUserMutation.mutate({
          id: user.id,
          userName: user.userName,
          profilePicture: fileName,
          coverPicture: user.coverPicture || '',
        })
      } catch (err) {
        console.log(err)
      }
    }
  }

  //カバー画像を変更するメソッド
  const handleCoverPicture: (
    file: File | null,
    user: Omit<User_WithRelation, 'createdAt' | 'updatedAt' | 'hashedPassword'>
  ) => Promise<void> = async (file, user) => {
    if (file !== null) {
      const data = new FormData()
      data.append('file', file)

      try {
        //画像アップロードAPIを叩く
        const uploaded = await fileUpload(data)
        //レスポンスからファイル名を取り出す
        const fileName = uploaded?.data.fileName
        //取り出したファイル名を使ってユーザー情報の更新
        updateUserMutation.mutate({
          id: user.id,
          userName: user.userName,
          profilePicture: user.profilePicture || '',
          coverPicture: fileName,
        })
      } catch (err) {
        console.log(err)
      }
    }
  }
  return { handleSubmitUserName, handleCoverPicture, handleProfilePicture }
}
