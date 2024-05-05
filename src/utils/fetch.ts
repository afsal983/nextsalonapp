// utils/api.ts
import { cookies } from 'next/headers'

import { HOST_API } from 'src/config-global'

const getCookie = async (name: string) => cookies().get(name)?.value ?? ''
 

export async function fetchWithAuth (url: string, options: RequestInit = {}): Promise<any> {
  // const token = cookies().get('token')?.value

  // const cookieData = await getCookieData()
  // const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImZiVjBWQk1aSVpoOWctUEFkcXZjM2hfa0FvWkk5TUxGdDZ0TE9xcG9IOEEiLCJ0eXAiOiJKV1QifQ.eyJicmFuY2hfaWQiOjEsImRvbWFpbl9pZCI6IlRDZG55RHZ2aXEiLCJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwiZXhwIjoxNzE0OTY2NzgwLCJpYXQiOjE3MTQ5MDkxODAsImlzcyI6InNtZWV5ZSIsIm9yZ3JvbGUiOjEsInJvbGUiOjEsInN1YiI6IlN1YmplY3QifQ.Nmho2zxUzhMizhDn3Uq5n5QwJMcmlzSkFUnu-v0m8MlYIOmgC39r8xWQBqQ4wIABIzsbWq0AXk2OHuasxu7Mpo8hotKbJfthFapuK8Pev9N3029s-Lm8fUwVgLi02qx7un770bc6Pay_OCd7KftFqhzzOjXn3KddNp-NN7miMafVodmWvxrNOiZs9EGDr1_n3k7PJE7Ony2KGEFYOrIfYfVplsnTQER70MTkyNUqmAiSQd7LnmQmFWK2cnmOxWMbUhVsIqJhirjZ36IZQrJEGJdP8AN7szMEM1xV8-IL1XyZ8d4cuyUY2V1p4xOIPrP6uBh6vWbTxcB2XVRkymOCxA"
  const token = await getCookie('token');
  // If token is available, add it to the request headers
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
  }

  // Perform the fetch request
  const response = await fetch(HOST_API + url, options)

  // Check for any authentication errors or other issues
  if (!response.ok) {
    Promise.reject(
      (response.status && response.statusText) || 'Something went wrong'
    )
    // throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // Parse and return the JSON response
  return response.json()
}

export async function fetchInParallelWithAuth (urls: string[]): Promise<any[]> {
  try {
    const fetchPromises = urls.map(async url => fetchWithAuth(url)) // Use fetchWithAuth for each URL
    const results = await Promise.all(fetchPromises)
    return results
  } catch (error) {
    console.error('Error fetching data in parallel:', error)
    return []
  }
}

export async function fetchWithAuthAndPost (url: string, data: any): Promise<any> {
  const token = cookies().get('token')?.value
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` // Include authorization token if needed
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error sending POST request:', error)
    return null
  }
}

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/secretkeeper/signin',
    register: '/api/auth/register'
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels'
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search'
  },
  product: {
    list: '/apiserver/products?type=1',
    details: '/api/product/details',
    search: '/api/product/search'
  },
  productcategory: {
    list: '/apiserver/productcategories?type=1',
    details: '/api/product/details',
    search: '/api/product/search'
  }
}
