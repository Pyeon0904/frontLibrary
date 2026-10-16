import { Route, Routes } from "react-router";
import TodoListPage from "./pages/todo-list-page.tsx";
import CounterPage from "./pages/counter-page.tsx";

function App() {
  return (
    <Routes>
      <Route path="/count" element={<CounterPage />} />
      <Route path="/todolist" element={<TodoListPage />} />
    </Routes>
  );
}

export default App;
