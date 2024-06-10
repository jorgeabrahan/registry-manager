import React from "react";
import { Typography } from "./Typography";
import { TypographyVariants } from "@/lib/enums";

export const DateField: React.FC<DateFieldProps> = ({
  children,
  slug = "",
  isFullWidth = true,
  isRequired = true,
  isDisabled = false,
  value = "",
  min = "",
  max = "",
  handleChange = () => {},
  handleBlur = () => {},
  formErrors = {},
}) => {
  const hasLabel = children != null;
  return (
    <div
      className={`relative ${isFullWidth ? "w-full" : "w-max"} ${isDisabled && "opacity-40"}`}
    >
      <label
        className={`${
          !hasLabel && "sr-only"
        } absolute left-4 text-dove-gray-500 transition-[font-size,top] duration-300 top-3 text-xs`}
        htmlFor={slug}
      >
        {children}
      </label>
      <input
        className={`bg-white/5 border border-solid border-tundora-800 focus:border-tundora-700 rounded-xl transition-[padding] duration-300 text-anti-flash-white w-full pb-3 px-4 ${
          hasLabel ? "pt-7" : "pt-3"
        }`}
        type="date"
        min={min}
        max={max}
        id={slug}
        name={slug}
        required={isRequired}
        spellCheck={false}
        autoComplete="off"
        disabled={isDisabled}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {formErrors[slug] != null && formErrors[slug] != "" && (
        <Typography
          className="text-wewak-500 mt-1"
          variant={TypographyVariants.small}
        >
          {formErrors[slug]}
        </Typography>
      )}
    </div>
  );
};

type DateFieldProps = {
  children?: React.ReactNode;
  slug?: string;
  isFullWidth?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  value?: string;
  min?: string;
  max?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formErrors?: {
    [key: string]: string;
  };
};
