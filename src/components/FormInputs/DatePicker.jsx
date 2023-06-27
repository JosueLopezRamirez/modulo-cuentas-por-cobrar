import React from "react";
import { FormFeedback, FormGroup, Label } from "reactstrap";
import Flatpickr from "react-flatpickr";

export const FormDatePicker = (props) => {
  const { className, validation, name, label, placeholder } = props;

  return (
    <FormGroup className={className}>
      <Label>{label}</Label>
      <Flatpickr
        id="validationCustom02"
        className={"form-control"}
        placeholder={placeholder}
        readOnly={true}
        options={{
          // altInput: true,
          altFormat: "F j, Y",
          dateFormat: "d-m-Y",
          minDate: "today",
        }}
        onChange={(value) => {
          validation.setFieldValue(name, value[0]);
        }}
        onBlur={validation.handleBlur}
        value={validation.values[name] || ""}
      />
      {!validation.values[name] && validation.errors[name] ? (
        <FormFeedback
          type="invalid"
          className={validation.errors[name] ? "d-block" : "d-none"}
        >
          {validation.errors[name]}
        </FormFeedback>
      ) : null}
    </FormGroup>
  );
};
