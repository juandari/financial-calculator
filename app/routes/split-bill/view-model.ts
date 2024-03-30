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
  const [equalSettlements, setEqualSettlements] = useState<Settlement[] | null>(
    null
  );
  const [unequalSettlements, setUnequalSettlements] = useState<
    Settlement[] | null
  >(null);

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

    if (name !== "Multiple") {
      const newParticipants = participants.map((p) => ({
        ...p,
        payment: p.name === name ? Number(removeRpPrefix(bill)) : 0,
      }));
      setParticipants(newParticipants);
    }
  }

  function handleChangePaidAmounts(id: string, value: string) {
    const newParticipants = participants.map((p) =>
      p.id === id ? { ...p, payment: Number(removeRpPrefix(value)) } : p
    );
    setParticipants(newParticipants);
  }

  function handleChangeExpenseAmounts(id: string, value: string) {
    const newParticipants = participants.map((p) =>
      p.id === id ? { ...p, expense: Number(removeRpPrefix(value)) } : p
    );
    setParticipants(newParticipants);
  }

  function validateForm() {
    if (!bill) {
      toast.error("Please enter the bill amount!");
      return false;
    }
    if (participants.length < 2) {
      toast.error("Participants must be more than 1!");
      return false;
    }
    if (!paidBy) {
      toast.error("Please select who paid the bill!");
      return false;
    }

    return true;
  }

  function handleCalculateEqually() {
    if (!validateForm()) return;

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

    setEqualSettlements(settlements);
  }

  function handleCalculateUnequally() {
    if (!validateForm()) return;

    const fmtBill = Number(removeRpPrefix(bill));
    const [settlements, error] = splitBill(fmtBill, participants);
    if (error) {
      toast.error(error.message);
      return;
    }

    setUnequalSettlements(settlements);
  }

  return {
    participantName,
    participantNameRef,
    participants,
    paidBy,
    bill,
    equalSettlements,
    unequalSettlements,
    setBill,
    handleChangePaidAmounts,
    handleChangeExpenseAmounts,
    handleCalculateUnequally,
    handleChangePaidBy,
    handleAddName,
    handleChangeName,
    handleEditName,
    handleDeleteName,
    handleCalculateEqually,
  };
};
