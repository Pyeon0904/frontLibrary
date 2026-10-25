import { Button } from "../ui/button.tsx";
import { Link } from "react-router";
import type { Todo } from "@/types.ts";
import { useUpdateTodoMutation } from "@/hooks/mutations/use-update-todo-mutation.ts";
import { useDeleteTodoMutation } from "@/hooks/mutations/use-delete-todo-mutation.ts";

export default function TodoItem({ id, content, isDone }: Todo) {
  const { mutate: updatedTodo } = useUpdateTodoMutation(); // 업데이트 mutation 호출
  const { mutate: deleteTodo, isPending: isDeleteTodoPending } =
    useDeleteTodoMutation(); // 삭제 mutation 호출
  // => mutate 를 동시에 쓸 수는 없으니 이름을 상세히 해줌

  // 삭제 이벤트 핸들러
  const handleDeleteClick = () => {
    deleteTodo(id); // 삭제한 아이템의 id 값을 넘겨주기
  };

  // 체크박스 이벤트 핸들러
  const handleCheckboxClick = () => {
    // mutate 함수를 호출하면서 인수로 객체 형태의 Todo 아이템을 전달할 것이다
    updatedTodo({
      id,
      isDone: !isDone, // 현재의 isDone 상태의 반대'!' 값이 되도록 한다.
    });
  };

  return (
    <div className="flex items-center justify-between border p-2">
      <div className="flex gap-5">
        {/* 체크박스용 input */}
        <input
          disabled={isDeleteTodoPending}
          type={"checkbox"}
          onClick={handleCheckboxClick}
          checked={isDone}
        />
        <Link to={`/todolist/${id}`}>{content}</Link>
      </div>
      <Button
        disabled={isDeleteTodoPending}
        onClick={handleDeleteClick}
        variant={"destructive"}
      >
        삭제
      </Button>
    </div>
  );
}
