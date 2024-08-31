import { useEffect, useState } from "react";
import Todo from "./Todo";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");

  

  useEffect(() => {
    const getTodos = async () => {
      const res = await fetch("/api/todos");
      const todos = await res.json();

      setTodos(todos);
    };
    getTodos();
  }, [])

  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.length > 3) {
      const res = await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({ todo: content }),  
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newTodo = await res.json();

			setContent("");
      setTodos([...todos, newTodo])
    }
  };

  return (
    <main className="container">
      <h1 className="title">Todo Tasklist</h1>
      <form className="form" onSubmit={createNewTodo}>
        <input 
          type="text" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          placeholder="Enter a new todo..."
          className="form__input"
          required 
        />
        <button type="submit">Create Todo</button>
      </form>
      <div className="todos">
        {(todos.length > 0) &&
          todos.map((todo) => (
            <Todo todo={todo} setTodos={setTodos} key={todo._id} />
          ))
        }
      </div>
    </main>
  );
}