import { Button, Input, Select, Upload } from "antd";
import { IFormInput, IFormUpload } from "../IInterface";
import { CloudUploadOutlined } from "@ant-design/icons";

export const FormInput = (data: IFormInput) => {
  return (
    <div
      className={`flex ${
        data.mode === "horizontal" ? "flex-row items-center" : "flex-col"
      } gap-1 my-2`}
      style={{ fontSize: 13 }}
    >
      <p className={`w-${data.wLeft || "42"} flex gap-1`}>
        <span className="text-red-500 mr-1">{data.required && "*"}</span>
        {data.label}
      </p>
      <Input
        type={data.type}
        disabled={data.disabled}
        placeholder={data.placeholder || ""}
        value={data.defaultValue}
        onChange={(e) => data.onChange(e.target.value)}
        size={data.size || "middle"}
        suffix={data.suffix}
        prefix={data.prefix}
        style={{ color: "#444" }}
      />
    </div>
  );
};

export const FormUpload = (data: IFormUpload) => {
  return (
    <div
      className={`flex flex-row items-center gap-1 my-2 justify-between`}
      style={{ fontSize: 13 }}
    >
      <p className="w-42">
        <span className="text-red-500 mr-1"> {"  "}</span>
        {data.label}
      </p>
      <Upload>
        <Button type="primary">
          <CloudUploadOutlined />
        </Button>
      </Upload>
    </div>
  );
};

export const FormOption = (data: IFormInput) => {
  return (
    <div
      className={`flex ${
        data.mode === "horizontal" ? "flex-row items-center" : "flex-col"
      } gap-1 my-2`}
      style={{ fontSize: 13 }}
    >
      <p className="w-42">
        <span className="text-red-500 mr-1">{data.required ? "*" : "  "}</span>
        {data.label}
      </p>
      <div className="w-full">
        <Select
          style={{ width: "100%" }}
          options={data.options}
          placeholder={data.placeholder || ""}
          value={data.defaultValue}
          onChange={(e) => data.onChange(e)}
          size={data.size || "middle"}
          allowClear
        />
      </div>
    </div>
  );
};

export const FormBiaya = (data: IFormInput) => {
  return (
    <div
      className={`flex flex-row items-center gap-1 border-b border-gray-200 py-1`}
      style={{ fontSize: 13 }}
    >
      <p className={`w-72 flex gap-1`}>
        <span className="text-red-500 mr-1">{data.required && "*"}</span>
        {data.label}
      </p>
      <div className="w-full flex gap-4">
        {data.twoSide && (
          <Input
            type={"number"}
            // disabled={data.disabled}
            // placeholder={data.placeholder || ""}
            value={data.twoSidevalue}
            onChange={(e) =>
              data.twoSideOnChange && data.twoSideOnChange(e.target.value)
            }
            size={data.size || "middle"}
          />
        )}
        <Input
          type={data.type}
          disabled={data.disabled}
          placeholder={data.placeholder || ""}
          value={data.defaultValue}
          onChange={(e) => data.onChange(e.target.value)}
          size={data.size || "middle"}
          suffix={data.suffix}
          prefix={data.prefix}
          style={{ color: "#444" }}
        />
      </div>
    </div>
  );
};

export const ItemModalSimulation = ({
  label,
  leftValue,
  rightValue,
}: {
  label: string;
  leftValue?: any;
  rightValue: any;
}) => {
  return (
    <div className="flex sm:gap-2 items-center border-b border-gray-200">
      <p className="w-50 sm:w-72">{label}</p>
      <p className="hidden sm:block sm:w-10">:</p>
      <div className="flex gap-1 items-center text-right w-full">
        {leftValue && <p className="flex-1">{leftValue}</p>}
        <p className="flex-1">{rightValue}</p>
      </div>
    </div>
  );
};
