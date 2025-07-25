import moment from "moment";
const { PV, PMT, EDATE } = require("@formulajs/formulajs");

export const IDRFormat = (number: number) => {
  const temp = new Intl.NumberFormat("de-DE", {
    style: "decimal",
    currency: "IDR",
  }).format(number);
  return temp;
};

export const IDRToNumber = (str: string) => {
  return parseInt(str.replace(/\D/g, ""));
};
export function toProperCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
export const AngsuranAnuitas = (
  plafond: number,
  tenor: number,
  bunga: number,
  rounded: number
) => {
  const r = bunga / 12 / 100;

  const angsuran =
    (plafond * (r * Math.pow(1 + r, tenor))) / (Math.pow(1 + r, tenor) - 1);
  const pokok = plafond / tenor;
  const margin = angsuran - pokok;

  return {
    angsuran: Math.ceil(angsuran / rounded) * rounded,
    pokok,
    margin,
  };
};

export const AngsuranFlat = (
  plafond: number,
  tenor: number,
  bunga: number,
  rounded: number
) => {
  const r = Math.ceil(bunga / 12 / 100 / 0.001) * 0.001;

  const pokok = parseInt((plafond / tenor).toString());
  const margin = parseInt((plafond * r).toString());
  const angsuran = Math.ceil((pokok + margin) / rounded) * rounded;

  return {
    angsuran: angsuran,
    pokok,
    margin,
  };
};

export function getFullAge(startDate: string, endDate: string) {
  const momentBirthdate = moment(startDate, "YYYY-MM-DD");
  const dateNow = moment(endDate);

  const durasi = moment.duration(dateNow.diff(momentBirthdate));

  const year = durasi.years();
  const month = durasi.months();
  const day = durasi.days();

  return { year, month, day };
}

export function getMaxTenor(
  max_usia: number,
  usia_tahun: number,
  usia_bulan: number
) {
  let tmp = max_usia - usia_tahun;
  const max_tenor = usia_tahun <= max_usia ? tmp * 12 - (usia_bulan + 1) : 0;
  return max_tenor;
}

export function getMaxPlafond(
  mg_bunga: number,
  tenor: number,
  max_angsuran: number
) {
  const maxPlafond = PV(mg_bunga / 100 / 12, tenor, max_angsuran, 0, 0) * -1;
  return maxPlafond;
}
