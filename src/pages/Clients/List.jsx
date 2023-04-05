import React from "react";

import { Row, Col, Card, CardBody } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { CustomTable } from "../../components/Table";

const ClientsList = () => {
    //meta title
    document.title = "Basic Tables ";

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Clients" breadcrumbItem="List" />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <div className="table-responsive">
                                        <CustomTable
                                            endpoint="/empresas"
                                            redirectUrl="/clients"
                                            columns={[
                                                {
                                                    name: "Nombre",
                                                    field: "nombre",
                                                },
                                                {
                                                    name: "Descripcion",
                                                    field: "descripcion",
                                                },
                                                {
                                                    name: "Ruc",
                                                    field: "ruc",
                                                },
                                                {
                                                    name: "Telefono",
                                                    field: "telefono",
                                                }
                                            ]}
                                            showActions
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ClientsList;
