import { Button } from "../ui/button.tsx";
import { Link } from "react-router";
import type { Todo } from "@/types.ts";
import { useUpdateTodoMutation } from "@/hooks/mutations/use-update-todo-mutation.ts";

export default function TodoItem({ id, content, isDone }: Todo) {
  const { mutate } = useUpdateTodoMutation(); // mutation 호출
  const handleDeleteClick = () => {};

  // 체크박스 이벤트 핸들러
  const handleCheckboxClick = () => {
    // mutate 함수를 호출하면서 인수로 객체 형태의 Todo 아이템을 전달할 것이다
    mutate({
      id,
      isDone: !isDone, // 현재의 isDone 상태의 반대'!' 값이 되도록 한다.
    });
  };

  return (
    <div className="flex items-center justify-between border p-2">
      <div className="flex gap-5">
        {/* 체크박스용 input */}
        <input
          type={"checkbox"}
          onClick={handleCheckboxClick}
          checked={isDone}
        />
        <Link to={`/todolist/${id}`}>{content}</Link>
      </div>
      <Button onClick={handleDeleteClick} variant={"destructive"}>
        삭제
      </Button>
    </div>
  );
}
