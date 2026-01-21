import { useState, useEffect, useRef } from 'react';

type Props = {
  onCreate: (title: string) => void;
  onEmpty?: () => void;
};

export const Header: React.FC<Props> = ({ onCreate, onEmpty }) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = title.trim();

    if (!trimmed) {
      onEmpty?.();

      return;
    }

    onCreate(title.trim());
    setTitle('');
  }

  useEffect(() => {
    if (title === '') {
      inputRef.current?.focus();
    }
  }, [title]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
