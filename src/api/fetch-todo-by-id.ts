import { API_URL } from "@/lib/constants.ts";
import type { Todo } from "@/types.ts";

// 서버로부터 불러올 투두아이템dml id를 number 타입의 매개변수로 받아와서
export async function fetchTodoById(id: number) {
  const response = await fetch(`${API_URL}/todos/${id}`);

  // response.ok가 false라면,
  if (!response.ok) throw new Error("fetch failed");
  // response.ok가 true라면,
  const data: Todo = await response.json(); // response(응답)을 json 으로 파싱해서 data변수에 저장하고
  // data 변수의 타입은 - 하나의 투두아이템이 담길 변수니까
  return data; // data 변수를 반환
}
