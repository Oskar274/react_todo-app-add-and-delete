import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({ todos, onDelete }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id || `temp-${todo.title}`}
          todo={todo}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};
