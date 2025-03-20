import * as React from "react";

import classNames from "classnames";
import { InputField } from "./FieldGroup";

import { useValidation } from "./validations/hook";
import { validatePresence } from "./validations/presence";
import { validateTextLength } from "./validations/textLength";

import { useFieldValue, useFieldError } from "./FormContext";
import { createTestId } from "@/utils/testid";

interface StyleOptions {
  fontBold?: boolean;
}

interface TitleInputProps extends StyleOptions {
  field: string;
  autoFocus?: boolean;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  testId?: string;
  readonly?: boolean;
  errorMessage?: string;
}

const DEFAULT_VALIDATION_PROPS = {
  minLength: undefined,
  maxLength: undefined,
};

export function TitleInput(props: TitleInputProps) {
  const { field, placeholder } = props;
  const { minLength, maxLength } = { ...DEFAULT_VALIDATION_PROPS, ...props };

  const [value, setValue] = useFieldValue(field);
  const error = useFieldError(field);

  useValidation(field, validatePresence(true, props.errorMessage));
  useValidation(field, validateTextLength(minLength, maxLength));

  return (
    <InputField field={field} error={error}>
      {props.readonly ? (
        <div className={styles(false, { fontBold: props.fontBold })}>{value}</div>
      ) : (
        <input
          name={field}
          autoFocus={props.autoFocus}
          placeholder={placeholder}
          data-test-id={props.testId ?? createTestId(field)}
          className={styles(!!error, { fontBold: props.fontBold })}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}
    </InputField>
  );
}

function styles(error: boolean | undefined, opts: StyleOptions) {
  return classNames(
    "bg-surface-base",
    "text-3xl",
    "border-none",
    "outline-none",
    "focus:outline-none",
    "focus:ring-0",
    "px-0 py-1",
    "w-full",
    "resize-none",
    "ring-0",
    "placeholder:text-content-subtle",
    "leading-wide",
    error ? "border-red-500" : "border-surface-outline",
    opts.fontBold ? "font-bold" : "font-semibold",
  );
}
