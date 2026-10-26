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
      // [ 현재 발생한 수정요청보다 더 과거에 발생된 조회요청이 캐시데이터 덮어씌우지 않게끔 대비]
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.todo.detail(updatedTodo.id),
      });

      // [정규화 속 낙관적 업데이트 실패대비] 원본 데이터 복구를 위한 저장
      const prevTodo = queryClient.getQueryData<Todo>(
        QUERY_KEYS.todo.detail(updatedTodo.id),
      );
      // [정규화1]
      queryClient.setQueryData<Todo>( // updatedTodo 라는 매개변수로 전달된 todo아이템, 현재 체크박스가 클릭이 되어서 업데이트가 이뤄져야하는 그런 todo 아이템의 개별 캐시데이터만 수정
        QUERY_KEYS.todo.detail(updatedTodo.id), // 업데이트된 아이템인 updatedTodo.id
        (prevTodo) => {
          // 매개변수 prevTodo는 현재 캐시 데이터에 보관돼 있는 아이템
          if (!prevTodo) return; // 현재 캐시 데이터가 없다면 수정해줄 것도 없기에 그냥 return
          return { ...prevTodo, ...updatedTodo }; // 기존 투두 아이템 데이터를 다 펼쳐준 다음, 수정된 투두아이템도 펼쳐서 업데이트 된 값만 딱 반영
        },
      );

      return {
        prevTodo, // 리턴으로 객체를 내보낼 건데, prevTodo를 포함시켜두면 오류발생시 이 값이 onError의 context로 전달됨
      };
    },

    // 1. onError
    onError: (error, variable, context) => {
      // 1-3. 자동제공되는 3번째 매개변수 context 에는 onMutate의 반환값, prevTodos를 그대로 받아오기에
      if (context && context.prevTodo) {
        // 제네릭으로 수정하고자 하는 캐시 데이터 타입을 Todo 배열 타입으로 정의
        queryClient.setQueryData<Todo>(
          QUERY_KEYS.todo.detail(context.prevTodo.id), // 첫째인수 : 수정하고자 하는 캐시의 키값
          context.prevTodo, // 둘째인수 : 새로운 캐시 데이터 값
          // setQueryData 는 둘째인수로 함수 대신에 그냥 변경하고자 하는 값을 넣어도 됨
        );
      }
    },
    // 3. onSettled (요청이 종료되었을 때 호출되는 이벤트 핸들러)
    // 낙관적 업데이트 데이터와 실제 백엔드 서버 수정 데이터가 달라지는 때
  });
}
