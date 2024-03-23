import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Participant, Settlement } from "~/domain/model/split-bill";
import { splitBill } from "~/lib/split-bill";
import { removeRpPrefix } from "~/lib/string/remove-rp-prefix";

const emptyParticipantError = "Please enter a participant name!";
const participantExistsError = "Participant already exists!";

export const useSplitBillViewModel = () => {
  const participantNameRef = useRef<HTMLInputElement>(null);
  const [bill, setBill] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [paidBy, setPaidBy] = useState("");
  const [settlements, setSettlements] = useState<Settlement[] | null>(null);

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
        expense: 0,
        payment: 0,
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

  function handleChangePaidAmounts(newParticipants: Participant[]) {
    setParticipants(newParticipants);
  }

  function handleCalculateEqually() {
    if (!bill) {
      toast.error("Please enter the bill amount!");
      return;
    }
    if (participants.length < 2) {
      toast.error("Participants must be more than 1!");
      return;
    }
    if (!paidBy) {
      toast.error("Please select who paid the bill!");
      return;
    }

    let newParticipants = participants;
    const fmtBill = Number(removeRpPrefix(bill));

    if (paidBy !== "Multiple") {
      newParticipants = newParticipants.map((p) => ({
        ...p,
        payment: p.name === paidBy ? fmtBill : 0,
        expense: fmtBill / participants.length,
      }));
    } else {
      newParticipants = newParticipants.map((p) => ({
        ...p,
        expense: fmtBill / participants.length,
      }));
    }

    const [settlements, error] = splitBill(fmtBill, newParticipants);
    if (error) {
      toast.error(error.message);
      return;
    }

    setSettlements(settlements);
  }

  return {
    participantName,
    participantNameRef,
    participants,
    paidBy,
    bill,
    settlements,
    setBill,
    handleChangePaidAmounts,
    handleChangePaidBy,
    handleAddName,
    handleChangeName,
    handleEditName,
    handleDeleteName,
    handleCalculateEqually,
  };
};
