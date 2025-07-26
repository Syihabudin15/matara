"use client";
import { FormInput } from "@/components/utils/FormUtils";
import {
  CheckCircleFilled,
  DeleteFilled,
  FormOutlined,
  PlusCircleFilled,
  SaveFilled,
} from "@ant-design/icons";
import { Devices } from "@prisma/client";
import { Button, Input, Modal, Table, TableProps, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
const { Paragraph } = Typography;

export const DeviceTable = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState<string>();
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<Devices[]>([]);

  const getData = async () => {
    setLoading(true);
    await fetch(
      `/api/device?page=${page}&pageSize=${pageSize}${
        search ? "&search=" + search : ""
      }`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res.data.map((d: Devices, i: any) => ({ ...d, key: i })));
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

  const columns: TableProps<Devices>["columns"] = [
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
      title: "NAMA DEVICE",
      dataIndex: "deviceName",
      key: "deviceName",
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
        return <>{record.deviceName}</>;
      },
    },
    {
      title: "TYPE",
      dataIndex: "deviceType",
      key: "deviceType",
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
        return <>{record.deviceType}</>;
      },
    },
    {
      title: "OS",
      dataIndex: "sistem",
      key: "sistem",
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
        return <>{record.sistem}</>;
      },
    },
    {
      title: "BROWSER",
      dataIndex: "browser",
      key: "browser",
      className: "text-xs",
      width: 200,
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
              {record.browser}
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
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      className: "text-xs text-center font-bold",
      width: 30,
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
          <div>
            {record.status === "PENDING" && (
              <div className="text-gray-50 bg-orange-400 py-1 px-2 rounded italic">
                <span style={{ fontSize: 11 }}>{record.status}</span>
              </div>
            )}
            {record.status === "DELETED" && (
              <div className="text-gray-50 bg-red-400 py-1 px-2 rounded italic">
                <span style={{ fontSize: 11 }}>{record.status}</span>
              </div>
            )}
            {record.status === "APPROVED" && (
              <div className="text-gray-50 bg-green-400 py-1 px-2 rounded italic">
                <span style={{ fontSize: 11 }}>{record.status}</span>
              </div>
            )}
          </div>
        );
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
            {record.status !== "DELETED" && (
              <ModalDeleteDevice record={record} getData={getData} />
            )}
            {record.status === "PENDING" ||
              (record.status === "APPROVED" && (
                <ModalUpdateDevice record={record} getData={getData} />
              ))}
            {["DELETED", "PENDING"].includes(record.status) && (
              <ModalApproveDevice record={record} getData={getData} />
            )}
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
            <h1 className="font-bold text-xl">Devices Management</h1>
          </div>
          <div className="flex my-2 gap-2 justify-between">
            <div>
              <ModalAddDevice />
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

export const ModalDeleteDevice = ({
  record,
  getData,
}: {
  record: Devices;
  getData: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/device", {
      method: "PUT",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ ...record, status: "DELETED" }),
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
        className="bg-red-500 py-1 px-2 text-gray-50 rounded shadow cursor-pointer hover:bg-red-600"
        onClick={() => setOpen(true)}
      >
        <DeleteFilled />
      </button>
      <Modal
        open={open}
        title={`Hapus Device ${record.deviceId}`}
        loading={loading}
        footer={[
          <Button
            key={"submit"}
            type="primary"
            loading={loading}
            onClick={() => handleSubmit()}
          >
            YA
          </Button>,
        ]}
      >
        <p>Lanjutkan untuk menghapus device ini?</p>
        <div className="flex flex-col gap-1 my-4">
          <div className="flex gap-2">
            <div className="w-32">Device ID</div>
            <div className="w-3">:</div>
            <div>{record.deviceId}</div>
          </div>
          <div className="flex gap-2">
            <div className="w-32">Nama Device</div>
            <div className="w-2">:</div>
            <div>{record.deviceName}</div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const ModalApproveDevice = ({
  record,
  getData,
}: {
  record: Devices;
  getData: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/device", {
      method: "PUT",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ ...record, status: "APPROVED" }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.status !== 200) {
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
      <button
        className="bg-blue-500 py-1 px-2 text-gray-50 rounded shadow cursor-pointer hover:bg-red-blue"
        onClick={() => setOpen(true)}
      >
        <CheckCircleFilled />
      </button>
      <Modal
        open={open}
        title={`Approve Device ${record.deviceId}`}
        loading={loading}
        footer={[
          <Button
            key={"submit"}
            type="primary"
            loading={loading}
            onClick={() => handleSubmit()}
          >
            YA
          </Button>,
        ]}
      >
        <p>Lanjutkan untuk Approve device ini?</p>
        <div className="flex flex-col gap-1 my-4">
          <div className="flex gap-2">
            <div className="w-32">Device ID</div>
            <div className="w-3">:</div>
            <div>{record.deviceId}</div>
          </div>
          <div className="flex gap-2">
            <div className="w-32">Nama Device</div>
            <div className="w-2">:</div>
            <div>{record.deviceName}</div>
          </div>
          <div className="flex gap-2">
            <div className="w-32">Device Type</div>
            <div className="w-2">:</div>
            <div>{record.deviceType}</div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const ModalUpdateDevice = ({
  record,
  getData,
}: {
  record: Devices;
  getData: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Devices>(record);

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/device", {
      method: "PUT",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ ...data }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.status !== 200) {
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
      <button
        className="bg-green-500 py-1 px-2 text-gray-50 rounded shadow cursor-pointer hover:bg-red-green"
        onClick={() => setOpen(true)}
      >
        <FormOutlined />
      </button>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title={`Update Device ${record.deviceName || record.deviceId}`}
        loading={loading}
        footer={[
          <Button
            key={"submit"}
            type="primary"
            loading={loading}
            onClick={() => handleSubmit()}
            icon={<SaveFilled />}
          >
            SIMPAN
          </Button>,
        ]}
      >
        <div className="my-5">
          <FormInput
            label="Nama Device"
            placeholder="Example Name"
            required={true}
            mode="horizontal"
            type="string"
            defaultValue={data.deviceName}
            onChange={(e: string) =>
              setData((prev) => ({ ...prev, deviceName: e }))
            }
          />
          <FormInput
            label="Device Type"
            placeholder="HP | LAPTOP | TAB"
            required={true}
            mode="horizontal"
            type="string"
            defaultValue={data.deviceType}
            onChange={(e: string) =>
              setData((prev) => ({ ...prev, deviceType: e }))
            }
          />
          <FormInput
            label="Sistem Operasi"
            placeholder="Windows | Androind | Linux"
            required={true}
            mode="horizontal"
            type="string"
            defaultValue={data.sistem}
            onChange={(e: string) =>
              setData((prev) => ({ ...prev, sistem: e }))
            }
          />
        </div>
      </Modal>
    </div>
  );
};

export const ModalAddDevice = () => {
  const [open, setOpen] = useState(false);
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
        onCancel={() => setOpen(false)}
        title={`Tambah Device`}
        footer={[]}
      >
        <div className="my-2" style={{ lineHeight: 2 }}>
          <p>
            Untuk menambahkan device baru, mohon akses link berikut dari device
            yang ingin di daftarkan
          </p>
          <div className="flex gap-2 items-center">
            <p className="w-32">Link</p>
            <p className="w-5">:</p>
            <p className="underline my-1 italic text-blue-500">
              {process.env.NEXT_PUBLIC_APP_URL}api/auth/device
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
