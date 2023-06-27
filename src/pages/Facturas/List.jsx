import React from "react";
import * as dayjs from "dayjs";

import { Row, Col, Card, CardBody } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { CustomTable } from "../../components/Table";

const List = () => {
  //meta title
  document.title = "Facturas";

  const formatData = (data = []) => {
    return data.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      fecha: dayjs(item.fecha).format("DD-MM-YYYY"),
      empresa: item.estatico.documento.empresa.nombre,
    }));
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Facturas" breadcrumbItem="Lista" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="table-responsive">
                    <CustomTable
                      endpoint="/facturas"
                      formatData={formatData}
                      redirectUrl="/bills"
                      toolbarOptions={{
                        report: true,
                      }}
                      columns={[
                        {
                          name: "Nombre",
                          field: "nombre",
                        },
                        {
                          name: "Fecha",
                          field: "fecha",
                        },
                        {
                          name: "Empresa",
                          field: "empresa",
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
