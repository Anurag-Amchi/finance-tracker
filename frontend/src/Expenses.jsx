import React, { useEffect, useRef, useState } from "react";
import Table from "./Table";
import { Toast } from "primereact/toast";
import Loader from './Loader';

function Expenses() {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useRef(null);
    const [transactions, setTransactions] = useState([]);
    useEffect(() => {
        setIsLoading(true);
        const loadInit = async () => {
          try {
            const res = await fetch("/txns?type=EXPENSE", {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (data.err) {
                toast.current.show({severity:'error', summary: "Error !", detail:data.err, life: 1000});
            } else {
                setTransactions(data.txns);
            }
          } catch (err) {console.log(err);}
        };
        setIsLoading(false);
        return loadInit;
    }, []);

    return (
        <>
        <Toast ref={toast} position="top-center" />
        {isLoading?(<Loader/>):(<>
            <h1 style={{textAlign: "center", color:"#6366f1"}}>Expense Details</h1>
            <Table data={transactions} />
        </>)}
        
        </>
    );
}

export default Expenses;