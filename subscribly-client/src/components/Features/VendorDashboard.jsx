import React, { useEffect, useState } from "react";

import { Row, Col, Card } from 'react-bootstrap';
import axiosAuth from "../../api/axiosAuth";
import messageHandler from "../../util/messageHandler";

const VendorDashboard = () => {
    const [details,setDetails]=useState('');
   
    useEffect(()=>{
        const fetchDetails =async ()=>{
            try {
                const response = await axiosAuth('/dashboard-details')
                setDetails(response.data.details)
            } catch (error) {
               messageHandler('Something went wrong: ' + error, 'error');
            }
        };
      fetchDetails ();
    },[])
   
    return (
        <>


            {/* Main Dashboard Content */}
            <section className="py-5">
                <div className="container">
                    <h1>Dashboard</h1>
                    <p>Welcome to your vendor dashboard!</p>
                </div>

                <div className="row">
                    <Row className="g-4"> {/* Adds gutter spacing between columns */}
                        <Col md={4} sm={6} >
                            <Card className="shadow-sm h-100">
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
                            <Card className="shadow-sm h-100">
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
                            <Card className="shadow-sm h-100">
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
            </section>
        </>
    );
};

export default VendorDashboard;
