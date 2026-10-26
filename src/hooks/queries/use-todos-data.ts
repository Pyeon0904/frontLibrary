import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTodos } from "@/api/fetch-todos.ts";
import { QUERY_KEYS } from "@/lib/constants.ts";
import type { Todo } from "@/types.ts";

export function useTodosData() {
  const queryClient = useQueryClient();

  return useQuery({
    // 정규화
    // - 비동기함수로 만들어 data를 불러와주기 위해 async ~ await 만들어주기
    queryFn: async () => {
      // (1-1) 모든 투두 아이템 데이터 불러와주기
      const todos = await fetchTodos();

      // (2-1)개별적인 캐시데이터로까지 평탄화해서 보관하도록
      // todos에 forEach로 모든 todo 순회하면서
      // queryClient의 setQueryData 메서드를 통해 개별 캐시 데이터들까지 함께 보관하도록 설정
      // 제네릭으로 '현재 내가 보관하려는 캐시데이터는 Todo 타입이다' 선언
      todos.forEach((todo) => {
        queryClient.setQueryData<Todo>(
          QUERY_KEYS.todo.detail(todo.id),
          todo, // 저장되는 캐시데이터 그 자체
        );
      });

      // (1-2) 모든 투두 아이템 순회해주면서 id값만 반환
      return todos.map((todo) => todo.id);
    },
    queryKey: QUERY_KEYS.todo.list,
    // retry: 0, // 자동재시도 기능 횟수 커스텀
  });
}

// => useQuery는 queryFn의 결과 값을 캐시데이터로 보관하기에
// => 이제 todos 배열 자체가 아니라 투두의 id 값만을 모아둔 배열을 캐시데이터로 보관할 것이다.

// queryFn이 실행이 되어서 fetchTodos 함수를 통해 불러온 여러 개의 'todo' 아이템을
// forEach 메서드를 통해 각각 순회하면서 setQueryData 메서드를 통해서 개별 캐시 데이터로까지 보관이 잘 되게 됨