import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

const Signup = () => {
  const toast = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if (password !== confirmPassword) {
      toast.current.show({severity:'error', summary: 'Error !', detail:"Password and confirm password must match !", life: 1000});
    } else {
      try {
        const res = await fetch(
          "https://finance-tracker-production-348a.up.railway.app/user/signup",
          {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await res.json();
        if (data.err) {
          toast.current.show({severity:'error', summary: 'Error !', detail:data.err, life: 1000});
        }
        if (data.errors) {
          for (let i = 0; i < data.errors.length; i++) {
            const el = data.errors[i];
            setTimeout(() => {
              toast.current.show({severity:'error', summary: 'Error !', detail:el.msg, life: 1000});
            }, i * 250);
          }
        }
        if (data.email) {
          toast.current.show({severity:'success', summary: 'Signed Up !', detail:`Welcome here, ${data.name}`, life: 1000});
          setTimeout(() => {
            window.location.assign("/home");
          }, 500);
        }
      } catch (err) {
        console.log(err);
      }
    }
    
    setLoading(false);
  };
  return (
    <>
    <Toast ref={toast} position="top-center" />
    <div className="p-fluid" >
    <div className="p-inputgroup flex-1 my-2">
        <span className="p-inputgroup-addon"><i className="pi pi-user"></i></span>
        <InputText value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" />
    </div>
    <div className="p-inputgroup flex-1 my-2">
        <span className="p-inputgroup-addon"><i className="pi pi-envelope"></i></span>
        <InputText value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" />
    </div>
    <div className="p-inputgroup flex-1 my-2">
        <span className="p-inputgroup-addon"><i className="pi pi-lock"></i></span>
        <Password value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" toggleMask feedback={false}/>
    </div>
    <div className="p-inputgroup flex-1 my-2">
        <span className="p-inputgroup-addon"><i className="pi pi-lock"></i></span>
        <Password value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" toggleMask feedback={false} />
    </div>
    <Button label="Submit" loading={isLoading} onClick={handleSubmit} type="submit" icon="pi pi-check" />
    </div>
    </>
    
  );
};

export default Signup;
