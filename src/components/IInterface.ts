import {
  Area,
  DetailPengajuan,
  Jenis,
  Pengajuan,
  Produk,
  Role,
  StatusPengajuan,
  Sumdan,
  Unit,
  Users,
} from "@prisma/client";

export interface IUser {
  id: string;
  fullname: string;
  username: string;
  email: string;
  phone: string;
  position: string;
  role: Role;
  lat: number;
  lng: number;
  location: string;
}

export interface INotif {
  simulation: number;
  verif: number;
  slik: number;
  approv: number;
  akad: number;
  si: number;
}

interface IOption {
  label: any;
  value: any;
}
interface ISelectOption {
  label: any;
  value: any;
  options?: IOption[];
}
export interface IFormInput {
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  onChange: Function;
  options?: ISelectOption[];
  disabled?: boolean;
  mode?: "horizontal" | "vertical";
  type?: "number" | "date" | "string";
  size?: "small" | "large" | "middle";
  suffix?: any;
  prefix?: any;
  wLeft?: number;
  twoSide?: boolean;
  twoSidevalue?: any;
  twoSideOnChange?: Function;
}
export interface IFormUpload {
  label: string;
  defaultValue?: any;
  onChange: Function;
}

export interface IInputList {
  label: string;
  name: string;
  type: "number" | "date" | "string" | "option";
  options?: ISelectOption[];
}

export interface IProduk extends Produk {
  Sumdan: Sumdan;
}

export interface IUnit extends Unit {
  Area: Area;
}

interface IDetailPengajuan extends DetailPengajuan {
  Produk: IProduk;
  Jenis: Jenis;
}

export interface ISimulasi extends Pengajuan {
  DetailPengajuan: IDetailPengajuan;
  maxTenor: number;
  maxPlafon: number;
}

export interface IPengajuan extends Pengajuan {
  DetailPengajuan: IDetailPengajuan;
}
export interface IDataPengajuan extends Pengajuan {
  DetailPengajuan: IDetailPengajuan;
  Users: Users;
}

export interface IProccesPengajuan {
  status: StatusPengajuan;
  desc: string;
  user: string;
  time: string;
}
