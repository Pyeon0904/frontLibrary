import React from "react";
import TodoEditor from "../components/todo-list/todo-editor.tsx";
import TodoItem from "../components/todo-list/todo-item.tsx";
import { useTodosData } from "@/hooks/queries/use-todos-data.ts";

export default function TodoListPage() {
  // (1) dummy 제거 후 todos 호출
  // const todos = useTodos(); // useTodos 훅 호출
  // (2) Zustand 로 불러오도록 작성한 위 코드 제거

  // (TQ2)useQuery 사용
  const {
    data: todos, // 정상적으로 불러와졌을 때 사용할 data 명칭
    isLoading,
    error,
  } = useTodosData(); // 분리해서 커스텀 훅만 불러오기

  if (error) return <div>오류가 발생했습니다..</div>;
  if (isLoading) return <div>로딩 중입니다..</div>;
  // error 도 아니고 isLoading도 아니면 성공적으로 불러왔다는 것이니
  // => 불러오게 될 데이터 이름을 todos로 변경해서 (반환 data)

  return (
    <>
      <div className="flex flex-col gap-5 p-5">
        <h1 className="text-2xl font-bold">TodoList</h1>
        <TodoEditor />
        {/* todos. 점표기법으로 하면 에러가 나는 이유 : undefined 가능성 제거해줘야함*/}
        {todos?.map((todo) => (
          <TodoItem key={todo.id} {...todo} />
        ))}
      </div>
    </>
  );
}
