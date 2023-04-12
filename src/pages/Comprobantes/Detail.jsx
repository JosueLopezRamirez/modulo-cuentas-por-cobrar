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
import Flatpickr from "react-flatpickr";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { AgGrid } from "../../components/AgGrid";
import { useHistory, useParams } from "react-router-dom";
import { useMount } from "react-use";
import { get, patch, post } from "../../helpers/axiosClient";
import useStore from "../../helpers/store";
import { FormDatePicker } from "../../components/FormInputs/DatePicker";
import { FormSelect } from "../../components/FormInputs/Select";
import { FormInput } from "../../components/FormInputs/Input";

const ComprobanteDetalle = () => {
    const { id } = useParams();
    const history = useHistory();
    const ref = useRef();
    const { empresas, token } = useStore();
    const [gridData, setGridData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);

    useMount(async () => {
        if (!id) return;
        setIsEdit(true);
        const data = await get(`/comprobante-diario/${id}`);
        validation.setFieldValue("nombre", data.nombre);
        validation.setFieldValue("fecha", data.fecha);

        const empresa = empresas?.find(
            (empresa) => empresa.id === data.estatico.documento.empresaId
        );

        validation.setFieldValue("empresa", {
            label: empresa.nombre,
            value: empresa.id,
        });

        setGridData(data.comprobanteDiarioItem);
    }, [id]);

    // Form validation
    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
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
            nombre: Yup.string().required(
                "Por favor ingresar un nombre al comprobante"
            ),
            fecha: Yup.string().required(
                "Por favor ingresar una fecha al comprobante"
            ),
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
                const rows = ref.current.getRows(["haber"]);
                if (isEdit) {
                    await patch(
                        `/comprobante-diario/${id}`,
                        {
                            comprobante: payload,
                            comprobanteItems: rows,
                        },
                        {
                            headers: {
                                Authorization: token,
                            },
                        }
                    );
                    history.push("/journal-vouchers");
                } else {
                    const { id } = await post(
                        `/comprobante-diario`,
                        {
                            comprobante: payload,
                            comprobanteItems: rows,
                        },
                        {
                            headers: {
                                Authorization: token,
                            },
                        }
                    );
                    history.push(`/journal-vouchers/${id}`);
                }
            } catch (error) {
                console.log(error);
            }
        },
    });

    const columns = [
        {
            field: "numeroCuenta",
            headerName: "Numero Cuenta",
            editable: true,
        },
        {
            field: "descripcion",
            headerName: "Descripcion",
            editable: true,
        },
        {
            field: "parcial",
            headerName: "Parcial",
            editable: true,
        },
        {
            field: "debito",
            headerName: "Debe",
            editable: true,
        },
        {
            field: "haber",
            headerName: "Haber",
            valueGetter: (params) => params.data.debito - params.data.parcial,
        },
    ];

    return (
        <React.Fragment>
            <div className="page-content">
                <Breadcrumbs title="Comprobantes" breadcrumbItem="Nuevo" />
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
                                                    name="empresa"
                                                    options={empresas?.map(
                                                        (item) => ({
                                                            value: item.id,
                                                            label: item.nombre,
                                                        })
                                                    )}
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
                                                    id="validationFecha"
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
                                        height={500}
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

export default ComprobanteDetalle;
