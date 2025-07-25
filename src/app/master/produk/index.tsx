"use client";
import { IProduk } from "@/components/IInterface";
import { FormInput, FormOption } from "@/components/utils/FormUtils";
import { IDRFormat, IDRToNumber } from "@/components/utils/Functions";
import { FormOutlined, PlusCircleFilled, SaveFilled } from "@ant-design/icons";
import { Sumdan, Produk, JenisMargin } from "@prisma/client";
import { Button, Input, Modal, Select, Table, TableProps } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export const ProdukTable = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState<string>();
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<IProduk[]>([]);
  const [sumdan, setSumdan] = useState<Sumdan[]>([]);
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    (async () => {
      await fetch(`/api/sumdan?page=1&pageSize=1000`)
        .then((res) => res.json())
        .then((res) => {
          setSumdan(res.data.map((d: Sumdan, i: any) => ({ ...d, key: i })));
        })
        .catch((err) => console.log(err));
    })();
  }, []);

  const getData = async () => {
    setLoading(true);
    await fetch(
      `/api/produk?page=${page}&pageSize=${pageSize}${
        search ? "&search=" + search : ""
      }`
    )
      .then((res) => res.json())
      .then((res) => {
        if (selected) {
          const temp = res.data
            .filter((r: IProduk) => r.sumdanId === selected)
            .map((d: IProduk, i: any) => ({ ...d, key: i }));
          setData(temp);
          setTotal(temp.length);
        } else {
          setData(res.data.map((d: IProduk, i: any) => ({ ...d, key: i })));
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

  const columns: TableProps<IProduk>["columns"] = [
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
      title: "SUMDAN",
      dataIndex: "sumdan",
      key: "sumdan",
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
        return <>{record.Sumdan.name}</>;
      },
    },
    {
      title: "NAMA PRODUK",
      dataIndex: "name",
      key: "name",
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
        return <>{record.name}</>;
      },
    },
    {
      title: "MIN USIA",
      dataIndex: "minAge",
      key: "minAge",
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
        return <>{record.minAge}</>;
      },
    },
    {
      title: "MAX USIA",
      dataIndex: "maxAge",
      key: "maxAge",
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
        return <>{record.maxAge}</>;
      },
    },
    {
      title: "USIA LUNAS",
      dataIndex: "maxPaidAge",
      key: "maxPaidAge",
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
        return <>{record.maxPaidAge}</>;
      },
    },
    {
      title: "MAX PLAFON",
      dataIndex: "maxPlafon",
      key: "maxPlafon",
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
        return <>{IDRFormat(record.maxPlafon)}</>;
      },
    },
    {
      title: "MAX TENOR",
      dataIndex: "maxTenor",
      key: "maxTenor",
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
        return <>{record.maxTenor}</>;
      },
    },
    {
      title: "MARGIN",
      dataIndex: "margin",
      key: "margin",
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
        return <>{record.marginSumdan + record.marginKoperasi}</>;
      },
    },
    {
      title: "ASURANSI",
      dataIndex: "constInsurance",
      key: "constInsurance",
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
        return <>{record.constInsurance}</>;
      },
    },
    {
      title: "ADMINISTRASI",
      dataIndex: "admin",
      key: "admin",
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
        return <>{record.costAdmKoperasi + record.costAdmSumdan}</>;
      },
    },
    {
      title: "TATALAKSANA",
      dataIndex: "costGovernance",
      key: "costGovernance",
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
        return (
          <>
            {record.costGovernance > 100
              ? IDRFormat(record.costGovernance)
              : record.costGovernance}
          </>
        );
      },
    },
    {
      title: "TABUNGAN",
      dataIndex: "costAccount",
      key: "costAccount",
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
        return <>{IDRFormat(record.costAccount)}</>;
      },
    },
    {
      title: "MATERAI",
      dataIndex: "costStamp",
      key: "costStamp",
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
        return <>{IDRFormat(record.costStamp)}</>;
      },
    },
    {
      title: "PROVISI",
      dataIndex: "costProvision",
      key: "costProvision",
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
        return (
          <>
            {record.costProvision > 100
              ? IDRFormat(record.costProvision)
              : record.costProvision}
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
            <ModalAddOrUpdateProduk
              mode="Update"
              record={record}
              getData={getData}
              sumdan={sumdan}
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
            <h1 className="font-bold text-xl">Produk Management</h1>
          </div>
          <div className="flex my-2 gap-2 justify-between">
            <div className="flex gap-2">
              <ModalAddOrUpdateProduk
                mode="Add"
                getData={getData}
                sumdan={sumdan}
              />
              <div className="w-42">
                <Select
                  options={sumdan.map((s) => ({ label: s.code, value: s.id }))}
                  onChange={(e) => setSelected(e)}
                  size="small"
                  style={{ width: "100%" }}
                  placeholder="Sumdan"
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

export const ModalAddOrUpdateProduk = ({
  mode,
  record,
  getData,
  sumdan,
}: {
  mode: "Add" | "Update";
  record?: Produk;
  getData: Function;
  sumdan: Sumdan[];
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Produk>(record || defaultProduk);

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/produk", {
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
        title={`${mode} Produk`}
        footer={[
          <Button
            key={"AddProduk"}
            type="primary"
            onClick={() => handleSubmit()}
            loading={loading}
            icon={<SaveFilled />}
          >
            Simpan
          </Button>,
        ]}
        width={window.innerWidth > 600 ? "80vw" : "95vw"}
        style={{ top: 20 }}
      >
        <div className="my-5 flex gap-5 flex-col sm:flex-row">
          <div className="flex-1">
            <FormInput
              label="Nama Produk"
              placeholder="REGULLER"
              required={true}
              mode="horizontal"
              type="string"
              defaultValue={data.name}
              onChange={(e: string) =>
                setData((prev) => ({ ...prev, name: e }))
              }
            />
            <FormInput
              label="Min Usia"
              placeholder="50"
              required={true}
              mode="horizontal"
              type="number"
              defaultValue={data.minAge}
              onChange={(e: any) =>
                setData((prev) => ({ ...prev, minAge: parseFloat(e || "0") }))
              }
            />
            <FormInput
              label="Max Usia"
              placeholder="90"
              required={true}
              mode="horizontal"
              type="number"
              defaultValue={data.maxAge}
              onChange={(e: any) =>
                setData((prev) => ({ ...prev, maxAge: parseFloat(e || "0") }))
              }
            />
            <FormInput
              label="Usia Lunas"
              placeholder="90"
              required={true}
              mode="horizontal"
              type="number"
              defaultValue={data.maxPaidAge}
              onChange={(e: any) =>
                setData((prev) => ({
                  ...prev,
                  maxPaidAge: parseFloat(e || "0"),
                }))
              }
            />
            <FormInput
              label="Plafon"
              placeholder="1.000.000"
              required={true}
              mode="horizontal"
              type="string"
              defaultValue={IDRFormat(data.maxPlafon)}
              onChange={(e: any) =>
                setData((prev) => ({
                  ...prev,
                  maxPlafon: IDRToNumber(e || "0"),
                }))
              }
            />
            <FormInput
              label="Tenor"
              placeholder="120 Bulan"
              required={true}
              mode="horizontal"
              type="number"
              defaultValue={data.maxTenor}
              onChange={(e: any) =>
                setData((prev) => ({ ...prev, maxTenor: parseInt(e) }))
              }
            />
            <FormInput
              label="Margin Sumdan"
              placeholder="18"
              required={true}
              mode="horizontal"
              type="number"
              defaultValue={data.marginSumdan}
              onChange={(e: any) =>
                setData((prev) => ({ ...prev, marginSumdan: parseFloat(e) }))
              }
            />
            <FormInput
              label="Margin Koperasi"
              placeholder="5"
              required={true}
              mode="horizontal"
              type="number"
              defaultValue={data.marginKoperasi}
              onChange={(e: any) =>
                setData((prev) => ({ ...prev, marginKoperasi: parseFloat(e) }))
              }
            />
          </div>
          <div className="flex-1">
            <FormInput
              label="Asuransi"
              placeholder="24"
              required={true}
              mode="horizontal"
              type="number"
              defaultValue={data.constInsurance}
              onChange={(e: any) =>
                setData((prev) => ({ ...prev, constInsurance: parseFloat(e) }))
              }
            />
            <FormInput
              label="Adm Sumdan"
              placeholder="2"
              required={true}
              mode="horizontal"
              type="number"
              defaultValue={data.costAdmSumdan}
              onChange={(e: any) =>
                setData((prev) => ({ ...prev, costAdmSumdan: parseFloat(e) }))
              }
            />
            <FormInput
              label="Adm Koperasi"
              placeholder="2"
              required={true}
              mode="horizontal"
              type="number"
              defaultValue={data.costAdmKoperasi}
              onChange={(e: any) =>
                setData((prev) => ({ ...prev, costAdmKoperasi: parseFloat(e) }))
              }
            />
            <FormInput
              label="Tatalaksana"
              placeholder="500000"
              required={true}
              mode="horizontal"
              type="string"
              defaultValue={IDRFormat(data.costGovernance)}
              onChange={(e: any) =>
                setData((prev) => ({
                  ...prev,
                  costGovernance: IDRToNumber(e || "0"),
                }))
              }
            />
            <FormInput
              label="Tabungan"
              placeholder="50000"
              required={true}
              mode="horizontal"
              type="string"
              defaultValue={IDRFormat(data.costAccount)}
              onChange={(e: any) =>
                setData((prev) => ({
                  ...prev,
                  costAccount: IDRToNumber(e || "0"),
                }))
              }
            />
            <FormInput
              label="Materai"
              placeholder="50000"
              required={true}
              mode="horizontal"
              type="string"
              defaultValue={IDRFormat(data.costStamp)}
              onChange={(e: any) =>
                setData((prev) => ({
                  ...prev,
                  costStamp: IDRToNumber(e || "0"),
                }))
              }
            />
            <FormInput
              label="Provisi"
              placeholder="1"
              required={true}
              mode="horizontal"
              type="string"
              defaultValue={IDRFormat(data.costProvision)}
              onChange={(e: any) =>
                setData((prev) => ({
                  ...prev,
                  costProvision: IDRToNumber(e || "0"),
                }))
              }
            />
            <FormOption
              label="Sumber Dana"
              placeholder="Sumber Dana"
              required={true}
              mode="horizontal"
              type="string"
              defaultValue={data.sumdanId}
              onChange={(e: string) =>
                setData((prev) => ({ ...prev, sumdanId: e }))
              }
              options={sumdan.map((a) => ({ label: a.name, value: a.id }))}
            />
            <FormOption
              label="Jenis Margin"
              placeholder="Jenis Margin"
              required={true}
              mode="horizontal"
              type="string"
              defaultValue={data.jenisMargin}
              onChange={(e: any) =>
                setData((prev) => ({ ...prev, jenisMargin: e }))
              }
              options={[
                { label: JenisMargin.ANUITAS, value: JenisMargin.ANUITAS },
                { label: JenisMargin.FLAT, value: JenisMargin.FLAT },
              ]}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

const defaultProduk = {
  id: "",
  name: "",
  minAge: 0,
  maxAge: 0,
  maxPaidAge: 0,
  maxPlafon: 0,
  maxTenor: 0,
  marginKoperasi: 0,
  marginSumdan: 0,
  constInsurance: 0,
  costAdmSumdan: 0,
  costAdmKoperasi: 0,
  costGovernance: 0,
  costStamp: 0,
  costAccount: 0,
  costProvision: 0,
  jenisMargin: JenisMargin.ANUITAS,

  status: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  sumdanId: "",
};
