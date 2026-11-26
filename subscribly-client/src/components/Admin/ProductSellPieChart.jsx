import React, { memo, useMemo, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#0088fe',
  '#00c49f',
  '#ffbb28',
  '#ff4444',
  '#a4de6c',
  '#d0ed57',
];

const ProductSellPieChart = memo(({ sellByAttribute = [], chart = [] }) => {
  const attributes = useMemo(() => {
    const byId = new Map();

    (Array.isArray(sellByAttribute) ? sellByAttribute : []).forEach((item) => {
      if (item.attribute_id != null) {
        byId.set(String(item.attribute_id), item.attribute ?? 'Attribute');
      }
    });

    return Array.from(byId, ([id, name]) => ({ id, name }));
  }, [sellByAttribute]);

  const [selectedAttributeId, setSelectedAttributeId] = useState('');
  const selectedId = attributes.some(({ id }) => id === selectedAttributeId)
    ? selectedAttributeId
    : attributes[0]?.id ?? '';
  const selectedAttribute = attributes.find(({ id }) => id === selectedId);

  const attributeSalesData = useMemo(() => {
    return (Array.isArray(sellByAttribute) ? sellByAttribute : [])
      .filter((item) => String(item.attribute_id) === selectedId)
      .map((item) => ({
        name: item.value ?? 'Unknown',
        value: Number(item.total_sell),
      }))
      .filter((item) => Number.isFinite(item.value) && item.value > 0);
  }, [sellByAttribute, selectedId]);

  const monthlySalesData = useMemo(() => {
    return (Array.isArray(chart) ? chart : [])
      .map((item) => ({
        name: item.month ?? 'Unknown',
        value: Number(item.sales),
      }))
      .filter((item) => Number.isFinite(item.value) && item.value > 0);
  }, [chart]);

  const hasAttributeSales = attributeSalesData.length > 0;
  const pieData = hasAttributeSales ? attributeSalesData : monthlySalesData;

  return (
    <Card elevation={4} sx={{ borderRadius: 3, p: 2 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {hasAttributeSales
            ? `Sales by ${selectedAttribute?.name ?? 'Attribute'}`
            : 'Product Sales by Month'}
        </Typography>

        {hasAttributeSales && attributes.length > 1 && (
          <select
            className="form-select mb-3"
            value={selectedId}
            onChange={(event) => setSelectedAttributeId(event.target.value)}
            aria-label="Select attribute for sales chart"
          >
            {attributes.map((attribute) => (
              <option key={attribute.id} value={attribute.id}>
                {attribute.name}
              </option>
            ))}
          </select>
        )}

        {pieData.length > 0 ? (
          <Box sx={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((item, index) => (
                    <Cell
                      key={`${item.name}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Units sold']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Typography color="text.secondary">
            No sales data available.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
});

export default ProductSellPieChart;