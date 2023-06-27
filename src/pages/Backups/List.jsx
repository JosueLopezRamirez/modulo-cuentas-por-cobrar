import React, { useRef } from "react";
import * as dayjs from "dayjs";

import { Row, Col, Card, CardBody } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { CustomTable } from "../../components/Table";
import { get } from "../../helpers/axiosClient";

const List = () => {
  //meta title
  document.title = "Backups";
  const ref = useRef();

  const formatData = (data = []) => {
    return data.map((item) => ({
      id: item.id,
      nombre: item.name,
      url: item.url,
      fecha: dayjs(item.createdAt).format("DD-MM-YYYY"),
    }));
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Respaldo" breadcrumbItem="Lista" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="table-responsive">
                    <div style={{ marginBottom: 5 }}>
                      <button
                        type="button"
                        className="btn btn-primary  btn-label"
                        onClick={async () => {
                          try {
                            await get("/shared/db-backup");
                            return ref.current?.refresh();
                          } catch (error) {}
                        }}
                      >
                        <i className="bx bx-plus label-icon"></i> Nuevo Backup
                      </button>
                    </div>
                    <CustomTable
                      ref={ref}
                      endpoint="/backups"
                      formatData={formatData}
                      toolbarOptions={{
                        restore: true,
                      }}
                      showSearch={false}
                      columns={[
                        {
                          name: "Nombre",
                          field: "nombre",
                        },
                        {
                          name: "Url",
                          field: "url",
                          type: "link",
                        },
                        {
                          name: "Fecha de creacion",
                          field: "fecha",
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
