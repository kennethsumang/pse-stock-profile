import DashboardContainer from "@/app/_components/dashboard/DashboardContainer";
import DataInitializerComponent from "@/app/_components/misc/DataInitializerComponent";

/**
 * Page component
 * @author Kenneth Sumang
 */
export default async function Page() {
  return (
    <>
      <DataInitializerComponent />
      <DashboardContainer />
    </>
  );
}