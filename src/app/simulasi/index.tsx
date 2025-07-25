"use client";
import { useUser } from "@/components/context/UserContext";
import {
  IDataPengajuan,
  IPengajuan,
  ISimulasi,
  IUser,
} from "@/components/IInterface";
import { IDRFormat } from "@/components/utils/Functions";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Modal,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ModalSimulasi } from "./create";
import { StatusPengajuan } from "@prisma/client";
import { FormInput } from "@/components/utils/FormUtils";
const { Paragraph } = Typography;

export const SimulasiTable = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState<string>();
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<IDataPengajuan[]>([]);
  const router = useRouter();
  const user = useUser();

  const getData = async () => {
    setLoading(true);
    await fetch(
      `/api/pengajuan?page=${page}&pageSize=${pageSize}${
        search ? "&search=" + search : ""
      }&status=SIMULASI${
        user && user.role === "MOC" ? "&userId=" + user.id : ""
      }`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(
          res.data.map((d: IDataPengajuan, i: any) => ({ ...d, key: i }))
        );
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

  const columns: TableProps<IDataPengajuan>["columns"] = [
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
      title: "NOPEN",
      dataIndex: "nopen",
      key: "nopen",
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
        return <>{record.nopen}</>;
      },
    },
    {
      title: "PEMOHON",
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
        return <>{record.fullname}</>;
      },
    },
    {
      title: "PRODUK PEMBIAYAAN",
      dataIndex: "produk",
      key: "email",
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
        return <>{record.DetailPengajuan.Produk.name}</>;
      },
    },
    {
      title: "JENIS PEMBIAYAAN",
      dataIndex: "phone",
      key: "phone",
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
        return <>{record.DetailPengajuan.Jenis.name}</>;
      },
    },
    {
      title: "SUMBER DANA",
      dataIndex: "sumdan",
      key: "sumdan",
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
        return <>{record.DetailPengajuan.Produk.Sumdan.name}</>;
      },
    },
    {
      title: "PLAFON",
      dataIndex: "plafon",
      key: "plafon",
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
        return <>{IDRFormat(record.DetailPengajuan.plafon)}</>;
      },
    },
    {
      title: "TENOR",
      dataIndex: "tenor",
      key: "tenor",
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
        return <>{record.DetailPengajuan.tenor}</>;
      },
    },
    {
      title: "KETERANGAN",
      dataIndex: "desc",
      key: "desc",
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
        return (
          <>
            <Paragraph
              ellipsis={{
                rows: 1,
                expandable: "collapsible",
              }}
              style={{ fontSize: 12 }}
            >
              {record.desc}
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
            {/* <FileScanner /> */}
            <Tooltip title="Cek Simulasi">
              <ModalSimulasi
                mode="Detail"
                data={record as unknown as ISimulasi}
                user={user as IUser}
                setData={() => {}}
              />
            </Tooltip>
            <Tooltip title="Proses Pengajuan">
              <ModalProses record={record} getData={getData} />
            </Tooltip>
            <Tooltip title="Hapus Pengajuan">
              <ModalDelete record={record} getData={getData} />
            </Tooltip>
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

const ModalDelete = ({
  record,
  getData,
}: {
  record: IPengajuan;
  getData: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await fetch("/api/pengajuan", {
      method: "PUT",
      headers: { "Content-type": "Acpplication/json" },
      body: JSON.stringify({ ...record, isActive: false }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.status !== 201) {
          alert(res.msg);
        } else {
          await getData();
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Internal Server Error");
      });
    setLoading(false);
  };

  return (
    <div>
      <Button
        icon={<DeleteOutlined />}
        type="primary"
        danger
        size="small"
        onClick={() => setOpen(true)}
      ></Button>
      <Modal
        title={`HAPUS SIMULASI ${record.fullname}`}
        open={open}
        loading={loading}
        onCancel={() => setOpen(false)}
        footer={[
          <Button
            key={"CancelDelete"}
            loading={loading}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>,
          <Button
            key={"DeletedSimulation"}
            danger
            onClick={() => handleDelete()}
            loading={loading}
          >
            YA
          </Button>,
        ]}
      >
        <p>Apakah anda yakin ingin menghapus simulasi ini ?</p>
      </Modal>
    </div>
  );
};

const ModalProses = ({
  record,
  getData,
}: {
  record: IPengajuan;
  getData: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleProses = async () => {
    setLoading(true);
    await fetch("/api/pengajuan", {
      method: "PUT",
      headers: { "Content-type": "Acpplication/json" },
      body: JSON.stringify({
        ...record,
        status: StatusPengajuan.PROCCESS,
        desc: "Proses perlengkapan berkas",
      }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.status !== 200) {
          alert(res.msg);
        } else {
          await getData();
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Internal Server Error");
      });
    setLoading(false);
  };

  return (
    <div>
      <Button
        icon={<CheckCircleOutlined />}
        type="primary"
        size="small"
        onClick={() => setOpen(true)}
      ></Button>
      <Modal
        title={`PROSES SIMULASI ${record.fullname}`}
        open={open}
        loading={loading}
        onCancel={() => setOpen(false)}
        footer={[
          <Button
            key={"CancelProses"}
            loading={loading}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>,
          <Button
            key={"ProsesSimulation"}
            onClick={() => handleProses()}
            loading={loading}
            type="primary"
          >
            Proses
          </Button>,
        ]}
      >
        <div className="my-2">
          <p>
            Dengan memproses simulasi ini, data akan dibawa ke Monitoring
            Pembiayaan untuk dilakukan perlengkapan dan validasi berkas.
          </p>
          <p> Mohon pastikan data dibawah ini sudah benar!</p>
        </div>
        <div className="my-4">
          <FormInput
            type="string"
            label="Nomor Pensiun"
            defaultValue={record.nopen}
            onChange={(e: any) => {}}
            size="small"
            disabled={true}
            mode="horizontal"
          />
          <FormInput
            type="string"
            label="Nama Pemohon"
            defaultValue={record.fullname}
            onChange={(e: any) => {}}
            size="small"
            disabled={true}
            mode="horizontal"
          />
          <FormInput
            type="string"
            label="Plafon"
            defaultValue={IDRFormat(record.DetailPengajuan.plafon)}
            onChange={(e: any) => {}}
            size="small"
            disabled={true}
            mode="horizontal"
          />
          <FormInput
            type="string"
            label="Tenor"
            defaultValue={record.DetailPengajuan.tenor + " Bulan"}
            onChange={(e: any) => {}}
            size="small"
            disabled={true}
            mode="horizontal"
          />
        </div>
      </Modal>
    </div>
  );
};
