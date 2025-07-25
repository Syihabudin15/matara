"use client";
import { FormInput } from "@/components/utils/FormUtils";
import { FormOutlined, PlusCircleFilled, SaveFilled } from "@ant-design/icons";
import { Area } from "@prisma/client";
import { Button, Input, Modal, Table, TableProps } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export const AreaTable = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState<string>();
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<Area[]>([]);

  const getData = async () => {
    setLoading(true);
    await fetch(
      `/api/area?page=${page}&pageSize=${pageSize}${
        search ? "&search=" + search : ""
      }`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res.data.map((d: Area, i: any) => ({ ...d, key: i })));
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

  const columns: TableProps<Area>["columns"] = [
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
      title: "NAMA AREA",
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
      title: "KODE AREA",
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
      title: "ALAMAT",
      dataIndex: "address",
      key: "address",
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
        return <>{record.address}</>;
      },
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
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
        return <>{record.email}</>;
      },
    },
    {
      title: "NO TELEPON",
      dataIndex: "phone",
      key: "phone",
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
        return <>{record.phone}</>;
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
            <ModalUpdateArea record={record} getData={getData} />
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
            <h1 className="font-bold text-xl">Area Management</h1>
          </div>
          <div className="flex my-2 gap-2 justify-between">
            <div>
              <ModalAddArea getData={getData} />
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

export const ModalUpdateArea = ({
  record,
  getData,
}: {
  record: Area;
  getData: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Area>(record);

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/area", {
      method: "PUT",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ ...data }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.status !== 200) {
          alert("ERROR");
        }
        setLoading(false);
        setOpen(false);
        await getData();
      });
    setLoading(false);
  };

  return (
    <div>
      <button
        className="bg-green-500 py-1 px-2 text-gray-50 rounded shadow cursor-pointer hover:bg-red-green"
        onClick={() => setOpen(true)}
      >
        <FormOutlined />
      </button>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title={`Update Area ${record.name}`}
        loading={loading}
        footer={[
          <Button
            key={"submit"}
            type="primary"
            loading={loading}
            onClick={() => handleSubmit()}
          >
            SIMPAN
          </Button>,
        ]}
      >
        <div className="my-5">
          <FormInput
            label="Nama Area"
            placeholder="West Java"
            required={true}
            mode="horizontal"
            type="string"
            defaultValue={data.name}
            onChange={(e: string) => setData((prev) => ({ ...prev, name: e }))}
          />
          <FormInput
            label="Kode Area"
            placeholder="WJ"
            mode="horizontal"
            type="string"
            defaultValue={data.code}
            onChange={(e: string) => setData((prev) => ({ ...prev, code: e }))}
          />
          <FormInput
            label="Alamat"
            placeholder="Jl.xxxx"
            mode="horizontal"
            type="string"
            defaultValue={data.address}
            onChange={(e: string) =>
              setData((prev) => ({ ...prev, address: e }))
            }
          />
          <FormInput
            label="Phone"
            placeholder="08xxxx"
            mode="horizontal"
            type="string"
            defaultValue={data.phone}
            onChange={(e: string) => setData((prev) => ({ ...prev, phone: e }))}
          />
          <FormInput
            label="Email"
            placeholder="example@gmail.com"
            mode="horizontal"
            type="string"
            defaultValue={data.email}
            onChange={(e: string) => setData((prev) => ({ ...prev, email: e }))}
          />
        </div>
      </Modal>
    </div>
  );
};

export const ModalAddArea = ({ getData }: { getData: Function }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Area>({
    id: "",
    name: "",
    code: "",
    address: "",
    email: "",
    phone: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/area", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ ...data }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.status !== 201) {
          alert("ERROR");
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
        icon={<PlusCircleFilled />}
        onClick={() => setOpen(true)}
      >
        Add
      </Button>
      <Modal
        open={open}
        loading={loading}
        onCancel={() => setOpen(false)}
        title={`Tambah Area`}
        footer={[
          <Button
            key={"AddArea"}
            type="primary"
            onClick={() => handleSubmit()}
            loading={loading}
          >
            Tambah
          </Button>,
        ]}
      >
        <div className="my-8">
          <FormInput
            label="Nama Area"
            placeholder="West Java"
            required={true}
            mode="horizontal"
            type="string"
            defaultValue={data.name}
            onChange={(e: string) => setData((prev) => ({ ...prev, name: e }))}
          />
          <FormInput
            label="Kode Area"
            placeholder="WJ"
            mode="horizontal"
            type="string"
            defaultValue={data.code}
            onChange={(e: string) => setData((prev) => ({ ...prev, code: e }))}
          />
          <FormInput
            label="Alamat"
            placeholder="Jl.xxxx"
            mode="horizontal"
            type="string"
            defaultValue={data.address}
            onChange={(e: string) =>
              setData((prev) => ({ ...prev, address: e }))
            }
          />
          <FormInput
            label="Phone"
            placeholder="08xxxx"
            mode="horizontal"
            type="string"
            defaultValue={data.phone}
            onChange={(e: string) => setData((prev) => ({ ...prev, phone: e }))}
          />
          <FormInput
            label="Email"
            placeholder="example@gmail.com"
            mode="horizontal"
            type="string"
            defaultValue={data.email}
            onChange={(e: string) => setData((prev) => ({ ...prev, email: e }))}
          />
        </div>
      </Modal>
    </div>
  );
};
export const ModalAddOrUpdateArea = ({
  mode,
  record,
  getData,
}: {
  mode: "Add" | "Update";
  record?: Area;
  getData: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Area>(record || defaultArea);

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/area", {
      method: mode === "Add" ? "POST" : "PUT",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ ...data }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.status === 400 || res.status === 500 || res.status === 404) {
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
        title={`${mode} Area`}
        footer={[
          <Button
            key={"AddArea"}
            type="primary"
            onClick={() => handleSubmit()}
            loading={loading}
            icon={<SaveFilled />}
          >
            Simpan
          </Button>,
        ]}
      >
        <div className="my-8">
          <FormInput
            label="Nama Area"
            placeholder="West Java"
            required={true}
            mode="horizontal"
            type="string"
            defaultValue={data.name}
            onChange={(e: string) => setData((prev) => ({ ...prev, name: e }))}
          />
          <FormInput
            label="Kode Area"
            placeholder="WJ"
            mode="horizontal"
            type="string"
            defaultValue={data.code}
            onChange={(e: string) => setData((prev) => ({ ...prev, code: e }))}
          />
          <FormInput
            label="Alamat"
            placeholder="Jl.xxxx"
            mode="horizontal"
            type="string"
            defaultValue={data.address}
            onChange={(e: string) =>
              setData((prev) => ({ ...prev, address: e }))
            }
          />
          <FormInput
            label="Phone"
            placeholder="08xxxx"
            mode="horizontal"
            type="string"
            defaultValue={data.phone}
            onChange={(e: string) => setData((prev) => ({ ...prev, phone: e }))}
          />
          <FormInput
            label="Email"
            placeholder="example@gmail.com"
            mode="horizontal"
            type="string"
            defaultValue={data.email}
            onChange={(e: string) => setData((prev) => ({ ...prev, email: e }))}
          />
        </div>
      </Modal>
    </div>
  );
};

const defaultArea: Area = {
  id: "",
  name: "",
  code: "",
  address: "",
  email: "",
  phone: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};
