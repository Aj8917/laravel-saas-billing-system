import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosAuth from '../../../api/axiosAuth';
import messageHandler from '../../../util/messageHandler';
import Loader from '../../../util/Loader';

const MonthlyReport = () => {
  const location = useLocation();
  const selectedMonth = location.state?.month || 'No selection of month';

  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // 📦 Fetch Monthly Report
  const fetchReport = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await axiosAuth.post(`/pro-monthly-report?page=${pageNumber}`, {
        month: selectedMonth,
      });

      const data = res.data;

      if (Array.isArray(data?.data) && data.data.length > 0) {
        setList(data.data);
        setTotalPages(data.last_page || 1);
      } else {
        setList([]);
        messageHandler('No data found for this month.', 'error');
      }
    } catch (error) {
      console.error(error);
      messageHandler('Failed to load monthly report.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedMonth){
         messageHandler("Select Month First",'error');
    } else{fetchReport(page);}
  }, [page, selectedMonth]);

  // 🧩 Group all products by invoice number
  const grouped = list.reduce((acc, item, index) => {
    const invoiceNo =
      item.invoice_no && item.invoice_no.trim() !== ''
        ? item.invoice_no
        : `NO-INVOICE-${index}`;
    if (!acc[invoiceNo]) acc[invoiceNo] = [];
    acc[invoiceNo].push(item);
    return acc;
  }, {});

  // 🧮 Convert grouped data to array for table
  const groupedArray = Object.entries(grouped).map(([invoice_no, items]) => {
    const totalSum = items.reduce((acc, cur) => acc + parseFloat(cur.total || 0), 0);
    return {
      invoice_no,
      customer: items[0].name,
      mobile: items[0].mobile,
      date: items[0].issued_at,
      products: items.map((p) => `${p.product_name} (₹${p.total})`).join(', '),
      total: totalSum.toFixed(2),
    };
  });

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">
        📅 Monthly Sales Report — {selectedMonth}
      </h2>

      {loading ? (
        <Loader />
      ) : groupedArray.length === 0 ? (
        <p>No records found for this month.</p>
      ) : (
        <>
          <div className="table-responsive shadow-sm bg-white rounded">
            <table className="table table-bordered table-striped">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Invoice No</th>
                  <th>Customer</th>
                  <th>Products</th>
                  <th>Total (₹)</th>
                  
                </tr>
              </thead>
              <tbody>
                {groupedArray.map((item, index) => (
                  <tr key={index}>
                    <td>{(page - 1) * perPage + index + 1}</td>
                     <td>{item.date}</td>
                    <td>
                      {item.invoice_no.startsWith('NO-INVOICE')
                        ? '(Not Issued)'
                        : item.invoice_no}
                    </td>
                    <td>
                      {item.customer} <br />
                      <small className="text-muted">{item.mobile}</small>
                    </td>
                    <td>{item.products}</td>
                    <td>
                      <strong>₹{item.total}</strong>
                    </td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📄 Pagination (Same as ProInvoiceList) */}
          {totalPages >= 1 && (
            <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
              <button
                className="btn btn-outline-primary"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                className="btn btn-outline-primary"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MonthlyReport;
