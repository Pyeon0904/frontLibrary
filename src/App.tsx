import { Route, Routes } from "react-router";
import TodoListPage from "./pages/todo-list-page.tsx";
import CounterPage from "./pages/counter-page.tsx";
import TodoDetailPage from "@/pages/todo-detail-page.tsx";

function App() {
  return (
    <Routes>
      <Route path="/count" element={<CounterPage />} />
      <Route path="/todolist" element={<TodoListPage />} />
      <Route path="/todolist/:id" element={<TodoDetailPage />} />
    </Routes>
  );
}

export default App;
