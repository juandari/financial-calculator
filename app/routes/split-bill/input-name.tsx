import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";

interface InputNameProps {
  id: string;
  defaultName: string;
  onEdit: (id: string, name: string) => { isError: boolean };
  onDelete: (id: string) => void;
}

export default function InputName({
  id,
  defaultName,
  onEdit,
  onDelete,
}: InputNameProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(defaultName);
  const [isEditing, setIsEditing] = useState(false);

  function handleClickDoneEdit() {
    setIsEditing(false);
    if (name === defaultName) return;

    const { isError } = onEdit(id, name);
    if (isError) {
      setName(defaultName);
    }
  }

  function handleDelete() {
    onDelete(id);
  }

  function handleToggleEdit() {
    setIsEditing(true);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleClickDoneEdit();
    }
  }

  // Focus input when editing
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <>
      <div className="flex justify-between items-center rounded-lg">
        <Input
          ref={inputRef}
          type="text"
          disabled={!isEditing}
          value={name}
          onKeyDown={handleKeyDown}
          onChange={(e) => setName(e.target.value)}
          className="text-sm px-2 overflow-hidden text-ellipsis whitespace-nowrap border-none bg-transparent"
        />
        <div className="flex ml-2">
          {!isEditing ? (
            <Button
              variant="outline"
              size="icon"
              name="intent"
              value="editParticipant"
              aria-label="edit participant"
              onClick={handleToggleEdit}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon"
              name="intent"
              value="doneEditParticipant"
              aria-label="done editing participant"
              onClick={handleClickDoneEdit}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            name="intent"
            value="deleteParticipant"
            aria-label="delete participant"
            className="ml-1"
            onClick={handleDelete}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </Button>
        </div>
      </div>
      <Separator />
    </>
  );
}
