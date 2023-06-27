import React from "react";
import * as dayjs from "dayjs";

import { Row, Col, Card, CardBody } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { CustomTable } from "../../components/Table";
import { useParams } from "react-router-dom";

const FacturasHistorial = () => {
  const { id } = useParams();
  //meta title
  document.title = "Historial Facturas";

  const formatData = (data = []) => {
    return data.map((item) => ({
      id: item.id,
      nombre: item.factura.nombre,
      usuario: item.usuario.nombre,
      fecha: dayjs(item.createdAt).format("DD-MM-YYYY hh:mm:ss A"),
    }));
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Facturas" breadcrumbItem="Historial" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="table-responsive">
                    <CustomTable
                      endpoint={`/historial-facturas/${id}`}
                      formatData={formatData}
                      columns={[
                        {
                          name: "Factura",
                          field: "nombre",
                        },
                        {
                          name: "Usuario",
                          field: "usuario",
                        },
                        {
                          name: "Fecha de Actualizacion",
                          field: "fecha",
                        },
                      ]}
                      showActions={false}
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

export default FacturasHistorial;
