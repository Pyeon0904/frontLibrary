export const API_URL = "http://localhost:3000";

// queryKey 통합관리
export const QUERY_KEYS = {
  todo: {
    all: ["todo"],
    list: ["todo", "list"],
    detail: (id: string) => ["todo", "detail", id],
  },
};
