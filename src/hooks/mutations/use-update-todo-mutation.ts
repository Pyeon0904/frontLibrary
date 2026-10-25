import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateTodo} from "@/api/update-todo.ts";
import type {Todo} from "@/types.ts";
import {QUERY_KEYS} from "@/lib/constants.ts";

export function useUpdateTodoMutation() {
  // 캐시데이터 수정을 위해 queryClient 호출
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,

    // 낙관적 업데이트를 위해 비동기 요청이 딱 시작됐을 때 호출되는 onMutate 사용
    onMutate: async (updatedTodo) => {
      // 2-1. cancelQueries 로 조회요청 제거하기
      await queryClient.cancelQueries({
        // 인수로 전달한 이 key 값에 해당하는 캐시 데이터를 불러오고 있는 조회요청이 있다면 그냥 취소시킴
        queryKey: QUERY_KEYS.todo.list,
      });

      // 1-1. 캐시 데이터를 업데이트 하기 전에 미리 원상복구에 활용될 원본데이터를 별도의 변수에 저장해둬야함
      // - queryClient(=store) 호출해서 getQueryData 메서드(현재 캐시데이터 불러옴)를 호출
      // - generic으로 불러올 캐시데이터 Todo 를 배열 타입으로 정의
      // - 메서드 인수로 key 값 전달해 캐시 데이터를 불러오도록 설정
      const prevTodos = queryClient.getQueryData<Todo[]>(QUERY_KEYS.todo.list);

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

      // // 1-2. prevTodos 변수에 현재 캐시 데이터를 담아줬다면 오류가 발생했을 때 이를 사용할 수 있도록 반환
      return {
        prevTodos,
      };
    },

    // 1. onError
    onError: (error, variable, context) => {
      // 1-3. 자동제공되는 3번째 매개변수 context 에는 onMutate의 반환값, prevTodos를 그대로 받아오기에
      if (context && context.prevTodos) {
        // 제네릭으로 수정하고자 하는 캐시 데이터 타입을 Todo 배열 타입으로 정의
        queryClient.setQueryData<Todo[]>(
          QUERY_KEYS.todo.list, // 첫째인수 : 수정하고자 하는 캐시의 키값
          context.prevTodos, // 둘째인수 : 새로운 캐시 데이터 값
          // setQueryData 는 둘째인수로 함수 대신에 그냥 변경하고자 하는 값을 넣어도 됨
        );
      }
    },
    // 3. onSettled (요청이 종료되었을 때 호출되는 이벤트 핸들러)
    // 낙관적 업데이트 데이터와 실제 백엔드 서버 수정 데이터가 달라지는 때
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.todo.list,
      });
    },
  });
}
