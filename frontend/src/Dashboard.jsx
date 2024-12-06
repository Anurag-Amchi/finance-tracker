import { Chart } from "primereact/chart";
import React, { useEffect, useRef, useState } from "react";
import Range from "./Range";
import { Toast } from "primereact/toast";
import Loader from "./Loader";

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date("2020-01-01T00:00:00.000Z"));
  const [endDate, setEndDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const toast = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const getTransactions = (data) => {
    return [...(data || [])].map((d) => {
      d.timestamp = new Date(d.timestamp);
      return d;
    });
  };

  useEffect(() => {
    setIsLoading(true);
    const loadInit = async () => {
      try {
        const res = await fetch("/txns", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.err) {
          toast.current.show({severity:'error', summary: "Error !", detail:data.err, life: 1000});
        } else {
          setTransactions(getTransactions(data.txns).sort((a, b) => {return new Date(a.timestamp) - new Date(b.timestamp)}));
        }
      } catch (err) {console.log(err);}
    };
    setIsLoading(false);
    return loadInit;
  }, []);

  useEffect(() => {
    setTransactions(prev => prev
                .filter((transaction) => (transaction.timestamp >= startDate && transaction.timestamp <= endDate))
                .sort((a, b) => {return new Date(a.timestamp) - new Date(b.timestamp)})
    );
  }, [endDate, startDate]);

  const incomes = transactions.filter((transaction) => transaction.type === "INCOME");
  const expenses = transactions.filter((transaction) => transaction.type === "EXPENSE");

  const totalIncome = incomes.reduce((total, transaction) => total + transaction.amount, 0);
  const totalExpense = expenses.reduce((total, transaction) => total + transaction.amount, 0);

  let maxIncomeBalance = 0;
  let minIncomeBalance = 0;
  let maxExpenseBalance = 0;
  let minExpenseBalance = 0;
  if (incomes.length > 0) {
    minIncomeBalance = Infinity;
    maxIncomeBalance = -Infinity;
  }
  if (expenses.length > 0){
    minExpenseBalance = Infinity;
    maxExpenseBalance = -Infinity;
  }

  transactions.forEach((transaction) => {
    if (transaction.type === "INCOME") {
      maxIncomeBalance = Math.max(maxIncomeBalance, transaction.amount);
      minIncomeBalance = Math.min(minIncomeBalance, transaction.amount);
    } else if (transaction.type === "EXPENSE") {
      maxExpenseBalance = Math.max(maxExpenseBalance, transaction.amount);
      minExpenseBalance = Math.min(minExpenseBalance, transaction.amount);
    }
  });
  const barData = {
    labels: ["Total Income (in ₹)", "Total Expense (in ₹)"],
    datasets: [
      {
        label: ["Total Accounts (in ₹)"],
        data: [totalIncome, totalExpense],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const donutData = {
    labels: ["Total Income (in ₹)", "Total Expense (in ₹)"],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const intervalData = {};

  transactions.forEach((transaction) => {
    const timestamp = new Date(transaction.timestamp);
    const intervalKey = `${timestamp.getFullYear()}-${timestamp.getMonth() + 1}`; // Adjust this based on your timeInterval choice
    if (!intervalData[intervalKey]) {
      intervalData[intervalKey] = { income: 0, expense: 0 };
    }
    if (transaction.type === "INCOME") {
      intervalData[intervalKey].income += transaction.amount;
    } else if (transaction.type === "EXPENSE") {
      intervalData[intervalKey].expense += transaction.amount;
    }
  });

  // Step 4: Plot the Data
  const labels = Object.keys(intervalData);
  const incomeDataLine = labels.map((label) => ({
    x: label,
    y: intervalData[label].income,
  }));
  const expenseDataLine = labels.map((label) => ({
    x: label,
    y: intervalData[label].expense,
  }));

  const lineData = {
    labels: labels,
    datasets: [
      {
        type: "line",
        label: "INCOME",
        borderColor: "#007ad9",
        backgroundColor: "#007ad9",
        data: incomeDataLine,
        tension: 0.15,
      },
      {
        type: "line",
        label: "EXPENSE",
        borderColor: "#FF0000",
        backgroundColor: "#FF0000",
        data: expenseDataLine,
        tension: 0.15,
      },
    ],
  };

  const twoBarData = {
    labels: labels,
    datasets: [
      {
        type: "bar",
        label: "INCOME",
        borderColor: "#007ad9",
        backgroundColor: "#007ad9",
        data: incomeDataLine,
      },
      {
        type: "bar",
        label: "EXPENSE",
        borderColor: "#FF0000",
        backgroundColor: "#FF0000",
        data: expenseDataLine,
      },
    ],
  };
  const combinedData = {
    labels: labels,
    datasets: [
      {
        type: "bar",
        label: "INCOME",
        borderColor: "#36A2EB",
        backgroundColor: "#36A2EB",
        data: incomeDataLine,
      },
      {
        type: "bar",
        label: "EXPENSE",
        borderColor: "#FF6384",
        backgroundColor: "#FF6384",
        data: expenseDataLine,
      },
      {
        type: "line",
        label: "INCOME",
        borderColor: "#007ad9",
        backgroundColor: "#007ad9",
        data: incomeDataLine,
        tension: 0.15,
      },
      {
        type: "line",
        label: "EXPENSE",
        borderColor: "#FF0000",
        backgroundColor: "#FF0000",
        data: expenseDataLine,
        tension: 0.15,
      },
    ],
  };
  return (
  <>
    <Toast ref={toast} position="top-center" />
    {isLoading
    ?(<Loader/>)
    :(<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div>
        <h1 style={{textAlign: "center", color:"#6366f1"}}>Dashboard</h1>
        <Range
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        startDate={startDate}
        endDate={endDate}
        />
        <span
        className="flex justify-content-between"
        style={{ fontWeight: "bold" }}
        >
        <span
          style={{
          width: "45%",
          backgroundColor: "#f5f5f5",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          border: "1px solid #ddd",
          borderRadius: "10px",
          }}
        >
          <span
          className="flex justify-content-between"
          style={{ color: "#009933", fontSize: "25px" }}
          >
          <span className="m-2">MIN</span>
          <span className="m-2">Income</span>
          <span className="m-2">MAX</span>
          </span>
          <span
          className="flex justify-content-between"
          style={{ color: "#00E64D" }}
          >
          <span className="m-2">+ {`₹ ${minIncomeBalance}`}</span>
          <span className="m-2">+ {`₹ ${maxIncomeBalance}`}</span>
          </span>
        </span>
        <span
          style={{
          width: "45%",
          backgroundColor: "#f5f5f5",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          border: "1px solid #ddd",
          borderRadius: "10px",
          }}
        >
          <span
          className="flex justify-content-between"
          style={{ color: "#FF0000", fontSize: "25px" }}
          >
          <span className="m-2">MIN</span>
          <span className="m-2">Expense</span>
          <span className="m-2">MAX</span>
          </span>
          <span
          className="flex justify-content-between"
          style={{ color: "#FF8282" }}
          >
          <span className="m-2">- {`₹ ${minExpenseBalance}`}</span>
          <span className="m-2">- {`₹ ${maxExpenseBalance}`}</span>
          </span>
        </span>
        </span>

        <span
        className="flex justify-content-between"
        style={{  marginTop: "10px", fontWeight: "bold" }}
        >
        <span
          style={{
          margin: "5px",
          backgroundColor: "#f5f5f5",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          border: "1px solid #ddd",
          borderRadius: "10px",
          }}
        >
          <span className="m-2" style={{ color: "#009933", fontSize: "25px" }}>
          Total Income :
          </span>
          <span className="m-2" style={{ color: "#00E64D", fontSize: "15x" }}>
          + {`₹ ${totalIncome}`}
          </span>
        </span>
        <span
          style={{
          margin: "5px",
          backgroundColor: "#f5f5f5",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          border: "1px solid #ddd",
          borderRadius: "10px",
          }}
        >
          <span className="m-2" style={{ color: "#FF0000", fontSize: "25px" }}>
          Total Expense :
          </span>
          <span className="m-2" style={{ color: "#FF8282", fontSize: "15x" }}>
          - {`₹ ${totalExpense}`}
          </span>
        </span>
        <span
          style={{
          margin: "5px",
          backgroundColor: "#f5f5f5",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          border: "1px solid #ddd",
          borderRadius: "10px",
          }}
        >
          <span className="m-2" style={{ color: "#6366f1", fontSize: "25px" }}>
          Net Balance :
          </span>
          <span
          className="m-2"
          style={{ color: "#8A8BF5", fontSize: "15x" }}
          >{`₹ ${totalIncome - totalExpense}`}</span>
        </span>
        </span>
        <span style={{ width: "40%", fontWeight: "bold" }}>
        <h2 style={{ color: "#6366f1" }}>Transaction History</h2>
        {transactions.length === 0 ? (
          <h1>No Data</h1>
        ) : (
          <ul style={{ listStyleType: "none", padding: 0 }}>
          {transactions
            .slice(-5)
            .reverse()
            .map((transaction) => {
            let spanColor = "#6366f1";
            if (transaction.type === "INCOME") {
              spanColor = "green";
            } else if (transaction.type === "EXPENSE") {
              spanColor = "red";
            }
            return (
              <li
              key={transaction.id}
              style={{
                backgroundColor: "#f5f5f5",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "10px",
                margin: "5px 0",
                display: "flex",
                justifyContent: "space-between",
                color: spanColor,
              }}
              >
              <span>{transaction.title}</span>
              <span>₹ {transaction.amount}</span>
              </li>
            );
            })}
          </ul>
        )}
        </span>
        {transactions.length === 0 ? (
        <></>
        ) : (<>
        <div style={{display: "flex", marginY: "10px"}}>
          <Chart type="bar" data={barData} style={{width: "65%", height: "65%", marginY: "20px"}}/>
          <Chart type="doughnut" data={donutData} />
        </div>
          <Chart type="line" data={lineData} style={{marginY: "10px"}}/>
          <Chart type="line" data={twoBarData} />
          <Chart type="line" data={combinedData} />
        </>
        )}
      </div>
    </div>)}
  </>
  );
};

export default Dashboard;
