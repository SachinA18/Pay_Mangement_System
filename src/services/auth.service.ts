import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase.config";

const auth = getAuth(app);

export function setAuthorizationToken() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      user.getIdToken().then((token) => {
        localStorage.setItem("jwt", token);
      });
    } else {
      localStorage.removeItem("jwt");
    }
  });
}

export function isRouteAuthorized(prop: any) {
  const role = sessionStorage.getItem("Role");

  if (prop.layout === "All") {
    return true;
  }
  if (prop.layout === role && role === "Supervisor") {
    return true;
  }
  if (prop.layout === role && role === "Teller") {
    return (
      prop.name === "Shift" || prop.name === "Reports" || sessionStorage.getItem("ShiftId")
    );
  }
  return false;
}

export function setSession(user: any) {
  if (user) {
    localStorage.setItem("userId", user.uid);
    localStorage.setItem("email", user.email || "");
    user.getIdTokenResult().then((idTokenResult: any) => {
      localStorage.setItem("role", idTokenResult.claims.role || "");
      localStorage.setItem("tenantId", idTokenResult.claims.tenantId || "");
      localStorage.setItem("firstName", idTokenResult.claims.firstName || "");
      localStorage.setItem("lastName", idTokenResult.claims.lastName || "");
    });
  } else {
    localStorage.clear();
  }
}

export async function logout() {
  await signOut(auth);
  localStorage.clear();
}