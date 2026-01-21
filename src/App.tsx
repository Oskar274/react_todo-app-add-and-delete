/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
//#region import
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
//#endregion

export const App: React.FC = () => {
  function prepairedTodo(todos: Todo[], status: string, query: string): Todo[] {
    let result = [...todos];

    if (status === 'active') {
      result = result.filter(todo => !todo.completed);
    }

    if (status === 'completed') {
      result = result.filter(todo => todo.completed);
    }

    if (query.trim()) {
      const normalizedQuery = query.toLowerCase();

      result = result.filter(todo =>
        todo.title.toLowerCase().includes(normalizedQuery),
      );
    }

    return result;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState('all');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [query, setQuery] = useState('');
  const [error, setError] = useState<ErrorType>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const visibleTodos = prepairedTodo(todos, status, query);
  const allTodos = tempTodo ? [...visibleTodos, tempTodo] : visibleTodos;

  useEffect(() => {
    client
      .get<Todo[]>('/todos?userId=3838')
      .then(setTodos)
      .catch(() => setError('LOAD_TODOS'));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function createTodo({ title, userId, completed = false }: Omit<Todo, 'id'>) {
    return client.post<Todo>('/todos', { title, userId, completed });
  }

  function handleEmptyTitle() {
    setError('EMPTY_TITLE');
    setTimeout(() => setError(null), 3000);
  }

  function handleCreateTodo(title: string): Promise<void> {
    if (!USER_ID) {
      return Promise.resolve();
    }

    // Создаем временный todo
    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTempTodo);

    return createTodo({ title, userId: USER_ID, completed: false })
      .then((newTodo: Todo) => {
        setTodos(prev => [...prev, newTodo]);
        setTempTodo(null);
      })
      .catch(() => {
        setError('ADD_TODO');
        setTempTodo(null);
      });
  }

  function deleteTodo(id: number) {
    client
      .delete(`/todos/${id}`)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => setError('DELETE_TODO'));
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onCreate={handleCreateTodo} onEmpty={handleEmptyTitle} />
        <TodoList todos={allTodos} onDelete={deleteTodo} />
        {todos.length > 0 && (
          <Footer onStatusChange={setStatus} status={status} todos={todos} />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={error} onClose={() => setError(null)} />
    </div>
  );
};
