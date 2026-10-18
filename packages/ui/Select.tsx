import type { SelectHTMLAttributes } from "react";
import { Icon } from "./Icon";

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="hh-select-field">
      <select {...props} />
      <Icon name="down" />
    </span>
  );
}
