import React, { useRef, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { Link } from "react-router-dom";
import LogoutButton from "./Logout";
import { Toast } from "primereact/toast";

const MySidebar = () => {
  const toast = useRef(null);

  const [visibleBar, setVisibleBar] = useState(false);
  const [visibleLimitDialog, setVisibleLimitDialog] = useState(false);
  const [val, setVal] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const saveLimit = async () => {
    setSubmitted(true);
    if(val > 0){
      const res = await fetch("/user/setLimit", {
        method: "PATCH",
        body: JSON.stringify({limit : val}),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.err) {
        toast.current.show({severity:'error', summary: 'Error !', detail:data.err, life: 1000});
      }
      else if (data.message) {
        toast.current.show({severity:'success', summary: 'Success !', detail:data.message, life: 1000});
      }
      setVal(0);
      setSubmitted(false);
      setVisibleLimitDialog(false);
      return;
    }
  }

  const hideDialog = () => {
    setVal(0);
    setSubmitted(false);
    setVisibleLimitDialog(false);
  };

  const limitDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveLimit} />
    </>
  );

  const onInputNumberChange = (e) => {
    setVal(e.value);
  };

  return (
    <>
      <Toast ref={toast} position="top-center" />
      <div className="flex justify-content-between">
        <div>
          <Button icon="pi pi-bars" onClick={() => setVisibleBar(true)} />
          <Link to="/" style={{textDecoration: "none"}}>
            <span className="font-semibold text-4xl text-primary mx-4">
            FìNT₹AX
            </span>
          </Link>
        </div>

        <Button
          label="Set limit"
          icon="pi pi-file-edit"
          onClick={() => setVisibleLimitDialog(true)}
        />
      </div>
      <Dialog
        visible={visibleLimitDialog}
        className="p-fluid"
        header="Set Expenses Limit"
        modal
        footer={limitDialogFooter}
        onHide={() => setVisibleLimitDialog(false)}
      >
        <div className="field">
          <label htmlFor="amount" className="font-bold">
            Amount
          </label>
          <InputNumber
            id="amount"
            value={val}
            onValueChange={(e) => onInputNumberChange(e)}
            mode="currency"
            currency="INR"
            locale="en-US"
            required
          />
          {submitted && val <= 0 && (
            <small className="p-error">Positive amount is required.</small>
          )}
        </div>
      </Dialog>
      <Sidebar
        visible={visibleBar}
        onHide={() => setVisibleBar(false)}
        content={({ closeIconRef, hide }) => (
          <>
            <div className="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0">
            <Link to="/" style={{textDecoration: "none"}}>
              <span className="font-semibold text-2xl text-primary">
                FìNT₹AX
              </span>
              </Link>
              <span>
                <Button
                  type="button"
                  ref={closeIconRef}
                  onClick={(e) => hide(e)}
                  icon="pi pi-times"
                  rounded
                  outlined
                  className="h-2rem w-2rem"
                ></Button>
              </span>
            </div>
            <div className="overflow-y-auto list-none p-3 m-0 ">
              <ul className="list-none p-0 m-0 overflow-hidden">
                <li>
                  <Link
                    to="/home"
                    className="no-underline flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                  >
                    <i className="pi pi-home mr-2"></i>
                    <span className="font-medium">Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/detail"
                    className="no-underline flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                  >
                    <i className="pi pi-chart-bar mr-2"></i>
                    <span className="font-medium">Details</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/income"
                    className="no-underline flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                  >
                    <i className="pi pi-money-bill mr-2"></i>
                    <span className="font-medium">Incomes</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/expense"
                    className="no-underline flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                  >
                    <i className="pi pi-shopping-cart mr-2"></i>
                    <span className="font-medium">Expenses</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="mt-auto">
              <div className="m-3 flex justify-content-between align-items-center p-3 gap-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors">
                <Avatar label="A" shape="circle" />
                <span className="font-bold">userName</span>
                <LogoutButton/>
              </div>
            </div>
          </>
        )}
      ></Sidebar>
    </>
  );
}

export default MySidebar;