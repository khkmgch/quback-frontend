import axios from 'axios'

export const usePostFile = () => {
  const fileUpload = async (data: FormData) => {
    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/upload`, data)
      .then((res) => res)
      .catch((err) => {
        console.error(err)
        return null
      })
    return response
  }
  return { fileUpload }
}
