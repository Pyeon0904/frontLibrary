import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { combine } from "zustand/middleware";
import type { Todo } from "../types.ts"; // 1. store를 생성해주기 위해서 use~Store를 만들어주는데,
// 1. store를 생성해주기 위해서 use~Store를 만들어주는데,
// - create 메서드 호출
// - immer() 미들웨어 : 불변성 관리
// - combine({initialState}, () => {(actions)}) : 첫번째인수 = 전역상태의 초기값 / 두번째인수 = 액션함수 (콜백함수)
//   - combine({todos: []},) 이렇게도 써주지만, 간단히 써주기 위해서 따로 initialState를 빼주고 사용

const initialState: {
  todos: Todo[];
} = {
  todos: [], // 배열에 아무것도 넣어주지 않았기에 ts는 'never' 타입으로 추론 = 공집합
  // 공집합인데 state.todos.push({}) 처럼 '객체'를 넣어주려고 하니까 타입에러.
  // => 해결방안 : 배열타입으로 추론이 되도록 수정해줘야해.
  // ==> 기왕이면 types.ts 공통 타입으로 빼주자
  // (여기서만 수정해주기에는 다른 투두아이템.tsx에서도 사용 될 것이기에)
};

const useTodosStore = create(
  immer(
    // 두번째 인수(action 함수)의 콜백함수 인수로 set, get메서드를 불러올 수 있었지만,
    // set 메서드의 함수형 업데이트를 이용하면 get메서드를 활용할 필요가 X
    combine(initialState, (set) => ({
      actions: {
        createTodo: (content: string) => {
          // 새롭게 생성될 투두아이템이 어떤 content를 가지고 있어야하는지 타입과 함께 가져오고
          set((state) => {
            // 함수 내부에선 set() 메서드 호출해서
            state.todos.push({
              // push() 메서드 등으로 직접 변경이 가능한 이유는 => "불변성 관리"를 도와주는 "immer 미들웨어" 덕분
              // id와 content가 있을 것을 예상해 작성해줬기에
              id: `${new Date().getTime()}`, // 임시
              content: content, // 매개변수로 받은 content 사용
            });
          });
        },
        deleteTodo: (targetId: string) => {
          // 현재 삭제하고 싶은 투두아이템의 아이디를 'targetID'라는 number 타입의 매개변수로 받아와서
          set((state) => {
            state.todos = state.todos.filter((todo) => todo.id !== targetId);
            // ㄴ filter : 삭제하려는 Item만 빠진 배열
          });
        },
      },
    })),
  ),
);

// 커스텀 훅
// use~Store를 export 해주자니, actions 함수에 변화가 생기면 대응이 어려워서
// 액션 함수나 state의 값에 각각 개별로 접근할 수 있는 커스텀 훅을 만들어 사용

// state 값
export const useTodos = () => {
  // todos state의 값만 딱 꺼내서 반환하면 되니까 selector 함수로 store 매개변수 받아와 store.todos 리턴
  const todos = useTodosStore((store) => store.todos);
  return todos;
};

// action 함수 : createTodo
export const useCreateTodo = () => {
  const createTodo = useTodosStore((store) => store.actions.createTodo);
  return createTodo;
};

// action 함수 : deleteTodo
export const useDeleteTodo = () => {
  const deleteTodo = useTodosStore((store) => store.actions.deleteTodo);
  return deleteTodo;
};
