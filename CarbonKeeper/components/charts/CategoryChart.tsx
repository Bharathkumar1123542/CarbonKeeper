"use client";

import dynamic from "next/dynamic";

const PieChart = dynamic(() => import("recharts").then((m) => m.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then((m) => m.Pie), { ssr: false });
const Cell = dynamic(() => import("recharts").then((m) => m.Cell), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false });

const CATEGORY_COLORS: Record<string, string> = {
  transport: "#14b8a6",
  food: "#f87171",
  energy: "#fbbf24",
  shopping: "#a78bfa",
};

const tooltipStyle = {
  borderRadius: "12px",
  border: "none",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
};

/**
 * Props for the CategoryChart component.
 * Renders a donut chart breaking down emissions by category.
 */
interface Props {
  /** Array of category data points, each with a name (e.g. "transport") and value in kg */
  data: { name: string; value: number }[];
}

export function CategoryChart({ data }: Props) {
  if (data.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="h-[180px] w-full" role="img" aria-label="Category breakdown chart">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || "#94a3b8"} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: unknown) => [`${Number(value).toFixed(2)} kg`, "Emissions"]}
              contentStyle={tooltipStyle}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-[12px] font-semibold" aria-hidden="true">
        {data.map((entry) => (
          <span key={entry.name} className="flex items-center gap-1.5 capitalize">
            <span
              className="w-3 h-3 rounded-sm inline-block"
              style={{ backgroundColor: CATEGORY_COLORS[entry.name] || "#94a3b8" }}
            />
            {entry.name}: {entry.value.toFixed(1)} kg
          </span>
        ))}
      </div>
    </div>
  );
}