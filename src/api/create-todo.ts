import { API_URL } from "@/lib/constants.ts";
import type { Todo } from "@/types.ts";

export async function createTodo(content: string) {
  const response = await fetch(`${API_URL}/todos`, {
    method: "POST",
    body: JSON.stringify({
      // id, // 하단에 설명
      content,
      isDone: false, // 초기값은 false이니 초기화값으로 false로 정의
    }),
  });
  // 조건별 예외처리
  // response.ok 가 아니라면
  if (!response.ok) throw new Error("Create Todo Failed");
  // response.ok 라면
  const data: Todo = await response.json(); // response를 json으로 파싱한 데이터를 data 변수에 담아 리턴
  // 여기서 data: 투두 타입인 것은, 위 요청으로 인해 생성된 투두요소(id, content, isDone)가 그대로 제공이 되어서!
  return data;
}

// id와 같은 순번이 정해질 것 같은 값은 전달하지 않으면 JSON server가 알아서 고유한 값으로 설정을 해줬었기에 id를 날려도 됐었다.
// (db.json 내에 id를 "숫자형"으로 작성해주고 자동으로 최댓값을 찾아서 +1 해주는 방식으로 적용이 됐었는데)
// 그런데, 버전 업데이트 문제인지, id를 "문자열"로 인식해서 랜덤하게 값을 준다