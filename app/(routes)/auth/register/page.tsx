import classes from "./page.module.css";
import { createClient } from "@/app/_utils/supabase/server";
import { redirect } from "next/navigation";
import RegisterContainer from "@/app/_components/auth/RegisterContainer";

/**
 * Register page component
 * @author Kenneth Sumang
 */
export default async function Page() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!error && data?.user) {
    redirect("/app");
  }

  return (
    <div className={classes.container}>
      {/* <RegisterContainer /> */}
      <h1>It is not yet possible to register for the mean time.</h1>
    </div>
  );
}
