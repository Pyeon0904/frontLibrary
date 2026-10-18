import { useQuery } from "@tanstack/react-query";
import { fetchTodoById } from "@/api/fetch-todo-by-id.ts";

export function useTodoDataById(id: number) {
  return useQuery({
    // queryFn: fetchTodoById, // 어떤 아이디를 전달할지 id도 넘겨줘야하기에 함수 자체를 넘기지 말고
    queryFn: () => fetchTodoById(id), // 화살표 함수로 fetchTodoById 함수 호출하면서 id 값을 전달
    queryKey: ["todos", id], // 투두 데이터이니까 배열 ["todos"]에 현재 조회하려는 아이템의 id
    // 그래야 아이템별로 cache 데이터를 따로 보관할 수 있다.

    // [ 추가옵션 ]
    // refetchInterval: 1000, // 옵션으로 refetchInterval을 1000(ms)으로 설정해주면 1초마다 리페칭됨을 확인할 수 있음 => 모니터링

    // [ 리패칭 옵션을 false 할 수 있다 ]
    // refetchOnMount: false;
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
    // refetchInverval: false,

    // [ staleTime(유통기한) ]
    staleTime: 5000,
  });
}

// 'useTodoDataById'라는 커스텀 hook이 특정 컴포넌트에서 호출이 되면,
// 일단 "queryFn"으로 설정된 화살표 함수를 실행해서 - 매개변수로 전달한 id 값을 갖는 - 투두아이템의 데이터를 불러올 것이고,
// 불러온 데이터는 "queryKey"로 설정한 값으로 캐싱된다.
