import cn from "classnames";
import { useId } from "react";

interface SelectProps extends React.ComponentProps<"select"> {
  label?: string;
  labelClassName?: string;
}

export function Select(props: SelectProps) {
  const { label, labelClassName, ...selectProps } = props;

  const generatedId = useId();
  const selectId = label
    ? `${label.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase()}-${generatedId}`
    : "";

  return (
    <div>
      {label ? (
        <>
          <label
            htmlFor={selectId}
            className={cn("block text-xs font-medium text-gray-700", labelClassName)}
          >
            {label}
          </label>
          <BaseSelect {...selectProps} id={selectId} />
        </>
      ) : (
        <BaseSelect {...selectProps} />
      )}
    </div>
  );
}

function BaseSelect(props: React.ComponentProps<"select">) {
  return (
    <select
      {...props}
      className={cn(
        "mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm",
        props.className
      )}
    >
      {props.children}
    </select>
  );
}
