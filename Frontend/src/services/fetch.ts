type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const baseFetch = async <T, U>({
  url,
  method,
  data,
  token,
}: {
  url: string;
  method: Method;
  data?: T;
  token?: string;
}): Promise<U> => {
  const response = await fetch(encodeURI(url), {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};
