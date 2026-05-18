import React, { memo, useMemo } from "react";

import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
const generateColors = (count) =>
  Array.from({ length: count }, (_, i) =>
    `hsl(${(i * 360) / count}, 70%, 50%)`
  );
const COLORS = generateColors(12);

const ProductSellPieChart = memo(({ chart = [] }) => {


  const salesData = useMemo(() => {
    return chart?.map(item => ({
      name: item.month,
      value: item.sales,
    })) || [];
  }, [chart]);

  return (
    <Card elevation={4} sx={{ borderRadius: 3, p: 2 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Product Sales Pie Chart
        </Typography>

        <Box sx={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={salesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {salesData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
});

export default ProductSellPieChart;