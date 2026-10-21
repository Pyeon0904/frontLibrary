import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo } from "@/api/create-todo.ts";
import { QUERY_KEYS } from "@/lib/constants.ts";

export function useCreateTodoMutation() {
  // 캐시 무효화 메서드(invalidateQueries)를 써주기 위해 먼저 queryClient 호출
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    // 4가지 핸들러 사용가능
    // 요청이 발동됐을 때
    onMutate: () => {},
    // 요청이 종료됐을 때
    onSettled: () => {},
    // 요청이 성공했을 때
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.todo.list,
      });
    },
    // 요청이 실패했을 때
    onError: () => {
      window.alert("요청이 실패했습니다.");
    },
  });
}
