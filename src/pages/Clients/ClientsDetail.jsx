import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
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

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { FormInput } from "../../components/FormInputs/Input";
import { useMount } from "react-use";
import { useHistory, useParams } from "react-router-dom";
import { get, patch, post } from "../../helpers/axiosClient";
import useStore from "../../helpers/store";
import { toast } from "react-toastify";

const telefonoRegex = /^(\+505)?(\d{8}|2\d{7})$/;
const rucRegex = /^(\d{3}-\d{9}|\d{3}-\d{6}-\d{4})$/;

const NewClient = () => {
  const { id } = useParams();
  const history = useHistory();
  const [isEdit, setIsEdit] = useState(false);
  const { getEmpresas } = useStore();

  useMount(async () => {
    if (!id) return;
    setIsEdit(true);
    const data = await get(`/empresas/${id}`);
    validation.setFieldValue("nombre", data.nombre);
    validation.setFieldValue("descripcion", data.descripcion);
    validation.setFieldValue("ruc", data.ruc);
    validation.setFieldValue("telefono", data.telefono);
  }, [id]);

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      nombre: "",
      descripcion: "",
      telefono: "",
      ruc: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("Por favor ingresa el nombre del cliente"),
      descripcion: Yup.string().required("Por favor ingresa una descripcion"),
      telefono: Yup.string()
        .matches(telefonoRegex, "Número de teléfono inválido")
        .required("Por favor ingresa un numero de telefono valido"),
      ruc: Yup.string()
        .matches(
          rucRegex,
          "Debe seguir uno de los siguientes formato ###-######### o ###-######-####"
        )
        .required("Por favor ingresa un numero ruc valido"),
    }),
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await patch(`/empresas/${id}`, values);
          await getEmpresas();
          toast.success("Cliente actualizado correctamente");
          setTimeout(() => {
            history.push(`/clients`);
          }, 800);
        } else {
          const { id } = await post(`/empresas`, values);
          await getEmpresas();
          toast.success("Cliente creado correctamente");
          setTimeout(() => {
            history.push(`/clients/${id}`);
          }, 800);
        }
      } catch (error) {
        console.log(error);
        toast.success("Error al registrar o actualizar cliente");
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title="Clients" breadcrumbItem="New" />
        <Container fluid={true}>
          <Row>
            <Col xl="6">
              <Card>
                <CardBody>
                  <h4 className="card-title">Cliente</h4>
                  <p className="card-title-desc">Agregar un nuevo cliente.</p>
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
                        <FormInput
                          id="validationRuc"
                          className="mb-3"
                          name="ruc"
                          label="Numero Ruc"
                          placeholder="Ej: 152-589632-1477"
                          validation={validation}
                        />
                      </Col>
                      <Col md="4">
                        <FormInput
                          id="validationTelefono"
                          className="mb-3"
                          name="telefono"
                          label="Numero Telefonico"
                          placeholder="Ej: +50522252635"
                          validation={validation}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <FormInput
                          id="validationDesc"
                          className="mb-3"
                          type="textarea"
                          name="descripcion"
                          label="Descripcion"
                          placeholder=""
                          validation={validation}
                        />
                      </Col>
                    </Row>
                    <Button color="primary" type="submit">
                      Guardar
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default NewClient;
