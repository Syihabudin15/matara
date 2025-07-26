"use client";
import { FormInput } from "@/components/utils/FormUtils";
import { IDRFormat, IDRToNumber } from "@/components/utils/Functions";
import { FormOutlined, PlusCircleFilled, SaveFilled } from "@ant-design/icons";
import { Jenis } from "@prisma/client";
import { Button, Input, Modal, Table, TableProps } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export const JenisTable = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState<string>();
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<Jenis[]>([]);

  const getData = async () => {
    setLoading(true);
    await fetch(
      `/api/jenis?page=${page}&pageSize=${pageSize}${
        search ? "&search=" + search : ""
      }`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res.data.map((d: Jenis, i: any) => ({ ...d, key: i })));
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

  const columns: TableProps<Jenis>["columns"] = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 50,
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
      title: "NAMA Jenis",
      dataIndex: "name",
      key: "name",
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
        return <>{record.name}</>;
      },
    },
    {
      title: "BIAYA MUTASI",
      dataIndex: "costMutasi",
      key: "costMutasi",
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
        return <>{IDRFormat(record.costMutasi)}</>;
      },
    },
    {
      title: "BLOKIR ANGSURAN",
      dataIndex: "blokir",
      key: "blokir",
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
        return <>{record.blokir}</>;
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
            <ModalAddOrUpdateJenis
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
            <h1 className="font-bold text-xl">Jenis Pembiayaan</h1>
          </div>
          <div className="flex my-2 gap-2 justify-between">
            <div>
              <ModalAddOrUpdateJenis mode="Add" getData={getData} />
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

export const ModalAddOrUpdateJenis = ({
  mode,
  record,
  getData,
}: {
  mode: "Add" | "Update";
  record?: Jenis;
  getData: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Jenis>(record || defaultJenis);

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/jenis", {
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
    <div>
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
        title={`${mode} Jenis`}
        footer={[
          <Button
            key={"AddJenis"}
            type="primary"
            onClick={() => handleSubmit()}
            loading={loading}
            icon={<SaveFilled />}
          >
            Simpan
          </Button>,
        ]}
      >
        <div>
          <FormInput
            label="Nama Jenis"
            placeholder="SK"
            required={true}
            mode="horizontal"
            type="string"
            defaultValue={data.name}
            onChange={(e: string) => setData((prev) => ({ ...prev, name: e }))}
          />
          <FormInput
            label="Biaya Mutasi"
            placeholder="0"
            required={true}
            mode="horizontal"
            type="number"
            defaultValue={IDRFormat(data.costMutasi)}
            onChange={(e: any) =>
              setData((prev) => ({
                ...prev,
                costMutasi: IDRToNumber(e || "0"),
              }))
            }
          />
          <FormInput
            label="Blokir Angsuran"
            placeholder="0"
            required={true}
            mode="horizontal"
            type="number"
            defaultValue={data.blokir}
            onChange={(e: any) =>
              setData((prev) => ({ ...prev, blokir: parseInt(e) }))
            }
          />
        </div>
      </Modal>
    </div>
  );
};

const defaultJenis = {
  id: "",
  name: "",
  costMutasi: 0,
  blokir: 0,
  status: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};
