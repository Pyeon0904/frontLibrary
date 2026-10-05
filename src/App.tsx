import {Route, Routes} from "react-router";
import TodoListPage from "./pages/todo-list-page.tsx";

function App() {
  return (
    <Routes>
      <Route path="/todolist" element={<TodoListPage />} />
    </Routes>
  );
}

export default App;
