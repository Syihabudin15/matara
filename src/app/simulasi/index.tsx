"use client";
import { FormOutlined, PlusCircleFilled } from "@ant-design/icons";
import { Button, Input, Modal, Table, TableProps } from "antd";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const SimulasiTable = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState<string>();
  const [total, setTotal] = useState(0);
  // const [data, setData] = useState<Unit[]>([]);
  // const [area, setArea] = useState<Area[]>([]);
  const router = useRouter();

  // useEffect(() => {
  //   (async () => {
  //     await fetch(`/api/area?page=1&pageSize=1000`)
  //       .then((res) => res.json())
  //       .then((res) => {
  //         setArea(res.data.map((d: Area, i: any) => ({ ...d, key: i })));
  //       })
  //       .catch((err) => console.log(err));
  //   })();
  // }, []);

  // const getData = async () => {
  //   setLoading(true);
  //   await fetch(
  //     `/api/unit?page=${page}&pageSize=${pageSize}${
  //       search ? "&search=" + search : ""
  //     }`
  //   )
  //     .then((res) => res.json())
  //     .then((res) => {
  //       setData(res.data.map((d: Unit, i: any) => ({ ...d, key: i })));
  //       setTotal(res.total);
  //     })
  //     .catch((err) => console.log(err));
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   let timeout: any;
  //   (async () => {
  //     timeout = setTimeout(async () => {
  //       await getData();
  //     }, 200);
  //   })();
  //   return () => clearTimeout(timeout);
  // }, [search, page, pageSize]);

  const columns: TableProps["columns"] = [
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
      title: "TIPE KREDIT",
      dataIndex: "kreditType",
      key: "kreditType",
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
      title: "NOPEN/NIK",
      dataIndex: "noUnik",
      key: "noUnik",
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
      title: "NAMA PEMOHON",
      dataIndex: "fullname",
      key: "fullname",
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
      title: "PRODUK PEMBIAYAAN",
      dataIndex: "produk",
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
      title: "JENIS PEMBIAYAAN",
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
            <p>E</p>
            <p>D</p>
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
            <h1 className="font-bold text-xl">Simulasi Kredit</h1>
          </div>
          <div className="flex my-2 gap-2 justify-between">
            <div>
              <Button
                type="primary"
                size="small"
                icon={<PlusCircleFilled />}
                onClick={() => router.push("/simulasi/create")}
              >
                New
              </Button>
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
      // dataSource={data}
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
