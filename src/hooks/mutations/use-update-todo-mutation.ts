import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodo } from "@/api/update-todo.ts";
import type { Todo } from "@/types.ts";
import { QUERY_KEYS } from "@/lib/constants.ts";

export function useUpdateTodoMutation() {
  // 캐시데이터 수정을 위해 queryClient 호출
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,

    // 낙관적 업데이트를 위해 비동기 요청이 딱 시작됐을 때 호출되는 onMutate 사용
    onMutate: (updatedTodo) => {
      // 어느 기준으로 업데이트가 일어나야 하는지 모름 => 제공되는 매개변수 이용하면 됨
      // mutationFn이 호출되면서 인수로 전달된 값이 매개변수로 자동으로 제공됨 => 이를 'updatedTodo'라고 명명

      // queryClient 호출 뒤, setQueryData 메서드 호출
      // generic 타입변수로 Todo 타입 불러와서 'Todo 배열 타입의 캐시 데이터를 수정할 겁니다' 라고 타입 정의
      queryClient.setQueryData<Todo[]>(QUERY_KEYS.todo.list, (prevTodos) => {
        // prevTodos가 없다면
        if (!prevTodos) return [];
        // prevTodos가 있다면
        return prevTodos.map((prevTodo) =>
          prevTodo.id === updatedTodo.id
            ? {
                ...prevTodo,
                ...updatedTodo,
              }
            : prevTodo,
        );
      });
      // 첫째인수 : 수정하고자 하는 캐시 데이터의 key 값!
      // 둘째인수 : 캐시데이터의 업데이트하는 화살표 함수
      // - 화살표함수 첫째인수 : prevTodos : 첫번째 인수로 전달한 QUERY_KEYS.todo.list라는 key 값을 갖는 현재상태의 캐시 데이터 제공
    },
  });
}
