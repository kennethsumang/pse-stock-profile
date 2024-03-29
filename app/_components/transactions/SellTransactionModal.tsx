"use client"

import { Modal } from "@mantine/core";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SellTransactionModal(props: Props) {
  return (
    <>
      <Modal size="md" opened={props.open} onClose={() => props.onClose()} title="Add Sell Transaction">
        {/* Modal content */}
      </Modal>
    </>
  );
}