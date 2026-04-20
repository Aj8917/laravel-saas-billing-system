import React, { useEffect, useState } from 'react';
import asyncHandler from '../../util/asyncHandler';
import messageHandler from '../../util/messageHandler';
import { useNavigate } from 'react-router-dom';
import axiosAuth from '../../api/axiosAuth';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Loader from '../../util/Loader';

const ProductsList = () => {
  const [products, setProducts] = useState([
    {
      productName: '',
      // quantity: 1,
      price: '',
      stock: '',
      batchNo: '',
      unit: '',
      category: [],
      attributes: [] //  initialize as array
    }
  ]);
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    asyncHandler(async () => {
      const response = await axiosAuth.get('/products');

      const data = response.data;

      if (Array.isArray(data.products)) {
        setList(data.products);
        setTotalPages(data.last_page || 1);
      } else {
        setList([]);
        messageHandler('No Products found.', 'error');
      }

     // console.log(data.products);
    })();
  }, []);
  return (
    <div className="container mt-4">
      <h2>Product Lists</h2>

      <div className="d-flex justify-content-end mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by Name ..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>SKU </th>
            <th>Unit</th>


          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center">
                <Loader />
              </td>
            </tr>
          ) : list.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No tickets found.
              </td>
            </tr>
          ) : (
            list.map((item, index) => (
              <tr key={index}>
                <td>{index+1}</td>
                <td>{item.name}</td>
                <td>{item.base_sku}</td>
                <td>{item.unit}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            className="btn btn-outline-secondary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span>Page {page} of {totalPages}</span>

          <button
            className="btn btn-outline-secondary"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
