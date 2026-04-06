import React, { useEffect, useState } from "react";
import Stack from 'react-bootstrap/Stack';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import axiosAuth from "../../api/axiosAuth";
import messageHandler from "../../util/messageHandler";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const AdminDashboard = () => {
    const [details, setDetails] = useState('');
   
    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "business_name", headerName: "Company", flex: 1 },
        { field: "name", headerName: "User Name", flex: 1 },
        { field: "plan_name", headerName: "Plan", flex: 1 },
    ];

    const rows =
        details?.users_details?.map((item, index) => ({
            id: index + 1,
            business_name: item.business_name || "No Company",
            name: item.name,
            plan_name: item.plan_name || "No Plan",
        })) || [];
        
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axiosAuth('/admin-dashboard-details')
                //console.log(response);
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
                    <p>Welcome to your Admin dashboard ! <b>{details.name}</b></p>
                </div>

                <div className="row">
                    <Row className="g-4"> {/* Adds gutter spacing between columns */}
                        <Col md={4} sm={6} >
                            <Card className="shadow-sm h-100 khakibg">
                                <i class="bi bi-ticket"></i>
                                <Card.Body>
                                    <Card.Title>Total Open Ticktes</Card.Title>
                                    <Card.Text>
                                        <b> {
                                            details.open_tickets
                                        }</b>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4} sm={6} >
                            <Card className="shadow-sm h-100 khakibg">
                                <i class="bi bi-ticket-perforated"></i>
                                <Card.Body>
                                    <Card.Title>Total  Close Ticktes</Card.Title>
                                    <Card.Text>
                                        <b> {
                                            details.close_tickets
                                        } </b>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4} sm={12} >
                            <Card className="shadow-sm h-100 khakibg">
                                <i class="bi bi-ticket-detailed-fill"></i>
                                <Card.Body>
                                    <Card.Title>Total In Progress Tickets</Card.Title>
                                    <Card.Text>
                                        <b> {
                                            details.progress_tickets
                                        }</b>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                   
                </div>
                 <div className="row py-5">
                     <Box style={{ height: 400, width: "100%" }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5, 10, 20]}
                            pagination
                        />
                    </Box>
                 </div>
            </section>


        </>
    );
};

export default AdminDashboard;
