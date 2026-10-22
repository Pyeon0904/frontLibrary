import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo } from "@/api/create-todo.ts";
import type { Todo } from "@/types.ts";
import { QUERY_KEYS } from "@/lib/constants.ts";

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
      // mutationFn의 반환값으로 새로 생성된 데이터를 매개변수 'newTodo'로 받아서 사용
      // 방법1) 캐시 데이터 리패칭도 좋지만, 데이터가 무수히 많은 상태에서라면 자칫 서버에 부하를 줄 수도 있다
      // queryClient.invalidateQueries({
      //   queryKey: QUERY_KEYS.todo.list,
      // });

      // 방법2) 새롭게 추가된 newTodo를 새롭게 추가된 기존의 캐시값 뒤에 직접 추가해줄 수도 있다.
      // 변수로 투두 타입을 불러와서 배열 타입으로 캐시 데이터를 수정할 것이다 명시
      queryClient.setQueryData<Todo[]>(QUERY_KEYS.todo.list, (prevTodos) => {
        if (!prevTodos) return [newTodo]; // prevTodos(이전데이터)가 없을 경우는 새로운 배열에 newTodo 추가
        return [...prevTodos, newTodo]; // prevTodos(이전데이터)가 존재할 경우, 스프레드연산자로 기존의 캐시데이터에 존재하던 모든 todo 아이템을 나열하고 새로운 newTodo를 추가
      });
      // 첫째인수 : 수정할 캐시 데이터의 키값 => QUERY_KEYS.todo.list
      // 둘째인수 : (리액트에서 setState 사용하듯) () => {} 함수형 업데이트를 위한 화살표 함수
      // - 매개변수 prevTodos는 첫째인수로 전달한 QUERY_KEYS.todo.list 키값을 갖는 캐시 데이터가 제공될 것이기에
    },
    // 요청이 실패했을 때
    onError: () => {
      window.alert("요청이 실패했습니다.");
    },
  });
}
