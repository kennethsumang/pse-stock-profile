import YoyDividendLineChart from "../widgets/YoyDividendLineChart";
import classes from "./DashboardContainer.module.css";

/**
 * Dashboard container component
 * @author Kenneth Sumang
 */
export default function DashboardContainer() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className={classes.dashboard__container}>
        <YoyDividendLineChart />
        <YoyDividendLineChart />
      </div>
    </div>
  );
}
