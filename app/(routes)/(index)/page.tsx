import LoginContainer from "@/app/_components/auth/LoginContainer";
import classes from "./page.module.css";

/**
 * IndexPage component
 * @author Kenneth Sumang
 */
export default function Page() {
  return (
    <div className={classes.container}>
      <LoginContainer />
    </div>
  )
}