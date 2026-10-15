import React, { useState } from "react";
import TodoEditor from "../components/todo-list/todo-editor.tsx";
import TodoItem from "../components/todo-list/todo-item.tsx";
import { useTodos } from "../store/todos.ts";

export default function TodoListPage() {
  // dummy 제거 후 todos 호출
  const todos = useTodos(); // useTodos 훅 호출

  return (
    <>
      <div className="flex flex-col gap-5 p-5">
        <h1 className="text-2xl font-bold">TodoList</h1>
        <TodoEditor />
        {todos.map((todo) => (
          <TodoItem key={todo.id} {...todo} />
        ))}
      </div>
    </>
  );
}
