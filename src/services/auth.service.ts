import axios from "axios";

export function setAuthorizationToken() {
  const token = localStorage.getItem("jwt");

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.defaults.headers.common["Accept"] = `application/json`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}

export function isRouteAuthorized(prop: any) {
  if (prop.layout === "All") {
    return true;
  }
  if (
    prop.layout === sessionStorage.Role &&
    sessionStorage.Role === "Supervisor"
  ) {
    return true;
  }
  if (prop.layout === sessionStorage.Role && sessionStorage.Role === "Teller") {
    return (
      prop.name === "Shift" || prop.name === "Reports" || sessionStorage.ShiftId
    );
  }
  return false;
}

export function setSession(jwt: any) {
  localStorage.setItem("jwt", jwt);

  const claims = parseJwt(jwt);

  localStorage.setItem("userId", claims.UserId);
  localStorage.setItem("role", claims.Role || "");
  localStorage.setItem("tenantId", claims.TenantId);
  localStorage.setItem("firstName", claims.FirstName || "");
  localStorage.setItem("lastName", claims.LastName || "");
  localStorage.setItem("email", claims.Email || "");
}

function parseJwt(token: any) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/gu, "+").replace(/_/gu, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}
