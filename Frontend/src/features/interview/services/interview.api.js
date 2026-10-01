import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

export async function generateInterviewReport({ jobDescription, selfDescription, resume }) {
  const formData = new FormData()
  formData.append('jobDescription', jobDescription)
  formData.append('selfDescription', selfDescription)
  formData.append('resume', resume)

  // return response

  const response = await api.post('/interview/', formData)
  return response.data
}