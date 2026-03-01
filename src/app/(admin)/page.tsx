import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import { EcommerceMetricss } from "@/components/ecommerce/EcommerceMetricss";

export const metadata: Metadata = {
  title:
    "Dashboard",
  description: "This is the Admin Panel for Icons Library",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6">
        <EcommerceMetrics />
      </div>
      <div className="col-span-12">
        <MonthlySalesChart />
      </div>
      <div className="col-span-12 space-y-6">
        <EcommerceMetricss />
      </div>
    </div>
  );
}
