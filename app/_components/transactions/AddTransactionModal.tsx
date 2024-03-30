"use client"

import { Button, Group, Modal, NumberInput, Radio } from "@mantine/core";
import CompanySelector from "../companies/CompanySelector";
import { useState } from "react";
import { TransactionForm, TransactionType } from "@/app/_types/transactions";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddTransactionModal(props: Props) {
  const [form, setForm] = useState<TransactionForm>({
    company: null,
    quantity: 0,
    tax_amount: 0,
    price: 0,
    type: 'buy'
  });

  function handleSubmitTransactionForm() {
    console.log(form);
  }

  return (
    <>
      <Modal size="md" opened={props.open} onClose={() => props.onClose()} title="Add Buy Transaction" centered>
        <div style={{ padding: "0.5rem", display: "flex", flexDirection: "column", rowGap: "0.5rem" }}>
          <Radio.Group
            name="transactionType"
            label="Transaction Type"
            value={form.type}
            onChange={(type) => setForm({ ...form, type: type as TransactionType })}
            withAsterisk
          >
            <Group mt="xs">
              <Radio value="buy" label="Buy" />
              <Radio value="sell" label="Sell" />
            </Group>
          </Radio.Group>

          <div>
            <span style={{ fontWeight: 500, fontSize: "var(--input-label-size, var(--mantine-font-size-sm))" }}>
              Company
            </span>
            <CompanySelector onSelect={(company) => setForm({ ...form, company })} />
          </div>

          <NumberInput
            label="Price"
            fixedDecimalScale
            decimalScale={2}
            value={form.price}
            onChange={(value) => setForm({ ...form, price: Number(value) })}
          />

          <NumberInput
            label="Quantity"
            decimalScale={0}
            fixedDecimalScale
            value={form.quantity}
            onChange={(value) => setForm({ ...form, quantity: Number(value) })}
          />

          <NumberInput
            label="Total Tax Amount"
            fixedDecimalScale
            decimalScale={2}
            value={form.tax_amount}
            onChange={(value) => setForm({ ...form, tax_amount: Number(value) })}
          />

          <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "end", marginTop: "1rem" }}>
            <Button onClick={() => handleSubmitTransactionForm()}>Submit</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}