import React from 'react'
import { Info } from '../types'

export const searchBookItemUtils = () => {
  //本の情報から識別コードを探して取り出すメソッド
  const findIsbn13 = (info: Info) => {
    if (info.industryIdentifiers) {
      for (let i = 0; i < info.industryIdentifiers.length; i++) {
        let curr = info.industryIdentifiers[i]
        if (curr.type === 'ISBN_13') {
          return curr.identifier
        }
      }
      return null
    }
    return null
  }

  //本の詳細情報を取得するメソッド
  const fetchDetailData = async (isbn13: string) => {
    const response = await fetch(
      `https://api.openbd.jp/v1/get?isbn=${isbn13}&pretty`
    )
      .then((res) => res)
      .catch((err) => {
        console.error(err)
        return null
      })
    if (response) {
      const json = await response
        .json()
        .then((json) => json)
        .catch((err) => {
          console.error(err)
          return null
        })
      if (json) {
        console.log(json[0])
        return json[0]
      }
    }
  }
  return { findIsbn13, fetchDetailData }
}
