"use client"

import { Modal } from "@mantine/core";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function BuyTransactionModal(props: Props) {
  return (
    <>
      <Modal size="md" opened={props.open} onClose={() => props.onClose()} title="Add Buy Transaction">
        {/* Modal content */}
      </Modal>
    </>
  );
}