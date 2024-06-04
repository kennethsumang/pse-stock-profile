"use client";

import { Button, Modal, NumberInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { DateTime } from "luxon";
import CompanySelector from "../companies/CompanySelector";
import { useEffect, useState } from "react";
import { Dividend, DividendForm } from "@/app/_types/dividends";
import { getCurrentDomain } from "@/app/_utils/http.library";
import useToast from "@/app/_hooks/useToast";
import _ from "lodash";
import { Company } from "@/app/_types/companies";
import { useDividendStore } from "@/app/_store";

interface Props {
  open: boolean;
  data: Dividend|null;
  onClose: (saved: boolean) => void;
}

export default function EditDividendModal(props: Props) {
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

  useEffect(() => {
    if (props.data) {
      setForm({
        company: props.data.companies,
        no_of_shares: props.data.no_of_shares,
        tax_amount: props.data.tax_amount,
        amount_per_share: props.data.amount_per_share,
        dividend_timestamp: new Date(props.data.dividend_timestamp),
      });
    }
  }, [props.data]);

  async function handleSubmitDividendForm() {
    const formData = _.omit(form, ["company", "dividend_timestamp"]);
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
        dividend_timestamp: DateTime.fromJSDate(form.dividend_timestamp),
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        toast("success", "New dividend record created.");
        increment();
        props.onClose(true);
        setForm({ ...initialState });
      })
      .catch((e) => toast("error", (e as Error).message));
  }

  return (
    <>
      <Modal
        size="md"
        opened={props.open}
        onClose={() => props.onClose(false)}
        title="Add Dividend Record"
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
              value={form.company ?? undefined}
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
            label="Total Taxes & Fees"
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
            <Button onClick={() => handleSubmitDividendForm()}>Submit</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
