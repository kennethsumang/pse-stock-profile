"use client"

import { Modal } from "@mantine/core";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddDividendModal(props: Props) {
  return (
    <>
      <Modal size="md" opened={props.open} onClose={() => props.onClose()} title="Add Dividend Record">
        {/* Modal content */}
      </Modal>
    </>
  );
}