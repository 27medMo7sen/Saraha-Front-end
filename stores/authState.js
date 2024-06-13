import { reactive } from "vue";
import Cookies from "js-cookie";
export const authState = reactive({
  username: "",
  searchUsername: "",
  userId: "",
  firstname: "",
  searchResultsArr: [],
  loading: true,
  activeLink: null,
  token: Cookies.get("userToken"),
});

export function setAuthState(data) {
  authState.username = data.username;
  authState.userId = data.userId;
  authState.firstname = data.firstname;
  authState.token = data.token;
}

export function clearAuthState() {
  authState.username = "";
  authState.userId = "";
  authState.firstname = "";
  authState.token = "";
}
