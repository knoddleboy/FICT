import cn from "classnames";
import { useId } from "react";

interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  labelClassName?: string;
}

export function Input(props: InputProps) {
  const { label, labelClassName, ...inputProps } = props;

  const generatedId = useId();
  const inputId = label
    ? `${label.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase()}-${generatedId}`
    : "";

  return (
    <div>
      {label ? (
        <>
          <label
            htmlFor={inputId}
            className={cn("block text-xs font-medium text-gray-700", labelClassName)}
          >
            {label}
          </label>
          <BaseInput {...inputProps} id={inputId} />
        </>
      ) : (
        <BaseInput {...inputProps} />
      )}
    </div>
  );
}

function BaseInput(props: React.ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={cn("mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm", props.className)}
    />
  );
}
