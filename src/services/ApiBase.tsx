export const API_URL: string =
  "http://ec2-3-80-208-160.compute-1.amazonaws.com:5001/";

interface RequestOptions {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

interface ApiRequest {
  url: string;
  options: RequestOptions;
}

export function GET(url: string, token: string | null): ApiRequest {
  return {
    url,
    options: {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

export function POST(
  url: string,
  token: string | null,
  body: string
): ApiRequest {
  const request: ApiRequest = {
    url,
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    },
  };

  if (token) {
    request.options.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  return request;
}

export function DELETE(
  url: string,
  token: string | null,
  id: string | null
): ApiRequest {
  return {
    url: `${url}/${id}`,
    options: {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

export function PUT(
  url: string,
  token: string | null,
  body: string,
  id: string | null
): ApiRequest {
  return {
    url: `${url}/${id}`,
    options: {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body,
    },
  };
}
