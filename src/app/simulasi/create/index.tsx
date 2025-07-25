"use client";

import { useUser } from "@/components/context/UserContext";
import { IProduk, ISimulasi, IUser } from "@/components/IInterface";
import {
  FormBiaya,
  FormInput,
  FormOption,
  ItemModalSimulation,
} from "@/components/utils/FormUtils";
import {
  AngsuranAnuitas,
  AngsuranFlat,
  getFullAge,
  getMaxPlafond,
  getMaxTenor,
  IDRFormat,
  IDRToNumber,
} from "@/components/utils/Functions";
import {
  CameraFilled,
  HistoryOutlined,
  SaveFilled,
  SearchOutlined,
} from "@ant-design/icons";
import {
  DetailPengajuan,
  Jenis,
  JenisMargin,
  Pengajuan,
  StatusPengajuan,
  SumdanType,
} from "@prisma/client";
import { data } from "@tensorflow/tfjs";
import { Button, Input, Modal } from "antd";
import moment from "moment";
import Image from "next/image";
import { useEffect, useState } from "react";

export const CreateSimulation = ({ mode }: { mode: "Simulasi" | "Input" }) => {
  const user = useUser();
  const [data, setData] = useState<ISimulasi>({
    ...defaultSimulation,
    usersId: user?.id || "",
  });
  const [produks, setProduks] = useState<IProduk[]>([]);
  const [jeniss, setJeniss] = useState<Jenis[]>([]);

  useEffect(() => {
    (async () => {
      await fetch("/api/produk?page=1&pageSize=50")
        .then((res) => res.json())
        .then((res) => setProduks(res.data));
      await fetch("/api/jenis?page=1&pageSize=50")
        .then((res) => res.json())
        .then((res) => setJeniss(res.data));
    })();
  }, []);

  // HandleMaxTenor
  useEffect(() => {
    if (!data.DetailPengajuan.birthdate || !data.DetailPengajuan.newSalary) {
      return;
    }
    const age = getFullAge(
      moment(data.DetailPengajuan.birthdate).format("YYYY-MM-DD"),
      moment().format("YYYY-MM-DD")
    );
    const maxTenor = getMaxTenor(
      data.DetailPengajuan.Produk.maxPaidAge,
      age.year,
      age.month
    );
    setData((prev) => ({
      ...prev,
      maxTenor:
        maxTenor > prev.DetailPengajuan.Produk.maxTenor
          ? prev.DetailPengajuan.Produk.maxTenor
          : maxTenor,
      DetailPengajuan: {
        ...prev.DetailPengajuan,
        marginSumdan: prev.DetailPengajuan.Produk.marginSumdan,
        marginKoperasi: prev.DetailPengajuan.Produk.marginKoperasi,
      },
    }));
    if (
      !(age.year > data.DetailPengajuan.Produk.minAge) &&
      !(age.year < data.DetailPengajuan.Produk.maxAge)
    ) {
      setData({
        ...defaultSimulation,
        DetailPengajuan: {
          ...defaultSimulation.DetailPengajuan,
          birthdate: data.DetailPengajuan.birthdate,
        },
      });
    }
  }, [
    data.DetailPengajuan.birthdate,
    data.DetailPengajuan.newSalary,
    data.DetailPengajuan.Produk.id,
  ]);

  // HandleMaxPlafond
  useEffect(() => {
    if (!data.DetailPengajuan.tenor) return;

    const maxPlafon = getMaxPlafond(
      data.DetailPengajuan.marginKoperasi + data.DetailPengajuan.marginSumdan,
      data.DetailPengajuan.tenor,
      data.DetailPengajuan.newSalary *
        (data.DetailPengajuan.Produk.Sumdan.maxInstallment / 100)
    );
    setData((prev) => ({
      ...prev,
      maxPlafon:
        maxPlafon > prev.DetailPengajuan.Produk.maxPlafon
          ? prev.DetailPengajuan.Produk.maxPlafon
          : parseInt(maxPlafon.toString()),
    }));
  }, [
    data.DetailPengajuan.newSalary,
    data.DetailPengajuan.tenor,
    data.DetailPengajuan.Produk.id,
  ]);

  // HandleBiayaBiaya
  useEffect(() => {
    if (!data.DetailPengajuan.plafon || !data.DetailPengajuan.tenor) return;
    if (
      data.DetailPengajuan.plafon > data.maxPlafon ||
      data.DetailPengajuan.tenor > data.maxTenor
    ) {
      setData((prev) => ({
        ...prev,
        DetailPengajuan: { ...prev.DetailPengajuan, plafon: 0, tenor: 1 },
      }));
    }
    console.log(data.DetailPengajuan.Produk);
    const installmentFlat = AngsuranFlat(
      data.DetailPengajuan.plafon,
      data.DetailPengajuan.tenor,
      data.DetailPengajuan.marginSumdan + data.DetailPengajuan.marginKoperasi,
      data.DetailPengajuan.Produk.Sumdan.rounded
    );
    const installmentAnuitas = AngsuranAnuitas(
      data.DetailPengajuan.plafon || 0,
      data.DetailPengajuan.tenor || 0,
      data.DetailPengajuan.marginSumdan + data.DetailPengajuan.marginKoperasi,
      data.DetailPengajuan.Produk.Sumdan.rounded || 0
    );

    setData((prev) => ({
      ...prev,
      DetailPengajuan: {
        ...prev.DetailPengajuan,
        installment:
          data.DetailPengajuan.Produk.jenisMargin === JenisMargin.FLAT
            ? installmentFlat.angsuran
            : installmentAnuitas.angsuran,
      },
    }));
  }, [
    data.DetailPengajuan.plafon,
    data.DetailPengajuan.tenor,
    data.DetailPengajuan.Produk.id,
  ]);

  return (
    <div className="flex gap-4 py-2 px-1 flex-col sm:flex-row">
      <div className="flex-1">
        <DataDebitur
          data={data}
          setData={setData}
          produks={produks}
          jeniss={jeniss}
        />
        <RekomendasiBiaya data={data} setData={setData} />
      </div>
      <div className="flex-1">
        <Pembiayaan data={data} setData={setData} />
        {mode === "Simulasi" && user && (
          <div className="flex justify-end gap-2 items-center mt-4">
            <ModalSimulasi data={data} setData={setData} user={user} />
          </div>
        )}
      </div>
    </div>
  );
};

const DataDebitur = ({
  data,
  setData,
  produks,
  jeniss,
}: {
  data: ISimulasi;
  setData: Function;
  produks: IProduk[];
  jeniss: Jenis[];
}) => {
  const handleSearch = async (e: string) => {
    if (!e) return;
    await fetch(`/api/flagging/find?nopen=${e}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
          setData((prev: ISimulasi) => ({
            ...prev,
            flaggingId: res.data.id,
            fullname: res.data.nama_penerima,
            DetailPengajuan: {
              ...prev.DetailPengajuan,
              oldSalary: IDRToNumber(res.data.jmltotal || "0"),
            },
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {/* SPACE */}
      <div className="flex gap-2">
        <div className="flex-1">
          <FormInput
            type="date"
            label="Tanggal Simulasi"
            defaultValue={moment(data.createdAt).format("YYYY-MM-DD")}
            onChange={(e: any) =>
              setData((prev: ISimulasi) => ({ ...prev, createdAt: e }))
            }
            disabled={true}
            size="small"
          />
        </div>
        <div className="flex-1">
          <FormInput
            type="string"
            label="NOPEN"
            required
            defaultValue={data.nopen}
            onChange={(e: any) =>
              setData((prev: ISimulasi) => ({ ...prev, nopen: e }))
            }
            size="small"
            suffix={
              <Button size="small" onClick={() => handleSearch(data.nopen)}>
                <SearchOutlined />
              </Button>
            }
          />
        </div>
      </div>
      {/* SPACE */}
      <div className="flex gap-2">
        <div className="flex-1">
          <FormInput
            type="string"
            label="Nama Lengkap"
            required
            defaultValue={data.fullname}
            onChange={(e: any) =>
              setData((prev: ISimulasi) => ({ ...prev, fullname: e }))
            }
            size="small"
          />
        </div>
        <div className="flex-1">
          <FormInput
            type="date"
            label="Tanggal Lahir"
            required
            defaultValue={
              moment(data.DetailPengajuan.birthdate).format("YYYY-MM-DD") ==
              moment().format("YYYY-MM-DD")
                ? undefined
                : moment(data.DetailPengajuan.birthdate).format("YYYY-MM-DD")
            }
            onChange={(e: any) =>
              setData((prev: ISimulasi) => ({
                ...prev,
                DetailPengajuan: {
                  ...prev.DetailPengajuan,
                  birthdate: new Date(e),
                },
              }))
            }
            size="small"
          />
        </div>
      </div>
      {/* SPACE */}
      <div className="flex gap-4">
        <Input
          disabled
          suffix={"Y"}
          size="small"
          value={
            data.DetailPengajuan.birthdate
              ? getFullAge(
                  moment(data.DetailPengajuan.birthdate).format("YYYY-MM-DD"),
                  moment().format("YYYY-MM-DD")
                ).year
              : 0
          }
          style={{ color: "#444" }}
        />
        <Input
          disabled
          suffix={"M"}
          size="small"
          value={
            data.DetailPengajuan.birthdate
              ? getFullAge(
                  moment(data.DetailPengajuan.birthdate).format("YYYY-MM-DD"),
                  moment().format("YYYY-MM-DD")
                ).month
              : 0
          }
          style={{ color: "#444" }}
        />
        <Input
          disabled
          suffix={"D"}
          size="small"
          value={
            data.DetailPengajuan.birthdate
              ? getFullAge(
                  moment(data.DetailPengajuan.birthdate).format("YYYY-MM-DD"),
                  moment().format("YYYY-MM-DD")
                ).day
              : 0
          }
          style={{ color: "#444" }}
        />
      </div>
      {/* SPACE */}
      <div className="flex gap-2">
        <div className="flex-1">
          <FormInput
            type="string"
            label="Gaji Lama"
            defaultValue={IDRFormat(data.DetailPengajuan.oldSalary)}
            onChange={(e: any) =>
              setData((prev: ISimulasi) => ({
                ...prev,
                DetailPengajuan: {
                  ...prev.DetailPengajuan,
                  oldSalary: IDRToNumber(e || "0"),
                },
              }))
            }
            size="small"
            disabled
          />
        </div>
        <div className="flex-1">
          <FormInput
            type="string"
            label="Gaji Terbaru"
            required
            defaultValue={IDRFormat(data.DetailPengajuan.newSalary)}
            onChange={(e: any) =>
              setData((prev: ISimulasi) => ({
                ...prev,
                DetailPengajuan: {
                  ...prev.DetailPengajuan,
                  newSalary: IDRToNumber(e || "0"),
                },
              }))
            }
            size="small"
          />
        </div>
      </div>
      {/* SPACE */}
      <div className="flex gap-2">
        <div className="flex-1">
          <FormOption
            // type="string"
            label="Produk Pembiayaan"
            required
            options={produks
              .filter((p) => {
                const age = getFullAge(
                  moment(data.DetailPengajuan.birthdate).format("YYYY-MM-DD"),
                  moment().format("YYYY-MM-DD")
                ).year;
                if (age > p.minAge && age < p.maxAge) return p;
              })
              .map((p) => ({
                label: (
                  <div className="flex justify-between items-center">
                    <p>{p.name}</p>
                    <p className="italic text-xs opacity-70">
                      ({p.Sumdan.code})
                    </p>
                  </div>
                ),
                value: p.id,
              }))}
            onChange={(e: any) => {
              const find = e
                ? produks.filter((p) => p.id === e)[0]
                : defaultSimulation.DetailPengajuan.Produk;
              setData((prev: ISimulasi) => ({
                ...prev,
                DetailPengajuan: {
                  ...prev.DetailPengajuan,
                  Produk: find,
                  marginKoperasi: find.marginKoperasi,
                  marginSumdan: find.marginSumdan,
                  constInsurance: find.constInsurance,
                  costAdmSumdan: find.costAdmSumdan,
                  costAdmKoperasi: find.costAdmKoperasi,
                  costGovernance: find.costGovernance,
                  costStamp: find.costStamp,
                  costAccount: find.costAccount,
                  costProvision: find.costProvision,
                  installment: 0,
                  jenisMargin: find.jenisMargin,
                  rounded: find.Sumdan.rounded,
                },
              }));
            }}
            size="small"
          />
        </div>
        <div className="flex-1">
          <FormOption
            // type="string"
            label="Jenis Pembiayaan"
            required
            options={jeniss.map((p) => ({ label: p.name, value: p.id }))}
            onChange={(e: any) => {
              const find = e
                ? jeniss.filter((p) => p.id === e)[0]
                : defaultSimulation.DetailPengajuan.Jenis;
              setData((prev: ISimulasi) => ({
                ...prev,
                DetailPengajuan: {
                  ...prev.DetailPengajuan,
                  Jenis: find,
                  costMutasi: find.costMutasi,
                  blokir: find.blokir,
                },
              }));
            }}
            size="small"
          />
        </div>
      </div>
      {/* SPACE */}
    </div>
  );
};

export const RekomendasiBiaya = ({
  data,
  setData,
}: {
  data: ISimulasi;
  setData: Function;
}) => {
  return (
    <div>
      <div className="text-center font-bold border bg-purple-500 text-gray-100 p-2 rounded">
        <p>REKOMENDASI PEMBIAYAAN</p>
      </div>
      {/* SPACE */}
      <div className="flex gap-2">
        <div className="flex-1">
          <FormInput
            type="number"
            label="Max Tenor"
            defaultValue={data.maxTenor}
            onChange={(e: any) => {}}
            size="small"
            disabled={true}
          />
        </div>
        <div className="flex-1">
          <FormInput
            type="number"
            label="Tenor"
            required
            defaultValue={data.DetailPengajuan.tenor}
            onChange={(e: any) =>
              setData((prev: ISimulasi) => ({
                ...prev,
                DetailPengajuan: {
                  ...prev.DetailPengajuan,
                  tenor:
                    parseInt(e || "0") > prev.maxTenor ? 0 : parseInt(e || "0"),
                },
              }))
            }
            size="small"
          />
        </div>
      </div>
      {/* SPACE */}
      <div className="flex gap-2">
        <div className="flex-1">
          <FormInput
            type="string"
            label="Max Plafon"
            defaultValue={IDRFormat(data.maxPlafon)}
            onChange={(e: any) => {}}
            size="small"
            disabled={true}
          />
        </div>
        <div className="flex-1">
          <FormInput
            type="string"
            required
            label="Plafon"
            defaultValue={IDRFormat(data.DetailPengajuan.plafon)}
            onChange={(e: any) =>
              setData((prev: ISimulasi) => ({
                ...prev,
                DetailPengajuan: {
                  ...prev.DetailPengajuan,
                  plafon:
                    IDRToNumber(e || "0") > prev.maxPlafon
                      ? 0
                      : IDRToNumber(e || "0"),
                },
              }))
            }
            size="small"
          />
        </div>
      </div>
      {/* SPACE */}
      <div className="flex gap-2">
        <div className="flex-1">
          <FormInput
            type="string"
            label="Max Angsuran"
            defaultValue={IDRFormat(
              data.DetailPengajuan.newSalary * (95 / 100)
            )}
            onChange={(e: any) => {}}
            size="small"
            disabled={true}
          />
        </div>
        <div className="flex-1">
          <FormInput
            type="string"
            label="Angsuran"
            defaultValue={IDRFormat(data.DetailPengajuan.installment)}
            size="small"
            onChange={(e: any) => {}}
            disabled={true}
          />
        </div>
      </div>
      {/* SPACE */}
    </div>
  );
};

export const Pembiayaan = ({
  data,
  setData,
}: {
  data: ISimulasi;
  setData: Function;
}) => {
  return (
    <div className="border-gray-300 pb-4">
      <div className="text-center font-bold border bg-red-500 text-gray-100 p-2 rounded">
        <p>RINCIAN BIAYA</p>
      </div>
      <div>
        <FormBiaya
          mode="horizontal"
          type="string"
          label="Biaya Asuransi"
          defaultValue={IDRFormat(
            data.DetailPengajuan.plafon *
              (data.DetailPengajuan.constInsurance / 100)
          )}
          onChange={(e: any) => console.log(e)}
          size="small"
          disabled={true}
          wLeft={52}
        />
      </div>
      <div>
        <FormBiaya
          mode="horizontal"
          type="string"
          label="Biaya Admin"
          defaultValue={IDRFormat(
            data.DetailPengajuan.plafon *
              ((data.DetailPengajuan.costAdmSumdan +
                data.DetailPengajuan.costAdmKoperasi) /
                100)
          )}
          onChange={(e: any) => console.log(e)}
          size="small"
          disabled={true}
        />
      </div>
      <div>
        <FormBiaya
          mode="horizontal"
          type="string"
          label="Biaya Tatalaksana"
          defaultValue={IDRFormat(data.DetailPengajuan.costGovernance)}
          onChange={(e: any) => console.log(e)}
          size="small"
          disabled={true}
        />
      </div>
      <div>
        <FormBiaya
          mode="horizontal"
          type="string"
          label="Biaya Tabungan"
          defaultValue={IDRFormat(data.DetailPengajuan.costAccount)}
          onChange={(e: any) => console.log(e)}
          size="small"
          disabled={true}
        />
      </div>
      <div>
        <FormBiaya
          mode="horizontal"
          type="string"
          label="Biaya Materai"
          defaultValue={IDRFormat(data.DetailPengajuan.costStamp)}
          onChange={(e: any) => console.log(e)}
          size="small"
          disabled={true}
        />
      </div>
      <div>
        <FormBiaya
          mode="horizontal"
          type="string"
          label="Biaya Provisi"
          defaultValue={IDRFormat(data.DetailPengajuan.costProvision)}
          onChange={(e: any) => console.log(e)}
          size="small"
          disabled={true}
        />
      </div>
      <div>
        <FormBiaya
          mode="horizontal"
          type="string"
          label="Biaya Mutasi"
          defaultValue={IDRFormat(data.DetailPengajuan.costMutasi)}
          onChange={(e: any) => console.log(e)}
          size="small"
          disabled={true}
        />
      </div>
      <div>
        <FormBiaya
          mode="horizontal"
          type="string"
          label="Blokir Angsuran"
          defaultValue={IDRFormat(
            data.DetailPengajuan.blokir * data.DetailPengajuan.installment
          )}
          onChange={(e: any) => {}}
          size="small"
          disabled={true}
          twoSide
          twoSidevalue={data.DetailPengajuan.blokir}
          twoSideOnChange={(e: any) =>
            setData((prev: ISimulasi) => ({
              ...prev,
              DetailPengajuan: {
                ...prev.DetailPengajuan,
                blokir: parseInt(e || "0"),
              },
            }))
          }
        />
      </div>
      <div>
        <FormBiaya
          mode="horizontal"
          type="string"
          label="Terima Kotor"
          defaultValue={(() => {
            const asuransi =
              data.DetailPengajuan.plafon *
              (data.DetailPengajuan.constInsurance / 100);
            const adm =
              data.DetailPengajuan.plafon *
              ((data.DetailPengajuan.costAdmKoperasi +
                data.DetailPengajuan.costAdmSumdan) /
                100);
            const provisi = data.DetailPengajuan.costProvision;
            const blokir =
              data.DetailPengajuan.blokir * data.DetailPengajuan.installment;
            const result =
              data.DetailPengajuan.plafon -
              (asuransi +
                adm +
                data.DetailPengajuan.costGovernance +
                data.DetailPengajuan.costAccount +
                data.DetailPengajuan.costStamp +
                data.DetailPengajuan.costMutasi +
                provisi +
                blokir);
            return IDRFormat(result);
          })()}
          onChange={(e: any) => console.log(e)}
          size="small"
          disabled={true}
        />
      </div>
      <div>
        <FormBiaya
          mode="horizontal"
          type="string"
          label="BPP"
          defaultValue={IDRFormat(data.DetailPengajuan.bpp)}
          onChange={(e: any) =>
            setData((prev: ISimulasi) => ({
              ...prev,
              DetailPengajuan: {
                ...prev.DetailPengajuan,
                bpp: IDRToNumber(e || "0"),
              },
            }))
          }
          size="small"
        />
      </div>
      <div>
        <FormBiaya
          mode="horizontal"
          type="string"
          label="Pelunasan"
          defaultValue={IDRFormat(data.DetailPengajuan.pelunasan)}
          onChange={(e: any) =>
            setData((prev: ISimulasi) => ({
              ...prev,
              DetailPengajuan: {
                ...prev.DetailPengajuan,
                pelunasan: IDRToNumber(e || "0"),
              },
            }))
          }
          size="small"
        />
      </div>
      <div>
        <FormBiaya
          mode="horizontal"
          type="string"
          label="Terima Bersih"
          defaultValue={(() => {
            const asuransi =
              data.DetailPengajuan.plafon *
              (data.DetailPengajuan.constInsurance / 100);
            const adm =
              data.DetailPengajuan.plafon *
              ((data.DetailPengajuan.costAdmKoperasi +
                data.DetailPengajuan.costAdmSumdan) /
                100);
            const provisi = data.DetailPengajuan.costProvision;
            const blokir =
              data.DetailPengajuan.blokir * data.DetailPengajuan.installment;
            const terimaKotor =
              data.DetailPengajuan.plafon -
              (asuransi +
                adm +
                data.DetailPengajuan.costGovernance +
                data.DetailPengajuan.costAccount +
                data.DetailPengajuan.costStamp +
                data.DetailPengajuan.costMutasi +
                provisi +
                blokir);
            const result =
              terimaKotor -
              (data.DetailPengajuan.bpp + data.DetailPengajuan.pelunasan);
            return IDRFormat(result);
          })()}
          onChange={(e: any) => console.log(e)}
          size="small"
          disabled={true}
        />
      </div>
      <div>
        <FormBiaya
          mode="horizontal"
          type="string"
          label="Sisa Gaji"
          defaultValue={IDRFormat(
            data.DetailPengajuan.newSalary - data.DetailPengajuan.installment
          )}
          onChange={(e: any) => console.log(e)}
          size="small"
          disabled={true}
        />
      </div>
    </div>
  );
};

export const ModalSimulasi = ({
  data,
  setData,
  user,
}: {
  data: ISimulasi;
  setData: Function;
  user: IUser;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-2 items-center">
      <Button
        danger
        size="small"
        icon={<HistoryOutlined />}
        onClick={() => setData(defaultSimulation)}
      >
        Reset
      </Button>
      <Button
        size="small"
        type="primary"
        icon={<CameraFilled />}
        onClick={() => setOpen(true)}
      >
        Snapshoot
      </Button>
      <Modal
        open={open}
        width={window.innerWidth > 600 ? "80vw" : "100vw"}
        style={{ top: 30 }}
        onCancel={() => setOpen(false)}
        footer={[
          <div
            key={"saveAndCloseSimulation"}
            className="flex justify-end gap-2"
          >
            <Button onClick={() => setOpen(false)}>Close</Button>
            <SaveModal data={data} setData={setData} user={user} />
          </div>,
        ]}
        title={
          <div className="flex flex-col justify-center items-center gap-2 text-sm font-bold text-shadow">
            <Image
              src={process.env.NEXT_PUBLIC_APP_LOGO || "/globe.svg"}
              alt="App Logo"
              width={30}
              height={30}
            />
            <p>ANALISA PERHITUNGAN</p>
          </div>
        }
      >
        <div className="flex gap-2 flex-wrap items-baseline">
          <div className="flex-1 border p-1 border-gray-300 rounded">
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 text-gray-50 font-bold italic py-1 text-center rounded">
              <p>DATA PEMBIAYAAN</p>
            </div>
            <div className="flex flex-col gap-1">
              <ItemModalSimulation
                label="Tanggal Simulasi"
                rightValue={moment(data.createdAt).format("DD/MM/YYYY")}
              />
              <ItemModalSimulation
                label="Nomor Pensiun"
                rightValue={data.nopen}
              />
              <ItemModalSimulation
                label="Nama Pemohon"
                rightValue={data.fullname}
              />
              <ItemModalSimulation
                label="Usia Masuk"
                rightValue={(() => {
                  const age = getFullAge(
                    moment(data.DetailPengajuan.birthdate).format("YYYY-MM-DD"),
                    moment().format("YYYY-MM-DD")
                  );
                  return `${age.year} Tahun ${age.month} Bulan ${age.day} Hari`;
                })()}
              />
              <ItemModalSimulation
                label="Waktu Pembiayaan"
                leftValue={moment()
                  .set("date", 28)
                  .add(1, "month")
                  .format("DD/MM/YYYY")}
                rightValue={moment()
                  .set("date", 28)
                  .add(data.DetailPengajuan.tenor + 1, "month")
                  .format("DD/MM/YYYY")}
              />
              <ItemModalSimulation
                label="Usia Lunas"
                rightValue={(() => {
                  const age = getFullAge(
                    moment(data.DetailPengajuan.birthdate).format("YYYY-MM-DD"),
                    moment()
                      .add(data.DetailPengajuan.tenor, "month")
                      .format("YYYY-MM-DD")
                  );
                  return `${age.year} Tahun ${age.month} Bulan ${age.day} Hari`;
                })()}
              />
              <ItemModalSimulation
                label="Gaji Bersih"
                rightValue={IDRFormat(data.DetailPengajuan.newSalary)}
              />
              <ItemModalSimulation
                label="Produk Pembiayaan"
                rightValue={data.DetailPengajuan.Produk.name}
              />
              <ItemModalSimulation
                label="Jenis Pembiayaan"
                rightValue={data.DetailPengajuan.Jenis.name}
              />
              <ItemModalSimulation
                label="Tenor"
                rightValue={data.DetailPengajuan.tenor + " Bulan"}
              />
              <ItemModalSimulation
                label="Plafon"
                rightValue={IDRFormat(data.DetailPengajuan.plafon)}
              />
              <ItemModalSimulation
                label="Angsuran"
                rightValue={IDRFormat(data.DetailPengajuan.installment)}
              />
              <ItemModalSimulation
                label="Sisa Gaji"
                rightValue={IDRFormat(
                  data.DetailPengajuan.newSalary -
                    data.DetailPengajuan.installment
                )}
              />
            </div>
          </div>
          <div className="flex-1 border p-1 border-gray-300 rounded">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 text-gray-50 font-bold italic py-1 text-center rounded">
              <p>RINCIAN BIAYA</p>
            </div>
            <div className="flex flex-col gap-1">
              <ItemModalSimulation
                label="Biaya Asuransi"
                rightValue={IDRFormat(
                  data.DetailPengajuan.plafon *
                    (data.DetailPengajuan.constInsurance / 100)
                )}
              />
              <ItemModalSimulation
                label="Biaya Administrasi"
                rightValue={IDRFormat(
                  data.DetailPengajuan.plafon *
                    ((data.DetailPengajuan.costAdmSumdan +
                      data.DetailPengajuan.costAdmKoperasi) /
                      100)
                )}
              />
              <ItemModalSimulation
                label="Biaya Tatalaksana"
                rightValue={IDRFormat(data.DetailPengajuan.costGovernance)}
              />
              <ItemModalSimulation
                label="Biaya Buka Rekening"
                rightValue={IDRFormat(data.DetailPengajuan.costAccount)}
              />
              <ItemModalSimulation
                label="Biaya Materai"
                rightValue={IDRFormat(data.DetailPengajuan.costStamp)}
              />
              <ItemModalSimulation
                label="Biaya Provisi"
                rightValue={IDRFormat(data.DetailPengajuan.costProvision)}
              />
              <ItemModalSimulation
                label="Biaya Mutasi"
                rightValue={IDRFormat(data.DetailPengajuan.costMutasi)}
              />
              <ItemModalSimulation
                label="Blokir Angsuran"
                leftValue={`${IDRFormat(data.DetailPengajuan.installment)} x ${
                  data.DetailPengajuan.blokir
                }`}
                rightValue={IDRFormat(
                  data.DetailPengajuan.blokir * data.DetailPengajuan.installment
                )}
              />
              <ItemModalSimulation
                label="Total Biaya"
                rightValue={(() => {
                  const asuransi =
                    data.DetailPengajuan.plafon *
                    (data.DetailPengajuan.constInsurance / 100);
                  const adm =
                    data.DetailPengajuan.plafon *
                    ((data.DetailPengajuan.costAdmKoperasi +
                      data.DetailPengajuan.costAdmSumdan) /
                      100);
                  const provisi = data.DetailPengajuan.costProvision;
                  const blokir =
                    data.DetailPengajuan.blokir *
                    data.DetailPengajuan.installment;
                  const result =
                    asuransi +
                    adm +
                    data.DetailPengajuan.costGovernance +
                    data.DetailPengajuan.costAccount +
                    data.DetailPengajuan.costStamp +
                    data.DetailPengajuan.costMutasi +
                    provisi +
                    blokir;
                  return IDRFormat(result);
                })()}
              />
              <ItemModalSimulation
                label="Terima Kotor"
                rightValue={(() => {
                  const asuransi =
                    data.DetailPengajuan.plafon *
                    (data.DetailPengajuan.constInsurance / 100);
                  const adm =
                    data.DetailPengajuan.plafon *
                    ((data.DetailPengajuan.costAdmKoperasi +
                      data.DetailPengajuan.costAdmSumdan) /
                      100);
                  const provisi = data.DetailPengajuan.costProvision;
                  const blokir =
                    data.DetailPengajuan.blokir *
                    data.DetailPengajuan.installment;
                  const result =
                    data.DetailPengajuan.plafon -
                    (asuransi +
                      adm +
                      data.DetailPengajuan.costGovernance +
                      data.DetailPengajuan.costAccount +
                      data.DetailPengajuan.costStamp +
                      data.DetailPengajuan.costMutasi +
                      provisi +
                      blokir);
                  return IDRFormat(result);
                })()}
              />
              <ItemModalSimulation
                label="BPP"
                rightValue={IDRFormat(data.DetailPengajuan.bpp)}
              />
              <ItemModalSimulation
                label="Pelunasan"
                rightValue={IDRFormat(data.DetailPengajuan.pelunasan)}
              />
              <ItemModalSimulation
                label="Terima Bersih"
                rightValue={(() => {
                  const asuransi =
                    data.DetailPengajuan.plafon *
                    (data.DetailPengajuan.constInsurance / 100);
                  const adm =
                    data.DetailPengajuan.plafon *
                    ((data.DetailPengajuan.costAdmKoperasi +
                      data.DetailPengajuan.costAdmSumdan) /
                      100);
                  const provisi = data.DetailPengajuan.costProvision;
                  const blokir =
                    data.DetailPengajuan.blokir *
                    data.DetailPengajuan.installment;
                  const terimaKotor =
                    data.DetailPengajuan.plafon -
                    (asuransi +
                      adm +
                      data.DetailPengajuan.costGovernance +
                      data.DetailPengajuan.costAccount +
                      data.DetailPengajuan.costStamp +
                      data.DetailPengajuan.costMutasi +
                      provisi +
                      blokir);
                  const result =
                    terimaKotor -
                    (data.DetailPengajuan.bpp + data.DetailPengajuan.pelunasan);
                  return IDRFormat(result);
                })()}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

interface IPengajuan extends Pengajuan {
  DetailPengajuan: DetailPengajuan;
}

const SaveModal = ({
  data,
  setData,
  user,
}: {
  data: ISimulasi;
  setData: Function;
  user: IUser;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const statusStatus = [
    {
      label: "SIMPAN",
      desc: "Data disimpan pada menu simulasi, tidak langsung ke Verifikasi",
      value: StatusPengajuan.SIMULASI,
    },
    {
      label: "PENDING",
      desc: "Data diajukan ke verifikasi, tapi status masih di MOC (Perlengkapan Berkas)",
      value: StatusPengajuan.PENDING,
    },
  ];

  return (
    <div>
      <Button
        key={"saveSimulation"}
        type="primary"
        icon={<SaveFilled />}
        onClick={() => setOpen(true)}
        disabled={!data.nopen || !data.fullname || !data.DetailPengajuan.plafon}
        loading={loading}
      >
        Simpan
      </Button>
      <Modal
        open={open}
        title="SIMPAN SIMULASI"
        onCancel={() => setOpen(false)}
        footer={[
          <Button
            key={"cancelSimulation"}
            danger
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>,
          <Button
            key={"saveSimulation"}
            type="primary"
            onClick={() => console.log(data)}
          >
            Simpan
          </Button>,
        ]}
        loading={loading}
      >
        <div className="my-2">
          <FormInput
            type="string"
            label="Nama Pemohon"
            mode="horizontal"
            defaultValue={data.fullname}
            onChange={(e: any) => {}}
            size="small"
            disabled={true}
            required
          />
          <FormInput
            type="string"
            label="Nopen Pemohon"
            mode="horizontal"
            defaultValue={data.nopen}
            onChange={(e: any) => {}}
            size="small"
            disabled={true}
            required
          />
          <FormOption
            type="string"
            label="Status"
            mode="horizontal"
            defaultValue={data.status}
            options={statusStatus.map((s) => ({
              label: s.label,
              value: s.value,
            }))}
            onChange={(e: any) =>
              setData((prev: ISimulasi) => ({ ...prev, status: e }))
            }
            size="small"
            disabled={true}
            required
          />
          <FormInput
            type="string"
            label="Keterangan"
            defaultValue={""}
            mode="horizontal"
            onChange={(e: any) => {}}
            size="small"
            required
          />
          <FormInput
            type="string"
            label="Pembuat"
            mode="horizontal"
            defaultValue={user.fullname}
            onChange={(e: any) => {}}
            size="small"
            disabled
            required
          />
          <FormInput
            type="string"
            label="Coordinates"
            mode="horizontal"
            defaultValue={`${user.lat},${user.lng}`}
            onChange={(e: any) => {}}
            size="small"
            disabled
            required
          />
        </div>
        <div className="border border-green-500 p-1 rounded">
          <p className="font-bold text-green-500">INFO :</p>
          <ul className="text-xs italic">
            {statusStatus.map((s) => (
              <li
                className="flex gap-1 border-b border-gray-200 items-center"
                key={s.value}
              >
                <p className="w-24 font-bold text-blue-500">{s.label}</p>
                <p>{s.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
};

const defaultSimulation: ISimulasi = {
  id: "",
  nopen: "",
  nik: "",
  fullname: "",
  verifStatus: null,
  verifDesc: null,
  verifDate: null,
  slikStatus: null,
  slikDesc: null,
  slikDate: null,
  approvStatus: null,
  approvDesc: null,
  approvDate: null,

  transferStatus: null,
  transferDate: null,

  status: "SIMULASI",
  statusPaid: false,
  isActive: true,
  createdAt: new Date(new Date().setDate(28)),
  updatedAt: new Date(),
  usersId: "",
  maxTenor: 0,
  maxPlafon: 0,
  flaggingId: null,
  DetailPengajuan: {
    id: "",
    birthdate: new Date(),
    oldSalary: 0,
    newSalary: 0,
    plafon: 0,
    tenor: 0,
    marginKoperasi: 0,
    marginSumdan: 0,
    constInsurance: 0,
    costAdmSumdan: 0,
    costAdmKoperasi: 0,
    costGovernance: 0,
    costStamp: 0,
    costAccount: 0,
    costProvision: 0,
    installment: 0,
    costMutasi: 0,
    blokir: 0,
    rounded: 0,
    bpp: 0,
    pelunasan: 0,
    jenisMargin: "ANUITAS",
    produkId: "",
    jenisId: "",
    usersId: null,

    Produk: {
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
      jenisMargin: "ANUITAS",

      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      sumdanId: "",
      Sumdan: {
        id: "",
        name: "",
        code: "",
        logo: "",
        maxInstallment: 90,
        rounded: 0,
        skAkad: "",

        sumdanType: SumdanType.CHANNELLING,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    Jenis: {
      id: "",
      name: "",
      costMutasi: 0,
      blokir: 0,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
};
