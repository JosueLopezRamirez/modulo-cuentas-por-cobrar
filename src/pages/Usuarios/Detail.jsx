import React, { useEffect, useMemo, useRef, useState } from "react";
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

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useHistory, useParams } from "react-router-dom";
import { useMount } from "react-use";
import { get, patch, post } from "../../helpers/axiosClient";
import { FormInput } from "../../components/FormInputs/Input";
import { FormSelect } from "../../components/FormInputs/Select";
import useStore from "../../helpers/store";
import { toast } from "react-toastify";

const UsuarioDetalle = () => {
  const history = useHistory();
  const { id } = useParams();
  const { roles } = useStore();
  const [isEdit, setIsEdit] = useState();

  useMount(async () => {
    if (!id) return;
    setIsEdit(true);
    const data = await get(`/usuario/${id}`);
    validation.setFieldValue("nombre", data.nombre);
    validation.setFieldValue("correo", data.correo);

    const rol = roles.find((rol) => rol.id === data.rolId);
    validation.setFieldValue("rol", { label: rol.nombre, value: rol.id });
  }, [id]);

  const options = useMemo(() => {
    return (roles || []).map((item) => ({
      value: item.id,
      label: item.nombre,
    }))
  }, [roles])

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      nombre: "",
      correo: "",
      rol: {
        label: "",
        value: "",
      },
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required(
        "Por favor ingresar un nombre al comprobante"
      ),
      correo: Yup.string()
        .email()
        .required("Por favor ingresar una correo valido"),
      rol: Yup.object({
        label: Yup.string().required("Por favor seleccione un rol"),
        value: Yup.string().required("Por favor seleccione un rol"),
      }).required(),
    }),
    onSubmit: async (values) => {
      const rolId = values.rol.value;
      const data = { ...values };

      delete data.rol;
      try {
        if (isEdit) {
          await patch(`/usuario/${id}`, { ...data, rolId });
          toast.success("Usuario actualizado correctamente");
        } else {
          await post("/usuario", { ...data, rolId });
          toast.success("Usuario registrado correctamente");
        }
        setTimeout(() => {
          history.push("/users");
        }, 1500);
      } catch (error) {
        console.log(error);
        toast.error("Error al registrar o actualizar usuario");
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title="Usuario" breadcrumbItem="Nuevo" />
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
                          id="validationEmail"
                          className="mb-3"
                          name="correo"
                          label="Correo"
                          placeholder="Escriba su correo"
                          validation={validation}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col
                        md="4"
                        style={{
                          display: isEdit ? "none" : "block",
                        }}
                      >
                        <FormInput
                          id="validationPassword"
                          className="mb-3"
                          name="password"
                          label="Contraseña"
                          placeholder="Ingrese su contraseña"
                          validation={validation}
                        />
                      </Col>
                      <Col md="4">
                        <FormSelect
                          id="roles-select"
                          name="rol"
                          options={options}
                          label="Rol"
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
      </div>
    </React.Fragment>
  );
};

export default UsuarioDetalle;
