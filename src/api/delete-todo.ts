import { API_URL } from "@/lib/constants.ts";
import type { Todo } from "@/types.ts";

// deleteTodo 삭제 함수를 만들고 매개변수로 삭제할 아이템의 id를 받을 것이다.
export async function deleteTodo(id: string) {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: "DELETE",
  });

  // response.ok가 아니라면
  if (!response.ok) throw new Error("Delete todo failed");
  // response.ok라면
  const data: Todo = await response.json(); // 위 요청의 응답값은 삭제된 todo 아이템이기에 변수의 타입은 Todo
  return data;
}
