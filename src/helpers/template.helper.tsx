export const getPascalCase = (str: string) => {
  if (str)
    return str.replace(/\w+/gu, function (w) {
      return w[0].toUpperCase() + w.slice(1).toLowerCase();
    });
  else return null;
};

export const fixedAmount = (amount: number) => {
  if (!amount || amount == null) return "0.00";
  return amount
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/gu, ",");
};

export const fixedRate = (amount: number) => {
  if (!amount || amount == null) return "0.00";
  return amount.toFixed(4);
};

interface Column {
  field: string;
}

export const templateFixDateTime = (rowData: any, column: Column) => {
  return getDatetime(rowData[column.field]);
};

export const templateFixDate = (rowData: any, column: Column) => {
  return getDate(rowData[column.field]);
};

export const getDatetime = (datetime: string) => {
  if (!datetime) return "";
  const tempDatetime = new Date(Date.parse(datetime));
  return (
    tempDatetime.getDate().toString().padStart(2, "0") +
    "/" +
    (tempDatetime.getMonth() + 1).toString().padStart(2, "0") +
    "/" +
    tempDatetime.getFullYear() +
    " " +
    tempDatetime.getHours().toString().padStart(2, "0") +
    ":" +
    tempDatetime.getMinutes().toString().padStart(2, "0") +
    ":" +
    tempDatetime.getSeconds().toString().padStart(2, "0")
  );
};

export const getDate = (datetime: string) => {
  if (!datetime) return "";
  const tempDatetime = new Date(Date.parse(datetime));
  return (
    tempDatetime.getDate() +
    "/" +
    (tempDatetime.getMonth() + 1) +
    "/" +
    tempDatetime.getFullYear()
  );
};

export const getTime = (datetime: string) => {
  if (!datetime) return "";
  const tempDatetime = new Date(Date.parse(datetime));
  return (
    tempDatetime.getHours() +
    ":" +
    tempDatetime.getMinutes() +
    ":" +
    tempDatetime.getSeconds()
  );
};

export const getJsonDatetime = (datetime: string) => {
  if (!datetime) return "";
  const tempDatetime = new Date(datetime);
  return (
    tempDatetime.toDateString() +
    " " +
    tempDatetime.getHours().toString().padStart(2, "0") +
    ":" +
    tempDatetime.getMinutes().toString().padStart(2, "0") +
    ":" +
    tempDatetime.getSeconds().toString().padStart(2, "0")
  );
};
