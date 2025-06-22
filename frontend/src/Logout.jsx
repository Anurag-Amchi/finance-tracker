import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();
  const toast = useRef(null);

  return (
    <>
    <Toast ref={toast} position="top-center" />
    <Button
      icon="pi pi-sign-out"
      className="p-button-outlined p-button-secondary"
      onClick={async () => {
        try {
          const response = await fetch(
            "https://finance-tracker-production-348a.up.railway.app/logout",
            {
              method: "GET",
            }
          );
          if (!response.ok) {
            toast.current.show({severity:'error', summary: 'Error !', detail:"Logout failed", life: 1000});
          }
          navigate("/");
        } catch (error) {
          console.error("Logout error:", error.message);
        }
      }}
    >
    </Button>
    </>
  );
};

export default LogoutButton;
