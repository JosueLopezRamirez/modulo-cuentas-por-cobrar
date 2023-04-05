import PropTypes from "prop-types";
import React from "react";

import {
    Row,
    Col,
    CardBody,
    Card,
    Alert,
    Container,
    Form,
    Input,
    FormFeedback,
    Label,
} from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { withRouter, Link, useHistory } from "react-router-dom";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// actions
import { loginUser, socialLogin } from "../../store/actions";

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo.svg";
import useStore from "../../helpers/store";

const Login = (props) => {
    const { login, getRoles } = useStore();
    //meta title
    document.title = "Login ";
    const dispatch = useDispatch();
    const history = useHistory();

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: "",
            password: "123456" || "",
        },
        validationSchema: Yup.object({
            email: Yup.string().required("Please Enter Your Email"),
            password: Yup.string().required("Please Enter Your Password"),
        }),
        onSubmit: async (values) => {
            try {
                await login(values);
                getRoles();
                console.log({ history });
                history.push("/dashboard");
            } catch (error) {}
        },
    });

    const { error } = useSelector((state) => ({
        error: state.Login.error,
    }));

    const signIn = (res, type) => {
        if (type === "google" && res) {
            const postData = {
                name: res.profileObj.name,
                email: res.profileObj.email,
                token: res.tokenObj.access_token,
                idToken: res.tokenId,
            };
            dispatch(socialLogin(postData, props.history, type));
        } else if (type === "facebook" && res) {
            const postData = {
                name: res.name,
                email: res.email,
                token: res.accessToken,
                idToken: res.tokenId,
            };
            dispatch(socialLogin(postData, props.history, type));
        }
    };

    //handleGoogleLoginResponse
    const googleResponse = (response) => {
        signIn(response, "google");
    };

    //handleTwitterLoginResponse
    // const twitterResponse = e => {}

    //handleFacebookLoginResponse
    const facebookResponse = (response) => {
        signIn(response, "facebook");
    };

    return (
        <React.Fragment>
            <div className="home-btn d-none d-sm-block">
                <Link to="/" className="text-dark">
                    <i className="fas fa-home h2" />
                </Link>
            </div>
            <div className="account-pages my-5 pt-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <Card className="overflow-hidden">
                                <div className="bg-primary bg-soft">
                                    <Row>
                                        <Col xs={7}>
                                            <div className="text-primary p-4">
                                                <h5 className="text-primary">
                                                    Bienvenido
                                                </h5>
                                            </div>
                                        </Col>
                                        <Col className="col-5 align-self-end">
                                            <img
                                                src={profile}
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <CardBody className="pt-0">
                                    <div>
                                        <Link
                                            to="/"
                                            className="auth-logo-light"
                                        >
                                            <div className="avatar-md profile-user-wid mb-4">
                                                <span className="avatar-title rounded-circle bg-light">
                                                    <img
                                                        src={logo}
                                                        alt=""
                                                        className="rounded-circle"
                                                        height="34"
                                                    />
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="p-2">
                                        <Form
                                            className="form-horizontal"
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                validation.handleSubmit();
                                                return false;
                                            }}
                                        >
                                            {/* {error ? (
                                                <Alert color="danger">
                                                    {error}
                                                </Alert>
                                            ) : null} */}

                                            <div className="mb-3">
                                                <Label className="form-label">
                                                    Email
                                                </Label>
                                                <Input
                                                    name="email"
                                                    className="form-control"
                                                    placeholder="Enter email"
                                                    type="email"
                                                    onChange={
                                                        validation.handleChange
                                                    }
                                                    onBlur={
                                                        validation.handleBlur
                                                    }
                                                    value={
                                                        validation.values
                                                            .email || ""
                                                    }
                                                    invalid={
                                                        validation.touched
                                                            .email &&
                                                        validation.errors.email
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.email &&
                                                validation.errors.email ? (
                                                    <FormFeedback type="invalid">
                                                        {
                                                            validation.errors
                                                                .email
                                                        }
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">
                                                    Password
                                                </Label>
                                                <Input
                                                    name="password"
                                                    value={
                                                        validation.values
                                                            .password || ""
                                                    }
                                                    type="password"
                                                    placeholder="Enter Password"
                                                    onChange={
                                                        validation.handleChange
                                                    }
                                                    onBlur={
                                                        validation.handleBlur
                                                    }
                                                    invalid={
                                                        validation.touched
                                                            .password &&
                                                        validation.errors
                                                            .password
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                {validation.touched.password &&
                                                validation.errors.password ? (
                                                    <FormFeedback type="invalid">
                                                        {
                                                            validation.errors
                                                                .password
                                                        }
                                                    </FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mt-3 d-grid">
                                                <button
                                                    className="btn btn-primary btn-block"
                                                    type="submit"
                                                >
                                                    Log In
                                                </button>
                                            </div>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default withRouter(Login);

Login.propTypes = {
    history: PropTypes.object,
};
