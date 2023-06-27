import React, { useEffect, useRef, useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Button,
  Label,
  Input,
  Container,
  FormFeedback,
  Form,
} from "reactstrap";
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";
import { toast } from "react-toastify";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { AgGrid } from "../../components/AgGrid";
import { FormSelect } from "../../components/FormInputs/Select";
import { useHistory, useParams } from "react-router-dom";
import { useMount } from "react-use";
import { get, patch, post } from "../../helpers/axiosClient";
import useStore from "../../helpers/store";
import { FormInput } from "../../components/FormInputs/Input";
import { FormDatePicker } from "../../components/FormInputs/DatePicker";

const FacturaDetalle = () => {
  const { id } = useParams();
  const history = useHistory();
  const ref = useRef();
  const { empresas, token } = useStore();
  const [gridData, setGridData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  useMount(async () => {
    if (!id) return;
    setIsEdit(true);
    const data = await get(`/facturas/${id}`);
    validation.setFieldValue("nombre", data.nombre);
    validation.setFieldValue("fecha", data.fecha);

    const empresa = empresas.find(
      (empresa) => empresa.id === data.estatico.documento.empresaId
    );

    validation.setFieldValue("empresa", {
      label: empresa.nombre,
      value: empresa.id,
    });
    setGridData(data.facturasItems);
  }, [id]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      nombre: "",
      fecha: "",
      empresa: {
        label: "",
        value: "",
      },
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("Por favor ingresar un nombre"),
      fecha: Yup.string().required("Por favor ingresar una fecha"),
      empresa: Yup.object({
        label: Yup.string().required(),
        value: Yup.string().required(),
      }).required("Por selecciona una empresa"),
    }),
    onSubmit: async (values) => {
      try {
        const empresaId = values.empresa.value;
        delete values.empresa;
        const payload = {
          ...values,
          empresaId,
        };
        const rows = ref.current.getRows(["ventas", "montoTotal", "iva"]);
        if (isEdit) {
          await patch(
            `/facturas/${id}`,
            {
              factura: payload,
              facturaItems: rows,
            },
            {
              headers: {
                Authorization: token,
              },
            }
          );
          toast.success("Factura editada correctamente");
          setTimeout(() => {
            history.push("/bills");
          }, [800]);
        } else {
          const { id } = await post(
            `/facturas`,
            {
              factura: payload,
              facturaItems: rows,
            },
            {
              headers: {
                Authorization: token,
              },
            }
          );
          toast.success("Factura creada correctamente");
          setTimeout(() => {
            history.push(`/bills/${id}`);
          }, [800]);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error al agregar o actualizar factura.");
      }
    },
  });

  const columns = [
    {
      field: "numeroFactura",
      headerName: "Numero Factura",
      editable: true,
    },
    {
      field: "descripcion",
      headerName: "Descripcion",
      editable: true,
    },
    {
      field: "ventasExentas",
      headerName: "Ventas Exentas",
      editable: true,
    },
    {
      field: "ventasExoneradas",
      headerName: "Ventas Exoneradas",
      editable: true,
    },
    {
      field: "ventasGrabadas",
      headerName: "Ventas Grabadas",
      editable: true,
    },
    {
      field: "ventas",
      valueGetter: (params) => {
        const data = params.data;
        const val =
          parseFloat(data.ventasExoneradas ?? 0) +
          parseFloat(params.data.ventasExentas ?? 0) +
          parseFloat(params.data.ventasGrabadas ?? 0);
        return isNaN(val) ? 0 : val.toFixed(2);
      },
    },
    {
      field: "iva",
      headerName: "15% IVA",
      valueGetter: (params) => {
        const val = params.data.ventasGrabadas * 0.15;
        return isNaN(val) ? 0 : val.toFixed(2);
      },
    },
    {
      field: "montoTotal",
      valueGetter: (params) => {
        const data = params.data;
        const val =
          parseFloat(data.ventasExoneradas ?? 0) +
          parseFloat(data.ventasExentas ?? 0) +
          parseFloat(data.ventasGrabadas ?? 0) +
          parseFloat(data.ventasGrabadas * 0.15 ?? 0);
        return isNaN(val) ? 0 : val.toFixed(2);
      },
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title="Facturas" breadcrumbItem="Nuevo" />
        <Container fluid={true}>
          <Row>
            <Col xl="6">
              <Card>
                <CardBody>
                  <Form
                    className="needs-validation"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    <Row>
                      <Col md="4">
                        <FormSelect
                          placeholder="Seleccionar un cliente"
                          name="empresa"
                          options={empresas.map((item) => ({
                            value: item.id,
                            label: item.nombre,
                          }))}
                          label="Cliente"
                          validation={validation}
                        />
                      </Col>
                      <Col md="4">
                        <FormInput
                          id="validationName"
                          className="mb-3"
                          name="nombre"
                          label="Nombre"
                          placeholder="Ingrese su nombre"
                          validation={validation}
                        />
                      </Col>
                      <Col md="4">
                        <FormDatePicker
                          id="validationName"
                          className="mb-3"
                          name="fecha"
                          label="Fecha"
                          placeholder="Seleccione una fecha"
                          validation={validation}
                        />
                      </Col>
                    </Row>
                    <Button color="primary" type="submit">
                      Guardar todo
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <Container fluid={true}>
          <Row>
            <Col xl="12">
              <Card>
                <CardBody>
                  <h4 className="card-title">Detalle</h4>
                  <AgGrid
                    ref={ref}
                    height={480}
                    data={gridData}
                    columns={columns}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default FacturaDetalle;
