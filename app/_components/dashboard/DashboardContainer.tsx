import YoyDividendLineChart from "../widgets/YoyDividendLineChart";
import "./DashboardContainer.module.css";

/**
 * Dashboard container component
 * @author Kenneth Sumang
 */
export default function DashboardContainer() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="dashboard__container">
        <YoyDividendLineChart />
      </div>
    </div>
  );
}
