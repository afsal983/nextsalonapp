// utils/api.ts
import { parseCookies } from 'nookies';
import { HOST_API } from "src/config-global";
import { cookies } from 'next/headers'
export async function fetchWithAuth(url: string, token1: string, options: RequestInit = {}): Promise<any> {

    const token = cookies().get('token')?.value
    // If token is available, add it to the request headers
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
  

    // Perform the fetch request
    const response = await fetch(HOST_API + url, options);

  
    // Check for any authentication errors or other issues
    if (!response.ok) {
        Promise.reject(
            (response.status && response.statusText) || "Something went wrong",
          )
      //throw new Error(`HTTP error! Status: ${response.status}`);
    }

  
    // Parse and return the JSON response
    return response.json();
  }
  

  export async function fetchInParallelWithAuth(urls: string[], token: string): Promise<any[]> {
    try {
      const fetchPromises = urls.map(url => fetchWithAuth( url , token)); // Use fetchWithAuth for each URL
      const results = await Promise.all(fetchPromises);
      return results;
    } catch (error) {
      console.error('Error fetching data in parallel:', error);
      return [];
    }
  }
  

  export async function fetchWithAuthAndPost(url: string, data: any): Promise<any> {
    const token = cookies().get('token')?.value
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include authorization token if needed
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return response.json();
    } catch (error) {
      console.error('Error sending POST request:', error);
      return null;
    }
  }

  export const endpoints = {
    chat: "/api/chat",
    kanban: "/api/kanban",
    calendar: "/api/calendar",
    auth: {
      me: "/api/auth/me",
      login: "/secretkeeper/signin",
      register: "/api/auth/register",
    },
    mail: {
      list: "/api/mail/list",
      details: "/api/mail/details",
      labels: "/api/mail/labels",
    },
    post: {
      list: "/api/post/list",
      details: "/api/post/details",
      latest: "/api/post/latest",
      search: "/api/post/search",
    },
    product: {
      list: "/apiserver/products?type=1",
      details: "/api/product/details",
      search: "/api/product/search",
    },
    productcategory: {
        list: "/apiserver/productcategories?type=1",
        details: "/api/product/details",
        search: "/api/product/search",
      },
  };
  