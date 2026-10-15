import { Input } from "../ui/input.tsx";
import { Button } from "../ui/button.tsx";
import { useState } from "react";
import { useCreateTodo } from "../../store/todos.ts";

export default function TodoEditor() {
  const createTodo = useCreateTodo();
  const [content, setContent] = useState("");

  const handleAddClick = () => {
    if (content.trim() === "") return; // trim() 메서드로 공백을 다 제거해본 결과가 빈 문자열일 때, return
    createTodo(content); // createTodo 액션함수를 호출하기 위해 hook을 호출
    setContent(""); // 투두아이템 추가 후 입력값 비우기
  };

  return (
    <div className="flex gap-2">
      <Input
        // Input 컴포넌트의 입력 값을 보관하기 위해 value Props
        value={content}
        // onChange 이벤트 핸들러로 합성이벤트 객체 e를 매개변수로 받아 setContent를 호출해서 e.target.value를 전달하도록 설정
        onChange={(e) => setContent(e.target.value)}
        placeholder="새로운 할 일을 입력하세요.."
      />
      <Button onClick={handleAddClick}>추가</Button>
    </div>
  );
}
