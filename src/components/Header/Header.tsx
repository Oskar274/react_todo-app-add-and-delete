import { useState, useRef, useEffect } from 'react';

type Props = {
  onCreate: (title: string) => Promise<void>;
  onEmpty?: () => void;
};

export const Header: React.FC<Props> = ({ onCreate, onEmpty }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = title.trim();

    if (!trimmed) {
      onEmpty?.();
      inputRef.current?.focus();

      return;
    }

    setIsLoading(true);
    try {
      await onCreate(trimmed);
      setTitle('');
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
