import { useParams } from "react-router";
import { useTodoDataById } from "@/hooks/queries/use-todo-data-by-id.ts";

export default function TodoDetailPage() {
  // [1]. 화면이 불러온 현재 아이템의 id 값을 불러와야 하니까 params 변수를
  // 'useParams' 라는 React Router에서 제공해주는 hook을 호출해서
  // 'URL 파라미터 객체(url에 입력된)'를 params이라는 이름으로 불러와준다
  const params = useParams();

  const id = params.id; // [2]. 현재 URL 파라미터의 id값을 꺼내와 id변수에 넣어준다.

  // [3]. 해당하는 id 값을 갖는 투두아이템의 데이터를 서버로부터 불러오기 (만든 hook 갖다 쓰기)
  const { data, isLoading, error } = useTodoDataById(String(id)); // 매개변수 1개 필요하고 id 를 넣어줬음 => Number 형변환을 해줌

  if (isLoading) return <div>로딩 중입니다..</div>;
  if (error || !data) return <div>오류가 발생했습니다.</div>;

  return <div>{data.content}</div>;
}
