import { useEffect } from "react";
import axios from "axios";

export default function Loader() {
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const loader = document.getElementById("loader-container");
        if (loader) {
          loader.classList.remove("loader-hidden");
          loader.classList.add("loader-visible");
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        const loader = document.getElementById("loader-container");
        if (loader) {
          loader.classList.remove("loader-visible");
          loader.classList.add("loader-hidden");
        }
        return response;
      },
      (error) => {
        const loader = document.getElementById("loader-container");
        if (loader) {
          loader.classList.remove("loader-visible");
          loader.classList.add("loader-hidden");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <>
      <style>{`
        .loader-visible {
          visibility: visible;
        }
        .loader-hidden {
          visibility: hidden;
        }
      `}</style>
      <div
        id="loader-container"
        className="loader-hidden absolute w-full h-full flex align-items-center justify-content-center"
      >
        <div
          style={{
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            version="1.1"
            width="80"
            height="100"
            viewBox="0 0 80 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="10"
              y="10"
              width="60"
              height="15"
              fill="#ccc"
              stroke="none"
            />
            <g transform="translate(13, 35)">
              <rect x="0" y="0" width="14" height="14" fill="#f2f2f2">
                <animate
                  attributeName="fill"
                  values="#f2f2f2;#3498db;#f2f2f2"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </rect>
              <rect x="20" y="0" width="14" height="14" fill="#f2f2f2">
                <animate
                  attributeName="fill"
                  values="#f2f2f2;#3498db;#f2f2f2"
                  dur="1.5s"
                  begin="0.1s"
                  repeatCount="indefinite"
                />
              </rect>
              <rect x="40" y="0" width="14" height="14" fill="#f2f2f2">
                <animate
                  attributeName="fill"
                  values="#f2f2f2;#3498db;#f2f2f2"
                  dur="1.5s"
                  begin="0.2s"
                  repeatCount="indefinite"
                />
              </rect>
              <rect x="0" y="20" width="14" height="14" fill="#f2f2f2">
                <animate
                  attributeName="fill"
                  values="#f2f2f2;#3498db;#f2f2f2"
                  dur="1.5s"
                  begin="0.3s"
                  repeatCount="indefinite"
                />
              </rect>
              <rect x="20" y="20" width="14" height="14" fill="#f2f2f2">
                <animate
                  attributeName="fill"
                  values="#f2f2f2;#3498db;#f2f2f2"
                  dur="1.5s"
                  begin="0.4s"
                  repeatCount="indefinite"
                />
              </rect>
              <rect x="40" y="20" width="14" height="14" fill="#f2f2f2">
                <animate
                  attributeName="fill"
                  values="#f2f2f2;#3498db;#f2f2f2"
                  dur="1.5s"
                  begin="0.5s"
                  repeatCount="indefinite"
                />
              </rect>
              <rect x="0" y="40" width="14" height="14" fill="#f2f2f2">
                <animate
                  attributeName="fill"
                  values="#f2f2f2;#3498db;#f2f2f2"
                  dur="1.5s"
                  begin="0.6s"
                  repeatCount="indefinite"
                />
              </rect>
              <rect x="20" y="40" width="14" height="14" fill="#f2f2f2">
                <animate
                  attributeName="fill"
                  values="#f2f2f2;#3498db;#f2f2f2"
                  dur="1.5s"
                  begin="0.7s"
                  repeatCount="indefinite"
                />
              </rect>
              <rect x="40" y="40" width="14" height="14" fill="#f2f2f2">
                <animate
                  attributeName="fill"
                  values="#f2f2f2;#3498db;#f2f2f2"
                  dur="1.5s"
                  begin="0.8s"
                  repeatCount="indefinite"
                />
              </rect>
            </g>
          </svg>
          <h5 className="mt-3 text-primary">
            <strong>Loading...</strong>
          </h5>
        </div>
      </div>
    </>
  );
}
