import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Participant } from "./types";
import { removeRpPrefix } from "../../lib/string/remove-rp-prefix";

const emptyParticipantError = "Please enter a participant name!";
const participantExistsError = "Participant already exists!";

export const useSplitBillViewModel = () => {
  const participantNameRef = useRef<HTMLInputElement>(null);
  const [participantName, setParticipantName] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [paidBy, setPaidBy] = useState("");

  function handleChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    setParticipantName(e.target.value);
  }

  function handleAddName() {
    participantNameRef.current?.focus();

    if (!participantName) {
      toast.error(emptyParticipantError);
      return;
    }
    if (participants.some((p) => p.name === participantName.trim())) {
      toast.error(participantExistsError);
      return;
    }

    setParticipantName("");

    setParticipants((participants) => [
      ...participants,
      {
        id: crypto.randomUUID(),
        name: participantName.trim(),
        expense: null,
        payment: null,
      },
    ]);
  }

  function handleEditName(id: string, name: string) {
    if (!name) {
      toast.error(emptyParticipantError);
      return {
        isError: true,
      };
    }
    if (participants.some((p) => p.name === name.trim())) {
      toast.error(participantExistsError);
      return {
        isError: true,
      };
    }

    const newParticipants = participants.map((p) =>
      p.id === id ? { ...p, name } : p
    );
    setParticipants(newParticipants);

    return {
      isError: false,
    };
  }

  function handleDeleteName(id: string) {
    const newParticipants = participants.filter((p) => p.id !== id);
    setParticipants(newParticipants);
  }

  function handleChangePaidBy(name: string) {
    setPaidBy(name);
  }

  function handleChangePaidAmounts(id: string, value: string) {
    const newParticipants = participants.map((p) =>
      p.id === id ? { ...p, payment: Number(removeRpPrefix(value)) } : p
    );
    setParticipants(newParticipants);
    console.log(newParticipants, "arjun");
  }

  return {
    participantName,
    participantNameRef,
    participants,
    paidBy,
    handleChangePaidAmounts,
    handleChangePaidBy,
    handleAddName,
    handleChangeName,
    handleEditName,
    handleDeleteName,
  };
};
