import TotalDividendsWidget from "../widgets/TotalDividendsWidget";
import TotalStocksExpensesWidget from "../widgets/TotalStocksExpensesWidget";
import YoyDividendLineChart from "../widgets/YoyDividendLineChart";
import YoyTransactionLineChart from "../widgets/YoyTransactionLineChart";
import classes from "./DashboardContainer.module.css";

/**
 * Dashboard container component
 * @author Kenneth Sumang
 */
export default function DashboardContainer() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className={classes.dashboard__container}>
        <TotalDividendsWidget />
        <TotalStocksExpensesWidget />
        <YoyDividendLineChart />
        <YoyTransactionLineChart />
      </div>
    </div>
  );
}
