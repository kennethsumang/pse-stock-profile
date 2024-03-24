import { createClient } from "@/app/_utils/supabase/server";
import { redirect } from "next/navigation";

/**
 * Page component
 * @author Kenneth Sumang
 */
export default async function Page() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/");
  }

  return <h1>Logged In!</h1>;
}