import React from "react";
import { FormFeedback, FormGroup, Label } from "reactstrap";
import Select from "react-select";

export const FormSelect = (props) => {
    const { label, options, name, validation } = props;

    return (
        <FormGroup>
            <Label>{label}</Label>
            <Select
                classNamePrefix="react-select-lg"
                indicatorSeparator={null}
                options={options}
                // getOptionValue={(option) => option.value}
                // getOptionLabel={(option) => option.label}
                value={validation.values[name]}
                onChange={(value) => {
                    console.log({ selectValue: value });
                    validation.setFieldValue(name, value);
                }}
                className={
                    validation.touched[name] &&
                    !!validation.errors[name] &&
                    "is-invalid"
                }
            />
            {!!validation.errors[name] && (
                <FormFeedback className="d-block">
                    {validation.errors[name].label}
                </FormFeedback>
            )}
        </FormGroup>
    );
};
