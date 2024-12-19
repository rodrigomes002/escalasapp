interface RequestOptions {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

export interface ApiRequest {
  url: string;
  options: RequestOptions;
}
