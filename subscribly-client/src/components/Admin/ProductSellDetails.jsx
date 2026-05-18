import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosAuth from '../../api/axiosAuth';
import asyncHandler from '../../util/asyncHandler';
import messageHandler from '../../util/messageHandler';
import { Card, Col, Row, Spinner } from 'react-bootstrap';
import { Container } from '@mui/material';
import ProductSellPieChart from './ProductSellPieChart';

const ProductSellDetails = () => {
  const { uuid } = useParams();
  const [productDetails, setProductDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const product = productDetails?.[0];
  useEffect(() => {
    const fetchProduct = async () => {
      if (!uuid) {
        console.error('No uuid ID Found');
        return;
      }

      try {
        const response = await axiosAuth.get(`/products/${uuid}`);
       // console.log(response.data);
        //console.log('res 2'+response.data[0].sales_chart);

        // Set customer and invoice data
        setProductDetails(response.data)
      } catch (err) {
        // console.error('Failed to load invoice:', err);
        messageHandler(`"Failed to load Product:"${err.response.data.errors}`, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [uuid]);
  if (loading) {
    return <p>Loading Product...</p>;
  }
  return (
    <section className="py-1">
      <div className="container">
        <section className="dash-form-wrapper">
          <div className="form-box">
            <h2 className="text-center mb-4 form-header">Product  Details : <span color='brown'>{productDetails.name}</span></h2>
            <section className="py-1">
              <div className="container">
                <section className="dash-form-wrapper">
                  <div className="form-box">

                    <Row className="justify-content-start mt-4">
                      {/* Product Details */}
                      <Col md={6} sm={12}>
                        <Card className="company-card shadow-lg rounded-4 p-4">
                          <Card.Body>
                            <i className="bi bi-tags"></i>
                            <h5 className="card-title mb-4">Basic Info</h5>

                            {!productDetails || productDetails.length === 0 ? (
                              <div className="text-center py-4">
                                <Spinner
                                  animation="border"
                                  variant="primary"
                                  size="sm"
                                  className="me-2"
                                />
                                <span className="fw-semibold text-muted">
                                  Loading product Details...
                                </span>
                              </div>
                            ) : (
                              <div className="d-flex flex-column gap-3">
                                <div className="field-row">
                                  <span className="label">SKU:</span>
                                  <span className="value">
                                    {product?.base_sku ?? "-"}
                                  </span>
                                </div>

                                <div className="field-row">
                                  <span className="label">Price:</span>
                                  <span className="value">
                                    {product?.price ?? 0}
                                  </span>
                                </div>

                                <div className="field-row">
                                  <span className="label">Unit:</span>
                                  <span className="value">
                                    {product?.unit ?? "-"}
                                  </span>
                                </div>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>

                      {/* Sell / Revenue Details */}
                      <Col md={6} sm={12}>
                        <Card className="company-card shadow-lg rounded-4 p-4">
                          <Card.Body>
                            <i className="bi bi-pie-chart"></i>
                            <h5 className="card-title mb-4">
                              Total Sell / Revenue
                            </h5>

                            {!productDetails || productDetails.length === 0 ? (
                              <div className="text-center py-4">
                                <Spinner
                                  animation="border"
                                  variant="primary"
                                  size="sm"
                                  className="me-2"
                                />
                                <span className="fw-semibold text-muted">
                                  Loading product sell Details...
                                </span>
                              </div>
                            ) : (
                              <div className="d-flex flex-column gap-3">
                                <div className="field-row">
                                  <span className="label">Total Unit Sell:</span>
                                  <span className="value">
                                    {product?.total_sell ?? 0}
                                  </span>
                                </div>

                                <div className="field-row">
                                  <span className="label">SubTotal:</span>
                                  <span className="value">
                                    {product?.subtotal ?? 0}
                                  </span>
                                </div>

                                <div className="field-row">
                                  <span className="label">Tax:</span>
                                  <span className="value">
                                    {product?.total_tax ?? 0}
                                  </span>
                                </div>
                                <hr></hr>
                                <div className="field-row">
                                  <span className="label">Total:</span>
                                  <span className="value">
                                    {product?.total ?? 0}
                                  </span>
                                </div>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>

                    </Row>
                  </div>

                </section>
              </div>
            </section>
            <Container sx={{ mt: 4 }}>
              <ProductSellPieChart chart={product?.sales_chart} />
            </Container>
          </div>
        </section>
      </div>
    </section>

  )
}

export default ProductSellDetails