// (TQ1)데이터 불러올 비동기 함수 작성
import { API_URL } from "@/lib/constants.ts";
import type { Todo } from "@/types.ts";

export async function fetchTodos() {
  // 원래 js로 데이터 페칭해오듯
  const response = await fetch(`${API_URL}/todos`);
  // 응답상태가 ok가 아니라면 throw error 에러처리
  if (!response.ok) throw new Error("Fetch Failed");

  // 응답상태 OK 라면, data를 투두 배열타입으로 정의 해주고
  // await response.json() 메서드를 호출해서 응답값 파싱해 담아준다.
  const data: Todo[] = await response.json();
  return data;
}
