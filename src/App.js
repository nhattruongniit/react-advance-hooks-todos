import React, {
  useReducer,
  createContext,
  useContext,
  useRef,
  useEffect,
} from "react";

// context
const AppContext = createContext();

// reducers
function appReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, action.payload];
    case "DELETE_TODO":
      const newState = state.filter((item) => item.id !== action.payload);
      return newState;
    case "TOGGLE_COMPLETE":
      const newTodo = state.map((item) => {
        if (item.id === action.payload) {
          return {
            ...item,
            complete: !item.complete,
          };
        }
        return item;
      });
      return newTodo;
    case "LOAD_TODO":
      return action.payload;
    case "RESET_TODO":
      return [];
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(appReducer, []);
  const refInput = useRef(null);

  useEffect(() => {
    const raw = localStorage.getItem("data");
    dispatch({
      type: "LOAD_TODO",
      payload: JSON.parse(raw),
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(state));
  }, [state]);

  function handleAddTodo() {
    dispatch({
      type: "ADD_TODO",
      payload: {
        id: Math.random(),
        title: refInput.current.value,
        complete: false,
      },
    });
  }

  function handleResetTodo() {
    dispatch({
      type: "RESET_TODO",
      payload: [],
    });
  }

  return (
    <AppContext.Provider value={dispatch}>
      <div className="App">
        <header className="App-header">
          <h1>Todo Apps by React advance hooks</h1>
        </header>
        <section className="container">
          <input type="text" placeholder="please enter title" ref={refInput} />
          <br />
          <br />
          <button type="button" onClick={handleAddTodo}>
            Add Todo
          </button>
          <button type="button" onClick={handleResetTodo}>
            Reset Todo
          </button>
          <br />
          <TodoList todos={state} />
        </section>
      </div>
    </AppContext.Provider>
  );
}

function TodoItem({ id, title, complete }) {
  const dispatch = useContext(AppContext);

  function handleDeleteTodo(id) {
    dispatch({
      type: "DELETE_TODO",
      payload: id,
    });
  }

  function toggleComplete(id) {
    dispatch({
      type: "TOGGLE_COMPLETE",
      payload: id,
    });
  }

  return (
    <div className="todo__item">
      <div
        style={{
          textDecoration: `${complete ? "line-through" : "none"}`,
        }}
      >
        ID: {id} <br />
        Title: {title}
      </div>
      <div>
        <button type="button" onClick={() => toggleComplete(id)}>
          Complete
        </button>
        <button type="button" onClick={() => handleDeleteTodo(id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

function TodoList({ todos }) {
  return todos.map((todo) => <TodoItem key={todo.id} {...todo} />);
}

export default App;
