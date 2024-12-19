import React from "react";

// Definição da estrutura dos tipos de validação
interface ValidationType {
  regex: RegExp;
  message: string;
}

const types: Record<string, ValidationType> = {
  email: {
    regex:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    message: "Preencha um email válido",
  },
  password: {
    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
    message:
      "A senha deve conter pelo menos um dígito, uma letra minúscula, uma letra maiúscula e 8 dos caracteres mencionados",
  },
};

// Tipagem da função useForm
interface UseFormProps {
  type: keyof typeof types | false;
}

interface UseFormResponse {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error: string | null;
  validate: () => boolean;
  onBlur: () => boolean;
}

const useForm = ({ type }: UseFormProps): UseFormResponse => {
  const [value, setValue] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);

  const validate = (valueToValidate: string) => {
    if (type === false) return true; // Se não for um tipo, valida como sempre válido
    if (valueToValidate.length === 0) {
      setError("Preencha um valor.");
      return false;
    } else if (types[type] && !types[type].regex.test(valueToValidate)) {
      setError(types[type].message);
      return false;
    } else {
      setError(null);
      return true;
    }
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    if (error) validate(target.value);
    setValue(target.value);
  };

  return {
    value,
    setValue,
    onChange,
    error,
    validate: () => validate(value),
    onBlur: () => validate(value),
  };
};

export default useForm;
