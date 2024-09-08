type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

const defaultHeaders = {
  "Content-Type": "application/json",
};

const request = async <T>(
  url: string,
  method: HttpMethod,
  data?: any,
  options: RequestOptions = {}
): Promise<T> => {
  const { headers = {}, params = {} } = options;

  // Convert params to query string
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  const requestOptions: RequestInit = {
    method,
    headers: { ...defaultHeaders, ...headers },
  };

  if (data && method !== "GET") {
    requestOptions.body = JSON.stringify(data);
  }

  const response = await fetch(fullUrl, requestOptions);
  const result = await response.json();

  if (!response.ok) {
    const error =
      result.error?.message || result.error || "Something went wrong";
    console.error(error);
    throw new Error(error);
  }

  return result;
};

export const get = <T>(url: string, options?: RequestOptions): Promise<T> =>
  request<T>(url, "GET", undefined, options);

export const post = <T>(
  url: string,
  data: any,
  options?: RequestOptions
): Promise<T> => request<T>(url, "POST", data, options);

export const put = <T>(
  url: string,
  data: any,
  options?: RequestOptions
): Promise<T> => request<T>(url, "PUT", data, options);

export const del = <T>(url: string, options?: RequestOptions): Promise<T> =>
  request<T>(url, "DELETE", undefined, options);

export const patch = <T>(
  url: string,
  data: any,
  options?: RequestOptions
): Promise<T> => request<T>(url, "PATCH", data, options);

// Example usage:
// const data = await get<UserData>('/api/users/1', { params: { include: 'posts' } });
// const newUser = await post<UserData>('/api/users', { name: 'John Doe', email: 'john@example.com' });
// const updatedUser = await put<UserData>('/api/users/1', { name: 'Jane Doe' });
// const deletedUser = await del<UserData>('/api/users/1');
// const patchedUser = await patch<UserData>('/api/users/1', { email: 'newemail@example.com' });
