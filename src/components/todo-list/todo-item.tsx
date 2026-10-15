import { Button } from "../ui/button.tsx";
import { useDeleteTodo } from "../../store/todos.ts";

export default function TodoItem({
  id,
  content,
}: {
  id: number;
  content: string;
}) {
  const deleteTodos = useDeleteTodo();

  const handleDeleteClick = () => {
    deleteTodos(id);
  };

  return (
    <div className="flex items-center justify-between border p-2">
      {content}
      <Button onClick={handleDeleteClick} variant={"destructive"}>
        삭제
      </Button>
    </div>
  );
}
