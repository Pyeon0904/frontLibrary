import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteTodo} from "@/api/delete-todo.ts";
import type {Todo} from "@/types.ts";
import {QUERY_KEYS} from "@/lib/constants.ts"; // 캐시 데이터 수정

// 캐시 데이터 수정
// 1. 캐시무효화 => invalidateQueries
// 2. 수정 요청의 응답값 활용 => onSuccess
// 3. 낙관적 업데이트 => onMutate

export function useDeleteTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,

    // 캐시 데이터 수정
    onSuccess: (deletedTodo) => {
      queryClient.setQueryData<Todo[]>(QUERY_KEYS.todo.list, (prevTodos) => {
        if (!prevTodos) return []; // 없을 때는 덮어쓰기
        return prevTodos.filter((prevTodos) => prevTodos.id !== deletedTodo.id);
      });
    },
    // 1) onSuccess 함수의 매개변수로는 mutationFn가 반환한 todo 데이터를 받아올 수 있기에
    // - 그 이름을 'deletedTodo' 라고 정의하고 매개변수로 불러옴
    // 2) queryClient의 setQueryData 메서드를 호출하고
    // - 제네릭으로 현재 수정하려는 캐시 데이터의 타입인 Todo 타입을 불러오고 Todo[] 배열 타입임을 명시
    // 3) 첫째인수 : 쿼리키 => QUERY_KEYS.todo.list
    // 4) 둘째인수 : 함수형 업데이트(화살표함수)
    // - 둘째인수의 첫째인수는 prevTodos로 첫째인수로 전달한 키 값에 해당하는 캐시데이터
    // - 함수 내부는 새롭게 업데이트 될 캐시 데이터 반환
    // - - (1) !prevTodos 가 없을 때와 있을 때 분기
  });
}
