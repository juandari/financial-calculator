import { describe, expect, test } from "vitest";

import { splitBill } from "./split-bill";

describe("split equally", () => {
  test("different total expenses and payments", () => {
    const [result, err] = splitBill(150, [
      { id: "1", name: "Alice", expense: 50, payment: 100 },
      { id: "2", name: "Bob", expense: 10, payment: 100 },
    ]);
    expect(result).toEqual(null);
    expect(err).toEqual(new Error("Total expenses and payments do not match"));
  });

  test("simple case", () => {
    const [result, err] = splitBill(100, [
      { id: "1", name: "Alice", expense: 50, payment: 100 }, // 50
      { id: "2", name: "Bob", expense: 50, payment: 0 }, // -50
    ]);
    expect(result).toEqual([{ payer: "Bob", recipient: "Alice", amount: 50 }]);
    expect(err).toEqual(null);
  });

  test("multiple people pay", () => {
    const [result, err] = splitBill(180, [
      { id: "1", name: "Alice", expense: 45, payment: 0 }, // -45
      { id: "2", name: "Bob", expense: 45, payment: 100 }, // 55
      { id: "3", name: "Charlie", expense: 45, payment: 30 }, // -15
      { id: "4", name: "David", expense: 45, payment: 50 }, // 5
    ]);
    expect(result).toEqual([
      { payer: "Alice", recipient: "Bob", amount: 45 },
      { payer: "Charlie", recipient: "Bob", amount: 10 },
      { payer: "Charlie", recipient: "David", amount: 5 },
    ]);
    expect(err).toEqual(null);
  });

  test("more people but only one pays", () => {
    const [result, err] = splitBill(200, [
      { id: "1", name: "Alice", expense: 50, payment: 0 }, // -50
      { id: "2", name: "Bob", expense: 50, payment: 0 }, // -50
      { id: "3", name: "Charlie", expense: 50, payment: 200 }, // 150
      { id: "4", name: "David", expense: 50, payment: 0 }, // -50
    ]);
    expect(result).toEqual([
      { payer: "Alice", recipient: "Charlie", amount: 50 },
      { payer: "Bob", recipient: "Charlie", amount: 50 },
      { payer: "David", recipient: "Charlie", amount: 50 },
    ]);
    expect(err).toEqual(null);
  });

  test("all people pay", () => {
    const [result, err] = splitBill(200, [
      { id: "1", name: "Alice", expense: 50, payment: 10 }, // -40
      { id: "2", name: "Bob", expense: 50, payment: 60 }, // 10
      { id: "3", name: "Charlie", expense: 50, payment: 30 }, // -20
      { id: "4", name: "David", expense: 50, payment: 100 }, // 50
    ]);
    expect(result).toEqual([
      { payer: "Alice", recipient: "Bob", amount: 10 },
      { payer: "Alice", recipient: "David", amount: 30 },
      { payer: "Charlie", recipient: "David", amount: 20 },
    ]);
    expect(err).toEqual(null);
  });

  test("decimal expenses", () => {
    const [result, err] = splitBill(200, [
      { id: "1", name: "Alice", expense: 28.57, payment: 150 }, // 121.43
      { id: "2", name: "Bob", expense: 28.57, payment: 0 }, // -28.57
      { id: "3", name: "Charlie", expense: 28.57, payment: 50 }, // 21.43
      { id: "4", name: "David", expense: 28.57, payment: 0 }, // -28.57
      { id: "5", name: "Eve", expense: 28.57, payment: 0 }, // -28.57
      { id: "6", name: "Frank", expense: 28.57, payment: 0 }, // -28.57
      { id: "7", name: "Grace", expense: 28.57, payment: 0 }, // -28.57
    ]);
    expect(result).toEqual([
      { payer: "Bob", recipient: "Alice", amount: 28.57 }, // Alice: 92.86, Bob: 0
      { payer: "David", recipient: "Alice", amount: 28.57 }, // Alice: 64.29, David: 0
      { payer: "Eve", recipient: "Alice", amount: 28.57 }, // Alice: 35.72, Eve: 0
      { payer: "Frank", recipient: "Alice", amount: 28.57 }, // Alice: 7.15, Frank: 0
      { payer: "Grace", recipient: "Alice", amount: 7.15 }, // Alice: 0, Grace: -21.42
      { payer: "Grace", recipient: "Charlie", amount: 21.42 }, // Charlie: 0.01, Grace: 0
    ]);
    expect(err).toEqual(null);
  });

  test("decimal expenses and all people pay", () => {
    const [result, err] = splitBill(200, [
      { id: "1", name: "Alice", expense: 28.57, payment: 10 }, // -18.57
      { id: "2", name: "Bob", expense: 28.57, payment: 10 }, // -18.57
      { id: "3", name: "Charlie", expense: 28.57, payment: 20 }, // -8.57
      { id: "4", name: "David", expense: 28.57, payment: 50 }, // 21.43
      { id: "5", name: "Eve", expense: 28.57, payment: 10 }, // -18.57
      { id: "6", name: "Frank", expense: 28.57, payment: 50 }, // 21.43
      { id: "7", name: "Grace", expense: 28.57, payment: 50 }, // 21.43
    ]);
    expect(result).toEqual([
      { payer: "Alice", recipient: "David", amount: 18.57 }, // Alice: 0, David: 2.86
      { payer: "Bob", recipient: "David", amount: 2.86 }, // Bob: -15.71, David: 0
      { payer: "Bob", recipient: "Frank", amount: 15.71 }, // Bob: 0, Frank: 5.72
      { payer: "Charlie", recipient: "Frank", amount: 5.72 }, // Charlie: -2.85, Frank: 0
      { payer: "Charlie", recipient: "Grace", amount: 2.85 }, // Charlie: 0, Grace: 18.58
      { payer: "Eve", recipient: "Grace", amount: 18.57 }, // Eve: 0, Grace: 0.01
    ]);
    expect(err).toEqual(null);
  });
});
