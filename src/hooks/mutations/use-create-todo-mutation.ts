import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo } from "@/api/create-todo.ts";
import { QUERY_KEYS } from "@/lib/constants.ts";
import type { Todo } from "@/types.ts";

export function useCreateTodoMutation() {
  // 캐시 무효화 메서드(invalidateQueries)를 써주기 위해 먼저 queryClient 호출
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo, // mutationFn 의 반환된 값은 아래 핸들러의 매개변수로도 제공이 된다
    // 4가지 핸들러 사용가능
    // 요청이 발동됐을 때
    onMutate: () => {},
    // 요청이 종료됐을 때
    onSettled: () => {},
    // 요청이 성공했을 때
    onSuccess: (newTodo) => {
      // [정규화1] 새롭게 생성된 투두 아이템을 개별 캐시 데이터로 먼저 보관
      queryClient.setQueryData<Todo>(
        QUERY_KEYS.todo.detail(newTodo.id), // 개별 캐시 데이터이니 detail => 인수로는 'newTodo'로 mutateFn의 반환값을 받아
        newTodo, // 보관할 값
      );
      // [정규화2] id 값만 보관하는 todo.list 캐시 데이터에도 추가를 해줘야하기에
      queryClient.setQueryData<string[]>( // id 배열의 타입인 string[] 설정
        // 첫째인수
        QUERY_KEYS.todo.list,
        // 둘째인수 - 매개변수 prevTodoIds: 현재 Todo 아이템의 Id배열
        (prevTodoIds) => {
          if (!prevTodoIds) return [newTodo.id]; // prevTodoIds 값이 없다면 (= 즉 원래 캐시 데이터에 보관돼 있던 todo.list의 id 값들이 없다면) newTodo의 id 값만 있는 배열 return
          return [...prevTodoIds, newTodo.id];
          // 존재한다면 원래 존재하던 id값들을 펼쳐 준 다음, 새로운 Todo 아이템 id값을 넣어줘
        },
      );
    },
    // 요청이 실패했을 때
    onError: () => {
      window.alert("요청이 실패했습니다.");
    },
  });
}
