import React, { useEffect, useState } from "react";

const PWAUpdater: React.FC = () => {
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);

  useEffect(() => {
    // Registrar o service worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registrado:", registration);

            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (
                    newWorker.state === "installed" &&
                    navigator.serviceWorker.controller
                  ) {
                    setShowUpdateAlert(true);
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.error("Erro no registro do SW:", error);
          });
      });
    }
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  if (!showUpdateAlert) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 z-50">
      <p className="mb-2">Nova versão disponível!</p>
      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Atualizar agora
      </button>
    </div>
  );
};

export default PWAUpdater;
