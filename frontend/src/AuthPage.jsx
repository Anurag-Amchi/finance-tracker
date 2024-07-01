import React, { useState } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import Signup from './Signup';
import Login from './Login';

const AuthPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const menuItems = [
    { label: 'Login', icon: 'pi pi-sign-in' },
    { label: 'Signup', icon: 'pi pi-user-plus' }
  ];

  const handleTabChange = (e) => {
    setActiveIndex(e.index);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h1 style={{fontSize: "40px", fontWeight: "900"}}>FìNT₹AX</h1>
        <TabMenu model={menuItems} activeIndex={activeIndex} onTabChange={handleTabChange} />
        <div className="container">
            {activeIndex === 0 && <Login />}
            {activeIndex === 1 && <Signup />}
        </div>
    </div>
  );
};

export default AuthPage;
