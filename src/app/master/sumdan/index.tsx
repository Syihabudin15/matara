"use client";
import { FormInput, FormOption } from "@/components/utils/FormUtils";
import { IDRFormat, IDRToNumber } from "@/components/utils/Functions";
import { FormOutlined, PlusCircleFilled, SaveFilled } from "@ant-design/icons";
import { Sumdan, SumdanType } from "@prisma/client";
import { Button, Input, Modal, Table, TableProps, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
const { Paragraph } = Typography;

export const SumdanTable = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState<string>();
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<Sumdan[]>([]);

  const getData = async () => {
    setLoading(true);
    await fetch(
      `/api/sumdan?page=${page}&pageSize=${pageSize}${
        search ? "&search=" + search : ""
      }`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res.data.map((d: Sumdan, i: any) => ({ ...d, key: i })));
        setTotal(res.total);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };

  useEffect(() => {
    let timeout: any;
    (async () => {
      timeout = setTimeout(async () => {
        await getData();
      }, 200);
    })();
    return () => clearTimeout(timeout);
  }, [search, page, pageSize]);

  const columns: TableProps<Sumdan>["columns"] = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 30,
      className: "text-xs text-center",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{(page - 1) * pageSize + (index + 1)}</>;
      },
    },
    {
      title: "NAMA SUMDAN",
      dataIndex: "name",
      key: "name",
      className: "text-xs",
      width: 150,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{record.name}</>;
      },
    },
    {
      title: "KODE SUMDAN",
      dataIndex: "code",
      key: "code",
      className: "text-xs",
      width: 100,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{record.code}</>;
      },
    },
    {
      title: "PEMBULATAN",
      dataIndex: "rounded",
      key: "rounded",
      className: "text-xs text-right",
      width: 100,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{IDRFormat(record.rounded)}</>;
      },
    },
    {
      title: "MAX ANGSURAN",
      dataIndex: "maxInstallment",
      key: "maxInstallment",
      className: "text-xs text-center",
      width: 100,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{record.maxInstallment} %</>;
      },
    },
    {
      title: "TIPE",
      dataIndex: "sumdanType",
      key: "sumdanType",
      className: "text-xs text-center",
      width: 100,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{record.sumdanType}</>;
      },
    },
    {
      title: "SK AKAD",
      dataIndex: "skAkad",
      key: "skAkad",
      className: "text-xs text-center",
      width: 150,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return (
          <>
            <Paragraph
              ellipsis={{
                rows: 1,
                expandable: "collapsible",
              }}
              style={{ fontSize: 12 }}
            >
              {record.skAkad}
            </Paragraph>
          </>
        );
      },
    },
    {
      title: "CREATED AT",
      dataIndex: "createdAt",
      key: "createdAt",
      className: "text-xs text-center",
      width: 100,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{moment(record.createdAt).format("DD/MM/YYYY")}</>;
      },
    },
    {
      title: "UPDATED AT",
      dataIndex: "updatedAt",
      key: "updatedAt",
      className: "text-xs text-center",
      width: 100,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{moment(record.updatedAt).format("DD/MM/YYYY")}</>;
      },
    },
    {
      title: "ACTION",
      dataIndex: "action",
      key: "action",
      className: "text-xs",
      width: 80,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return (
          <div className="flex gap-2 justify-center">
            <ModalAddOrUpdateSumdan
              mode="Update"
              record={record}
              getData={getData}
            />
          </div>
        );
      },
    },
  ];
  return (
    <Table
      title={() => (
        <div>
          <div className="border-b border-blue-500 p-2">
            <h1 className="font-bold text-xl">Sumber Dana</h1>
          </div>
          <div className="flex my-2 gap-2 justify-between">
            <div>
              <ModalAddOrUpdateSumdan mode="Add" getData={getData} />
            </div>
            <div className="w-42">
              <Input.Search
                size="small"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      columns={columns}
      size="small"
      bordered
      loading={loading}
      dataSource={data}
      scroll={{ x: "max-content", y: 370 }}
      pagination={{
        size: "small",
        total: total,
        pageSizeOptions: [50, 100, 500, 1000, 10000],
        defaultPageSize: pageSize,
        onChange(page, pageSize) {
          setPage(page);
          setPageSize(pageSize);
        },
      }}
    />
  );
};

export const ModalAddOrUpdateSumdan = ({
  mode,
  record,
  getData,
}: {
  mode: "Add" | "Update";
  record?: Sumdan;
  getData: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(record || defaultSumdan);

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/sumdan", {
      method: mode === "Add" ? "POST" : "PUT",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ ...data }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.status === 500 || res.status === 404 || res.status === 400) {
          return alert(res.msg);
        }
        setLoading(false);
        setOpen(false);
        await getData();
      });
    setLoading(false);
  };

  return (
    <div className="my-5">
      <Button
        size="small"
        type="primary"
        icon={mode === "Add" ? <PlusCircleFilled /> : <FormOutlined />}
        onClick={() => setOpen(true)}
      >
        {mode === "Add" && "Add"}
      </Button>
      <Modal
        open={open}
        loading={loading}
        onCancel={() => setOpen(false)}
        title={`${mode} Sumber Dana`}
        footer={[
          <Button
            key={"AddSumdan"}
            type="primary"
            onClick={() => handleSubmit()}
            loading={loading}
            icon={<SaveFilled />}
          >
            Simpan
          </Button>,
        ]}
      >
        <div className="my-2">
          <FormInput
            label="Nama Sumdan"
            placeholder="BPR"
            required={true}
            mode="horizontal"
            type="string"
            defaultValue={data.name}
            onChange={(e: string) => setData((prev) => ({ ...prev, name: e }))}
          />
          <FormInput
            label="Kode Sumdan"
            placeholder="BPR"
            required={true}
            mode="horizontal"
            type="string"
            defaultValue={data.code}
            onChange={(e: string) => setData((prev) => ({ ...prev, code: e }))}
          />
          <FormInput
            label="Pembulatan"
            placeholder="100"
            required={true}
            mode="horizontal"
            type="string"
            defaultValue={IDRFormat(data.rounded)}
            onChange={(e: any) =>
              setData((prev) => ({ ...prev, rounded: IDRToNumber(e || "0") }))
            }
          />
          <FormInput
            label="Max Angsuran"
            placeholder="90"
            required={true}
            mode="horizontal"
            type="number"
            defaultValue={data.maxInstallment}
            onChange={(e: any) =>
              setData((prev) => ({
                ...prev,
                maxInstallment: parseFloat(e || "0"),
              }))
            }
          />
          <FormInput
            label="SK Akad"
            placeholder="-"
            required={true}
            mode="horizontal"
            type="string"
            defaultValue={data.skAkad}
            onChange={(e: any) =>
              setData((prev) => ({
                ...prev,
                skAkad: e,
              }))
            }
          />
          <FormOption
            label="Tipe"
            placeholder="CHANNELLING"
            required={true}
            mode="horizontal"
            options={[
              { label: SumdanType.CHANNELLING, value: SumdanType.CHANNELLING },
              { label: SumdanType.FRONTING, value: SumdanType.FRONTING },
            ]}
            defaultValue={data.sumdanType}
            onChange={(e: any) =>
              setData((prev) => ({
                ...prev,
                sumdanType: e,
              }))
            }
          />
        </div>
      </Modal>
    </div>
  );
};

const defaultSumdan: Sumdan = {
  id: "",
  name: "",
  code: "",
  logo: "",
  maxInstallment: 0,
  rounded: 0,
  skAkad: "",

  sumdanType: SumdanType.CHANNELLING,
  status: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};
