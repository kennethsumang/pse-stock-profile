"use client";

import { Button, Group, Modal, NumberInput, Radio } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { DateTime } from "luxon";
import CompanySelector from "../companies/CompanySelector";
import { useState } from "react";
import { DividendForm } from "@/app/_types/dividends";
import { getCurrentDomain } from "@/app/_utils/http.library";
import useToast from "@/app/_hooks/useToast";
import _ from "lodash";
import { Company } from "@/app/_types/companies";
import { useDividendStore } from "@/app/_store";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddDividendModal(props: Props) {
  const toast = useToast();
  const increment = useDividendStore((state) => state.increment);
  const initialState: DividendForm = {
    company: null,
    no_of_shares: 0,
    tax_amount: 0,
    amount_per_share: 0,
    dividend_timestamp: new Date(),
  };
  const [form, setForm] = useState<DividendForm>({ ...initialState });

  async function handleSubmitTransactionForm() {
    const formData = _.omit(form, ["company", "transaction_timestamp"]);
    if (!form.company) {
      toast("error", "You must select a company first.");
      return;
    }

    await fetch(`${getCurrentDomain()}/api/dividends`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        company_id: form.company.id,
        transaction_timestamp: DateTime.fromJSDate(form.dividend_timestamp),
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        toast("success", "New transaction created.");
        increment();
        props.onClose();
        setForm({ ...initialState });
      })
      .catch((e) => toast("error", (e as Error).message));
  }

  return (
    <>
      <Modal
        size="md"
        opened={props.open}
        onClose={() => props.onClose()}
        title="Add Transaction"
        centered
      >
        <div
          style={{
            padding: "0.5rem",
            display: "flex",
            flexDirection: "column",
            rowGap: "0.5rem",
          }}
        >
          <DateTimePicker
            label="Dividend Datetime"
            placeholder="Enter date and time"
            value={form.dividend_timestamp}
            onChange={(val) =>
              setForm({ ...form, dividend_timestamp: val as Date })
            }
          />
          <div>
            <span
              style={{
                fontWeight: 500,
                fontSize:
                  "var(--input-label-size, var(--mantine-font-size-sm))",
              }}
            >
              Company
            </span>
            <CompanySelector
              onSelect={(company) =>
                setForm({ ...form, company: company as Company })
              }
              addAllCompaniesOption={false}
            />
          </div>

          <NumberInput
            label="Amount Per Share"
            fixedDecimalScale
            decimalScale={2}
            value={form.amount_per_share}
            onChange={(value) =>
              setForm({ ...form, amount_per_share: Number(value) })
            }
          />

          <NumberInput
            label="# of Shares"
            decimalScale={0}
            fixedDecimalScale
            value={form.no_of_shares}
            onChange={(value) =>
              setForm({ ...form, no_of_shares: Number(value) })
            }
          />

          <NumberInput
            label="Total Tax Amount"
            fixedDecimalScale
            decimalScale={2}
            value={form.tax_amount}
            onChange={(value) =>
              setForm({ ...form, tax_amount: Number(value) })
            }
          />

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "end",
              marginTop: "1rem",
            }}
          >
            <Button onClick={() => handleSubmitTransactionForm()}>
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
