import React from "react";
import * as dayjs from "dayjs";

import { Row, Col, Card, CardBody } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { CustomTable } from "../../components/Table";
import { useParams } from "react-router-dom";

const ComprobantesHistorial = () => {
  const { id } = useParams();
  //meta title
  document.title = "Historial Comprobantes";

  const formatData = (data = []) => {
    return data.map((item) => ({
      id: item.id,
      nombre: item.comprobanteDiario.nombre,
      usuario: item.usuario.nombre,
      fecha: dayjs(item.createdAt).format("DD-MM-YYYY hh:mm:ss A"),
    }));
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Comprobantes" breadcrumbItem="Historial" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="table-responsive">
                    <CustomTable
                      endpoint={`/historial-comprobante-diario/${id}`}
                      formatData={formatData}
                      columns={[
                        {
                          name: "Comprobante",
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

export default ComprobantesHistorial;
