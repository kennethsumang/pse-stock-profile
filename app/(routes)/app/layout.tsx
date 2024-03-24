import AppLayout from "@/app/_components/common/AppLayout";
import { createClient } from "@/app/_utils/supabase/server";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

/**
 * Page component
 * @author Kenneth Sumang
 */
export default async function Layout({ children }: Props) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/");
  }

  return (
    <AppLayout>
      { children }
    </AppLayout>
  );
}