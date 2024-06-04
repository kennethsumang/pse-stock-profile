"use client";

import useToast from "@/app/_hooks/useToast";
import { useCompanyStore } from "@/app/_store";
import { useEffect } from "react";

/**
 * Data Initializer component
 * @author Kenneth Sumang
 */
export default function DataInitializerComponent() {
  const companyStore = useCompanyStore((state) => state);
  const toast = useToast();

  useEffect(() => {
    if (!companyStore.companies || companyStore.companies.length === 0) {
      companyStore.fetchAllCompanies();
    }
  }, []);

  return <></>;
}