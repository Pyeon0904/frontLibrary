import { Button } from "../ui/button.tsx";
import { Link } from "react-router";
import { useUpdateTodoMutation } from "@/hooks/mutations/use-update-todo-mutation.ts";
import { useDeleteTodoMutation } from "@/hooks/mutations/use-delete-todo-mutation.ts";
import { useTodoDataById } from "@/hooks/queries/use-todo-data-by-id.ts";

// 정규화 - todo-list-page에서 id만 사용하기에 id props만 받음
// 기존의 content, isDone 등 다른 프로퍼티는 어떻게 받아올 수 있을까?
export default function TodoItem({ id }: { id: string }) {
  // => props로 받아온 id 값을 통해 캐시데이터에서 'todo' 아이템의 값을 꺼내오도록 설정해주면 됨
  // => 이렇게 하면, todo 아이템의 데이터를 매번 다시 요청한다고 해도 캐시된 데이터를 사용할 뿐, 새롭게 서버에 요청보내지 않음
  const { data: todo } = useTodoDataById(id, "LIST"); // 반환될 데이터는 Todo 이름으로 바꿔서 저장
  // type 매개변수를 LIST로 전달해서 어떠한 경우에도 refetching 되지 않도록 함
  if (!todo) throw new Error("Todo Data Undefined");
  const { content, isDone } = todo;

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
