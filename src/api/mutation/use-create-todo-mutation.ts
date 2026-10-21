import { useMutation } from "@tanstack/react-query";
import { createTodo } from "@/api/create-todo.ts";

export function useCreateTodoMutation() {
  return useMutation({
    mutationFn: createTodo,
    // 4가지 핸들러 사용가능
    // 요청이 발동됐을 때
    onMutate: () => {},
    // 요청이 종료됐을 때
    onSettled: () => {},
    // 요청이 성공했을 때
    onSuccess: () => {
      window.location.reload();
    },
    // 요청이 실패했을 때
    onError: () => {
      window.alert("요청이 실패했습니다.");
    },
  });
}