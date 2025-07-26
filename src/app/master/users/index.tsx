"use client";
import { FormInput, FormOption } from "@/components/utils/FormUtils";
import {
  DeleteFilled,
  FormOutlined,
  LoadingOutlined,
  PlusCircleFilled,
  SaveFilled,
} from "@ant-design/icons";
import { AuthType, Role, Sumdan, Unit, Users } from "@prisma/client";
import {
  Button,
  Input,
  Modal,
  Steps,
  Table,
  TableProps,
  Typography,
} from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const { Paragraph } = Typography;

const FaceScanner = dynamic(() => import("@/components/modals/FaceScanner"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

export default function UserTable() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState<string>();
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<Users[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [sumdans, setSumdans] = useState<Sumdan[]>([]);

  useEffect(() => {
    (async () => {
      await fetch(`/api/unit?page=1&pageSize=1000`)
        .then((res) => res.json())
        .then((res) => {
          setUnits(res.data.map((d: Unit, i: any) => ({ ...d, key: i })));
        })
        .catch((err) => console.log(err));
      await fetch(`/api/sumdan?page=1&pageSize=1000`)
        .then((res) => res.json())
        .then((res) => {
          setSumdans(res.data.map((d: Sumdan, i: any) => ({ ...d, key: i })));
        })
        .catch((err) => console.log(err));
    })();
  }, []);

  const getData = async () => {
    setLoading(true);
    await fetch(
      `/api/user?page=${page}&pageSize=${pageSize}${
        search ? "&search=" + search : ""
      }`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res.data.map((d: Users, i: any) => ({ ...d, key: i })));
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

  const columns: TableProps<Users>["columns"] = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 80,
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
      title: "NAMA LENGKAP",
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
      title: "Username",
      dataIndex: "username",
      key: "username",
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
        return <>{record.username}</>;
      },
    },
    {
      title: "EMAIL",
      dataIndex: "email",
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
        return <>{record.email}</>;
      },
    },
    {
      title: "TELEPON",
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
      title: "ALAMAT",
      dataIndex: "address",
      key: "address",
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
          <Paragraph
            ellipsis={{
              rows: 1,
              expandable: "collapsible",
            }}
            style={{ fontSize: 12 }}
          >
            {record.address}
          </Paragraph>
        );
      },
    },
    {
      title: "CABANG",
      dataIndex: "unitId",
      key: "unitId",
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
        return <>{record.unitId}</>;
      },
    },
    {
      title: "POSISI",
      dataIndex: "position",
      key: "position",
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
        return <>{record.position}</>;
      },
    },
    {
      title: "ROLE",
      dataIndex: "role",
      key: "role",
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
        return <>{record.role}</>;
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
          <div>
            {!record.status && (
              <div className="text-gray-50 bg-red-400 py-1 px-2 rounded italic text-xs">
                <span style={{ fontSize: 11 }}>INACTIVE</span>
              </div>
            )}
            {record.status && (
              <div className="text-gray-50 bg-green-400 py-1 px-2 rounded italic text-xs">
                <span style={{ fontSize: 11 }}>ACTIVE</span>
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
            <ModalDeleteUser record={record} getData={getData} />
            <ModalAddOrUpdateUser
              mode="Update"
              record={record}
              getData={getData}
              units={units}
              sumdans={sumdans}
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
            <h1 className="font-bold text-xl">Users Management</h1>
          </div>
          <div className="flex my-2 gap-2 justify-between">
            <div>
              <ModalAddOrUpdateUser
                mode="Add"
                getData={getData}
                units={units}
                sumdans={sumdans}
              />
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
}

export const ModalDeleteUser = ({
  record,
  getData,
}: {
  record: Users;
  getData: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ ...record, status: false }),
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
        title={`Hapus Akun ${record.fullname}`}
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
        <p>Lanjutkan untuk menghapus Akun ini?</p>
        <div className="flex flex-col gap-1 my-4">
          <div className="flex gap-2">
            <div className="w-32">Nama Lengkap</div>
            <div className="w-3">:</div>
            <div>{record.fullname}</div>
          </div>
          <div className="flex gap-2">
            <div className="w-32">NIK | NIP</div>
            <div className="w-2">:</div>
            <div>
              {record.nik} | {record.nip}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-32">Posisi</div>
            <div className="w-2">:</div>
            <div>{record.position}</div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const ModalAddOrUpdateUser = ({
  mode,
  record,
  getData,
  units,
  sumdans,
}: {
  mode: "Add" | "Update";
  record?: Users;
  getData: Function;
  units: Unit[];
  sumdans: Sumdan[];
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Users>(record || defaultUser);
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: "Personal",
      content: (
        <PersonalData
          data={data}
          setData={setData}
          units={units}
          sumdans={sumdans}
        />
      ),
    },
    {
      title: "Menu",
      content: "Second-content",
    },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/user", {
      method: mode === "Add" ? "POST" : "PUT",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify(data),
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
        onCancel={() => setOpen(false)}
        title={`${mode} User ${
          mode === "Update" && record ? record.fullname : ""
        }`}
        loading={loading}
        footer={[]}
        width={window.innerWidth > 600 ? "70vw" : "95vw"}
        style={{ top: 10 }}
      >
        <Steps
          current={current}
          items={steps.map((item) => ({ key: item.title, title: item.title }))}
        />
        <div>{steps[current].content}</div>
        <div style={{ marginTop: 24 }} className="flex justify-end ">
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()} loading={loading}>
              Next
            </Button>
          )}
          {current > 0 && (
            <Button
              style={{ margin: "0 8px" }}
              onClick={() => prev()}
              loading={loading}
            >
              Previous
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              loading={loading}
              onClick={() => handleSubmit()}
              icon={<SaveFilled />}
            >
              Simpan
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
};

const PersonalData = ({
  data,
  setData,
  units,
  sumdans,
}: {
  data: Users;
  setData: Function;
  units: Unit[];
  sumdans: Sumdan[];
}) => {
  const [openFace, setOpenFace] = useState(false);
  return (
    <div className="my-5 flex gap-5 flex-col sm:flex-row flex-wrap justify-between">
      <div className="w-full sm:w-[45%]">
        <FormInput
          label={"Nama Lengkap"}
          onChange={(e: any) =>
            setData((prev: Users) => ({ ...prev, fullname: e }))
          }
          defaultValue={data.fullname}
          mode="horizontal"
          required
        />
        <FormInput
          label={"Email"}
          onChange={(e: any) =>
            setData((prev: Users) => ({ ...prev, email: e }))
          }
          defaultValue={data.email}
          mode="horizontal"
          required
        />
        <FormInput
          label={"Telepon"}
          onChange={(e: any) =>
            setData((prev: Users) => ({ ...prev, phone: e }))
          }
          defaultValue={data.phone}
          mode="horizontal"
          required
        />
        <FormInput
          label={"NIP"}
          onChange={(e: any) => setData((prev: Users) => ({ ...prev, nip: e }))}
          defaultValue={data.nip}
          mode="horizontal"
          required
        />
        <FormInput
          label={"NIK"}
          onChange={(e: any) => setData((prev: Users) => ({ ...prev, nik: e }))}
          defaultValue={data.nik}
          mode="horizontal"
          required
        />
        <FormInput
          label={"Alamat"}
          onChange={(e: any) =>
            setData((prev: Users) => ({ ...prev, address: e }))
          }
          defaultValue={data.address}
          mode="horizontal"
          required
        />
        <FormInput
          label={"Posisi"}
          onChange={(e: any) =>
            setData((prev: Users) => ({ ...prev, position: e }))
          }
          defaultValue={data.position}
          mode="horizontal"
          required
        />
      </div>
      <div className="w-full sm:w-[45%]">
        <FormInput
          label={"Username"}
          onChange={(e: any) =>
            setData((prev: Users) => ({ ...prev, username: e }))
          }
          defaultValue={data.username}
          mode="horizontal"
          required
        />
        <FormInput
          label={"Password"}
          onChange={(e: any) =>
            setData((prev: Users) => ({ ...prev, password: e }))
          }
          defaultValue={data.password}
          mode="horizontal"
          required
        />
        <FormOption
          label={"Cabang"}
          onChange={(e: any) =>
            setData((prev: Users) => ({ ...prev, unitId: e }))
          }
          mode="horizontal"
          defaultValue={data.unitId}
          options={units.map((u: Unit) => ({ label: u.name, value: u.id }))}
        />
        <FormOption
          label={"Role"}
          onChange={(e: any) =>
            setData((prev: Users) => ({ ...prev, role: e }))
          }
          mode="horizontal"
          options={[
            { label: "MOC", value: "MOC" },
            { label: "ADMIN", value: "ADMIN" },
            { label: "DEVELOPER", value: "DEVELOPER" },
          ]}
          defaultValue={data.role}
        />
        <FormOption
          label={"Sumber Dana"}
          onChange={(e: any) =>
            setData((prev: Users) => ({ ...prev, sumdanId: e }))
          }
          mode="horizontal"
          defaultValue={data.sumdanId}
          options={sumdans.map((u: Sumdan) => ({ label: u.name, value: u.id }))}
        />
        <FormOption
          label={"Login Tipe"}
          onChange={(e: any) =>
            setData((prev: Users) => ({ ...prev, authType: e }))
          }
          defaultValue={data.authType}
          mode="horizontal"
          options={[
            { label: "CREDENTIAL", value: "CREDENTIAL" },
            { label: "FACE", value: "FACE" },
          ]}
        />
        {data && (
          <FaceScanner
            user={data}
            isOpen={openFace}
            mode="Register"
            setFace={(e: any) =>
              setData((prev: Users) => ({ ...prev, face: JSON.stringify(e) }))
            }
          />
        )}
      </div>
    </div>
  );
};

const defaultUser: Users = {
  id: "",
  fullname: "",
  username: "",
  password: "",
  email: "",
  phone: "",
  address: "",
  nip: "",
  nik: "",
  position: "",
  face: null,
  image: null,
  unitId: null,
  role: Role.MOC,
  status: true,
  sumdanId: null,
  menu: null,
  authType: AuthType.CREDENTIAL,
  coord: null,
  location: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};
