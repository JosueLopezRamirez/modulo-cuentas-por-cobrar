import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import Select from "react-select";
import { useMount } from "react-use";
import { v4 } from "uuid";
import { Toggle } from "rsuite";
import { toast } from "react-toastify";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { get, post } from "../../helpers/axiosClient";
import useStore from "../../helpers/store";

const List = () => {
  document.title = "Features";

  const { featureFlags } = useStore();

  const [selectedValue, setSelectedValue] = useState();
  const [featuresKey, setFeaturesKey] = useState(v4());
  const [featuresByUser, setFeaturesByUser] = useState([]);
  const [options, setOptions] = useState([]);

  useMount(async () => {
    const { data } = await get("/usuario");
    setOptions(data.map((item) => ({ label: item.nombre, value: item.id })));
  });

  useEffect(() => {
    if (!selectedValue) return;
    getFeaturesFlagsByUser(selectedValue.value);
  }, [selectedValue]);

  const getFeaturesFlagsByUser = async (usuarioId) => {
    try {
      const data = await get(`/feature-flag-user/${usuarioId}`);
      setFeaturesByUser(data.map((item) => item.featureFlagId));
    } catch (err) {}
  };

  const handleChange = (checked, item) => {
    if (checked) {
      setFeaturesByUser((prev) => [...prev, item.id]);
    } else {
      const features = featuresByUser.filter((feature) => feature !== item.id);
      setFeaturesByUser([...features]);
    }
  };

  const toggles = useMemo(() => {
    return featureFlags.map((item) => {
      const checked = featuresByUser.includes(item.id);
      return (
        <Col md="3">
          <Toggle
            checked={checked}
            onChange={(checked, event) => handleChange(checked, item)}
            // onChange={(checked, event) => console.log({ checked })}
            unCheckedChildren={item.name}
            checkedChildren={item.name}
          />
        </Col>
      );
    });
  }, [featureFlags, featuresByUser]);

  const onSave = async () => {
    try {
      await post("/feature-flag-user/bulk", {
        usuarioId: selectedValue?.value,
        featureFlagIds: featuresByUser,
      });
      toast.success("Guardado correctamente");
    } catch (error) {
      toast.error("Error al guardar");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Permisos" breadcrumbItem="Lista" />
          <Row>
            <Col lg={4}>
              <Card>
                <CardBody>
                  <Row>
                    <Col md="9">
                      <Select
                        placeholder="Seleccionar usuario"
                        options={options}
                        getOptionValue={(option) => option?.value}
                        getOptionLabel={(option) => option?.label}
                        value={selectedValue}
                        onChange={(value) => {
                          setSelectedValue(value);
                          setFeaturesKey(v4());
                        }}
                      />
                    </Col>
                    <Col md="3">
                      <button className="btn btn-primary" onClick={onSave}>
                        <i className="bx bx-save font-size-16 align-middle me-2"></i>
                        Guardar
                      </button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Row>{toggles}</Row>
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
