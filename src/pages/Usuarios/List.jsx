import React from "react";

import { Row, Col, Card, CardBody } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { CustomTable } from "../../components/Table";

const List = () => {
  //meta title
  document.title = "Usuarios";

  const formatData = (data = []) => {
    return data.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      email: item.correo,
      rol: item.rol.nombre,
    }));
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Usuarios" breadcrumbItem="Lista" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="table-responsive">
                    <CustomTable
                      endpoint="/usuario"
                      formatData={formatData}
                      redirectUrl="/users"
                      columns={[
                        {
                          name: "Nombre",
                          field: "nombre",
                        },
                        {
                          name: "Correo",
                          field: "email",
                        },
                        {
                          name: "Rol",
                          field: "rol",
                        },
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

export default List;
