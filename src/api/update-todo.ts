import { API_URL } from "@/lib/constants.ts";
import type { Todo } from "@/types.ts";

// updateTodo 라는 업데이트 요청 함수 생성 => 매개변수 todo로 업데이트 될 todo 아이템을 받아올 것이다.
// - todo 매개변수의 type은, Todo
// - "Partial" : Todo를 수정할 때에, 여러 프로퍼티 중 딱 1개만 수정하는 경우도 있다 (contents, is)
// => 모든 프로퍼티를 '선택적 프로퍼티'로 바꿔주는 유틸리티 타입
export async function updateTodo(todo: Partial<Todo> & { id: string }) {
  const response = await fetch(`${API_URL}/todos/${todo.id}`, {
    method: "PATCH",
    body: JSON.stringify(todo), // 함수의 매개변수로 제공받아 둔 todo 객체 그대로 전달받아
  });

  // 조건절
  if (!response.ok) throw new Error("update Todo Failed"); // 응답이 ok 아니라면, throw
  const data: Todo = await response.json(); // 응답이 ok라면, 응답값을 json형식으로 만들어 data 변수에 담아줘
  // 데이터를 수정하는 요청의 응답값은 수정된 todo 아이템 그 자체이기에 Todo 타입
  return data;

  // updateTodo({
  //   id: "1", // id의 값은 꼭 전달이 돼야함. (id가 전달돼야 어떤 아이템 수정할지 알기에)
  // => Partial에다가 Intersection 타입 (교집합 타입)으로 id는 필수적으로 전달 될 수 있게 해
  // content: "dkdk",
  // });
}
