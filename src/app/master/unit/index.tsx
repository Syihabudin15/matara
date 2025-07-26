"use client";
import { IUnit } from "@/components/IInterface";
import { FormInput, FormOption } from "@/components/utils/FormUtils";
import { FormOutlined, PlusCircleFilled, SaveFilled } from "@ant-design/icons";
import { Area, Unit } from "@prisma/client";
import { Button, Input, Modal, Select, Table, TableProps } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export const UnitTable = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState<string>();
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<IUnit[]>([]);
  const [area, setArea] = useState<Area[]>([]);
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    (async () => {
      await fetch(`/api/area?page=1&pageSize=1000`)
        .then((res) => res.json())
        .then((res) => {
          setArea(res.data.map((d: Area, i: any) => ({ ...d, key: i })));
        })
        .catch((err) => console.log(err));
    })();
  }, []);

  const getData = async () => {
    setLoading(true);
    await fetch(
      `/api/unit?page=${page}&pageSize=${pageSize}${
        search ? "&search=" + search : ""
      }`
    )
      .then((res) => res.json())
      .then((res) => {
        if (selected) {
          const temp = res.data
            .filter((r: IUnit) => r.areaId === selected)
            .map((d: IUnit, i: any) => ({ ...d, key: i }));
          setData(temp);
          setTotal(temp.length);
        } else {
          setData(res.data.map((d: IUnit, i: any) => ({ ...d, key: i })));
          setTotal(res.total);
        }
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
  }, [search, page, pageSize, selected]);

  const columns: TableProps<IUnit>["columns"] = [
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
      title: "AREA",
      dataIndex: "area",
      key: "area",
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
        return <>{record.Area.name}</>;
      },
    },
    {
      title: "NAMA CABANG",
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
      title: "KODE CABANG",
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
            <ModalAddOrUpdateUnit
              mode="Update"
              record={record}
              getData={getData}
              area={area}
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
            <h1 className="font-bold text-xl">Unit Management</h1>
          </div>
          <div className="flex my-2 gap-2 justify-between">
            <div className="flex gap-2">
              <ModalAddOrUpdateUnit mode="Add" getData={getData} area={area} />
              <div className="w-42">
                <Select
                  options={area.map((s) => ({ label: s.code, value: s.id }))}
                  onChange={(e) => setSelected(e)}
                  size="small"
                  style={{ width: "100%" }}
                  placeholder="Area"
                  allowClear
                />
              </div>
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

export const ModalAddOrUpdateUnit = ({
  mode,
  record,
  getData,
  area,
}: {
  mode: "Add" | "Update";
  record?: Unit;
  getData: Function;
  area: Area[];
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Unit>(record || defaultUnit);

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/unit", {
      method: mode === "Add" ? "POST" : "PUT",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ ...data }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        console.log(res);
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
        title={`${mode} Unit`}
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
        <div>
          <FormInput
            label="Nama Unit"
            placeholder="West Java"
            required={true}
            mode="vertical"
            type="string"
            defaultValue={data.name}
            onChange={(e: string) => setData((prev) => ({ ...prev, name: e }))}
          />
          <FormInput
            label="Kode Unit"
            placeholder="WJ"
            required={true}
            mode="vertical"
            type="string"
            defaultValue={data.code}
            onChange={(e: string) => setData((prev) => ({ ...prev, code: e }))}
          />
          <FormInput
            label="Alamat"
            placeholder="Jl.xxxx"
            required={true}
            mode="vertical"
            type="string"
            defaultValue={data.address}
            onChange={(e: string) =>
              setData((prev) => ({ ...prev, address: e }))
            }
          />
          <FormInput
            label="Phone"
            placeholder="08xxxx"
            required={true}
            mode="vertical"
            type="string"
            defaultValue={data.phone}
            onChange={(e: string) => setData((prev) => ({ ...prev, phone: e }))}
          />
          <FormInput
            label="Email"
            placeholder="example@gmail.com"
            required={true}
            mode="vertical"
            type="string"
            defaultValue={data.email}
            onChange={(e: string) => setData((prev) => ({ ...prev, email: e }))}
          />
          <FormOption
            label="Area"
            placeholder="West Java"
            required={true}
            mode="vertical"
            type="string"
            defaultValue={data.areaId}
            onChange={(e: string) =>
              setData((prev) => ({ ...prev, areaId: e }))
            }
            options={area.map((a) => ({ label: a.name, value: a.id }))}
          />
        </div>
      </Modal>
    </div>
  );
};

const defaultUnit: Unit = {
  id: "",
  name: "",
  address: "",
  code: "",
  email: "",
  phone: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  areaId: "",
};
