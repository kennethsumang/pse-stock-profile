"use client"

import { Button, Group, Modal, NumberInput, Radio } from "@mantine/core";
import { DateTimePicker } from '@mantine/dates';
import { DateTime } from "luxon";
import CompanySelector from "../companies/CompanySelector";
import { useEffect, useState } from "react";
import { Transaction, TransactionForm, TransactionType } from "@/app/_types/transactions";
import { getCurrentDomain } from "@/app/_utils/http.library";
import useToast from "@/app/_hooks/useToast";
import _ from "lodash";
import { Company } from "@/app/_types/companies";
import { useTransactionStore } from "@/app/_store";

interface Props {
  open: boolean;
  data: Transaction|null;
  onClose: (saved: boolean) => void;
}

export default function EditTransactionModal(props: Props) {
  const toast = useToast();
  const increment = useTransactionStore((state) => state.increment);
  const initialState: TransactionForm = {
    company: null,
    quantity: 0,
    tax_amount: 0,
    price: 0,
    type: 'buy',
    transaction_timestamp: new Date(),
  };
  const [form, setForm] = useState<TransactionForm>({ ...initialState });
  
  useEffect(() => {
    if (props.data) {
      setForm({
        company: props.data.companies,
        quantity: props.data.quantity,
        tax_amount: props.data.tax_amount,
        price: props.data.price,
        type: props.data.type,
        transaction_timestamp: new Date(props.data?.transaction_timestamp),
      });
    }
  }, [props.data]);

  async function handleSubmitTransactionForm() {
    const formData = _.omit(form, ["company", "transaction_timestamp"]);
    if (!form.company) {
      toast("error", "You must select a company first.");
      return;
    }

    if (!props.data) {
      return;
    }

    await fetch(
      `${getCurrentDomain()}/api/transactions/${props.data.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          company_id: form.company.id,
          transaction_timestamp: DateTime.fromJSDate(form.transaction_timestamp)
        }),
      }
    )
      .then((response) => response.json())
      .then(() => {
        toast("success", "Transaction is updated successfully.");
        increment();
        props.onClose(true);
        setForm({ ...initialState });
      })
      .catch((e) => toast("error", (e as Error).message));
  }

  return (
    <>
      <Modal size="md" opened={props.open} onClose={() => props.onClose(false)} title="Edit Transaction Details" centered>
        <DateTimePicker
          label="Transaction Datetime"
          placeholder="Enter date and time"
          value={form.transaction_timestamp}
          onChange={(val) => setForm({ ...form, transaction_timestamp: val as Date })}
        />
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
            <CompanySelector
              value={form.company ?? undefined}
              onSelect={(company) => setForm({ ...form, company: company as Company })}
              addAllCompaniesOption={false}
            />
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
            label="Total Taxes & Fees"
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