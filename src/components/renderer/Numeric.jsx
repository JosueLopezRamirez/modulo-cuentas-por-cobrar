/**
 * Copyright (c) King County. All rights reserved.
 * @packageDocumentation
 */

import React from "react";
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
import { NumericFormat } from "react-number-format";

const NumericCellEditor = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value);
  const refInput = useRef(null);

  useEffect(() => {
    if (!refInput.current) return;
    refInput.current.focus();
    setTimeout(() => refInput.current?.select(), 10);
  }, []);

  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        if (typeof value !== "number") {
          if (!value || !value.length) return "0";
          return value;
        }
        return value;
      },

      // Gets called once before editing starts, to give editor a chance to
      // cancel the editing before it even starts.
      isCancelBeforeStart() {
        return false;
      },

      // Gets called once when editing is finished (eg if Enter is pressed).
      // If you return true, then the result of the edit will be ignored.
      isCancelAfterEnd() {
        return false;
      },
    };
  });

  const handleOnValueChanged = (values) => {
    setValue(values.value);
  };

  return (
    <NumericFormat
      className="ag-input-field-input ag-text-field-input"
      getInputRef={refInput}
      value={value}
      onValueChange={handleOnValueChanged}
    />
  );
});

export default NumericCellEditor;
