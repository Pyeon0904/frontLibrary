import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "@/api/fetch-todos.ts";
import { QUERY_KEYS } from "@/lib/constants.ts";

export function useTodosData() {
  return useQuery({
    queryFn: fetchTodos,
    queryKey: QUERY_KEYS.todo.list,
    // retry: 0, // 자동재시도 기능 횟수 커스텀
  });
}
