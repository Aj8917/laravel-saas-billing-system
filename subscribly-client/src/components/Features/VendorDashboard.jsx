import React, { useEffect, useState } from "react";
import Stack from 'react-bootstrap/Stack';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import axiosAuth from "../../api/axiosAuth";
import messageHandler from "../../util/messageHandler";

const VendorDashboard = () => {
    const [details, setDetails] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axiosAuth('/dashboard-details')
                setDetails(response.data.details)
            } catch (error) {
                messageHandler('Something went wrong: ' + error, 'error');
            }
        };
        fetchDetails();
    }, [])

    return (
        <>


            {/* Main Dashboard Content */}
            <section className="py-5">
                <div className="container">
                    <h1>Dashboard</h1>
                    <p>Welcome to your vendor dashboard! <b>{details.name}</b></p>
                </div>

                <div className="row">
                    <Row className="g-4"> {/* Adds gutter spacing between columns */}
                        <Col md={4} sm={6} >
                            <Card className="shadow-sm h-100 khakibg">
                                <i class="bi bi-bar-chart-fill"></i>
                                <Card.Body>
                                    <Card.Title>Total Orders</Card.Title>
                                    <Card.Text>
                                        <b> # {
                                            details.orders
                                        }</b>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4} sm={6} >
                            <Card className="shadow-sm h-100 khakibg">
                                <i class="bi bi-pie-chart-fill"></i>
                                <Card.Body>
                                    <Card.Title>Total Revenue</Card.Title>
                                    <Card.Text>
                                        <b> ${
                                            details.revenue
                                        } </b>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4} sm={12} >
                            <Card className="shadow-sm h-100 khakibg">
                                <i class="bi bi-bank2"></i>
                                <Card.Body>
                                    <Card.Title>Total Tax</Card.Title>
                                    <Card.Text>
                                        <b> ${
                                            details.total_tax
                                        }</b>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                </div>
                {details?.low_stock ? (
                <div className="p-2">
                    <Stack gap={3}>
                        <div className="p-2 low-stock-header">Low Stock</div>

                        {details?.low_stock?.length > 0 ? (
                            details.low_stock.map((item, index) => (
                                <div key={index} className="p-1 low-stock">
                                    {item.product_name} – Stock: <Badge pill bg="danger">{item.stock_qty}</Badge>
                                </div>
                            ))
                        ) : (
                            <div className="p-1 text-muted">No low stock items</div>
                        )}
                    </Stack>

                </div>
                ):' '}
            </section>
        </>
    );
};

export default VendorDashboard;
