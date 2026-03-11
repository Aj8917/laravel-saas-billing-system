import { BarChart } from "@mui/x-charts";

const SellChart = ({ selldata }) => {
  
  if (!selldata?.length) return <div>No data available</div>;

  const productSet = new Set();
  const monthSet = new Set();
  const dataMap = {};

  selldata.forEach(item => {
    const product = item.product_name;

    const month = new Date(item.issued_at).toLocaleString("default", {
      month: "short",
      year: "numeric"
    });

    productSet.add(product);
    monthSet.add(month);

    if (!dataMap[product]) dataMap[product] = {};
    if (!dataMap[product][month]) dataMap[product][month] = 0;

    dataMap[product][month] += item.total_quantity;
  });

  const products = Array.from(productSet);
  const months = Array.from(monthSet);

  const series = products.map(product => ({
    label: product,
    data: months.map(month => dataMap[product]?.[month] || 0)
  }));

  return (
    <BarChart
      xAxis={[{ scaleType: "band", data: months }]}
      series={series}
      height={300}
      width={600}
      yAxis={[{ label: "Sales" }]}
    />
  );
};

export default SellChart;