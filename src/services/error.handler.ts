export default class ErrorHandler {
  private redirectToLogin() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userId");
    localStorage.removeItem("tenantId");

    window.location.href = "/login";
  }

  handleApiError(error: any, isAuthPage = false) {
    // Check for error response from server
    if (error.response) {
      // Handle 401 Unauthorized errors
      if (error.response.status === 401 && !isAuthPage) {
        this.redirectToLogin();
        return { message: "Session expired. Please login again." };
      }

      // The server responded with a status code outside the 2xx range
      if (error.response.data?.message) {
        return error.response.data;
      }
      // If the error response has data but no message property
      if (error.response.data) {
        return { message: error.response.data };
      }
      // If no data, check status text
      if (error.response.statusText) {
        return { message: error.response.statusText };
      }
      // For 401 errors without a specific message on auth pages
      if (error.response.status === 401 && isAuthPage) {
        return {
          message:
            "You are not authorized to perform this action. Please check your credentials.",
        };
      }
    }

    // Network error or other client-side error
    if (error.message) {
      if (error.message.includes("Network Error")) {
        return {
          message:
            "Unable to connect to the server. Please check your internet connection.",
        };
      }
      // Remove the "Request failed with status code" prefix
      if (error.message.includes("Request failed with status code")) {
        return {
          message:
            error.response?.data?.message ||
            "An error occurred while processing your request.",
        };
      }
      return { message: error.message };
    }

    return { message: "An unexpected error occurred. Please try again." };
  }
}
