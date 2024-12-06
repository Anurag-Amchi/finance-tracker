import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { RadioButton } from 'primereact/radiobutton';
import { Calendar } from 'primereact/calendar';

const NewEnterDialog = (props) => {
    let newTransaction = {
        title: '',
        description: '',
        type: null,
        timestamp: new Date(),
        amount: 0
    };
    
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const [transaction, setTransaction] = useState(newTransaction);
    
    const hideDialog = () => {
        setTransaction(newTransaction);
        setSubmitted(false);
        props.setTransactionDialog(false);
    };

    const saveTransaction = async () => {
        setSubmitted(true);

        if (transaction.title.trim() && transaction.type && transaction.amount>0) {
            let _transactions = [...props.transactions];
            let _transaction = { ...transaction };
            console.log(_transaction)
            try {
                const res = await fetch("/txns/", {
                  method: "POST",
                  body: JSON.stringify(_transaction),
                  headers: { "Content-Type": "application/json" },
                });
                const data = await res.json();
                if (data.err) {
                  toast.current.show({severity:'error', summary: 'Error !', detail:data.err, life: 1000});
                }
                if (data.message) {
                  toast.current.show({severity:'success', summary: 'Success !', detail:data.message, life: 1000});
                  _transactions.push(_transaction);
                }
              } catch (err) {
                console.log(err);
              }
            
            props.setTransactions(_transactions);
            props.setTransactionDialog(false);
            setTransaction(newTransaction);
            setSubmitted(false);
        }
    };

    const onCategoryChange = (e) => {
        let _transaction = { ...transaction };

        _transaction['type'] = e.value;
        setTransaction(_transaction);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _transaction = { ...transaction };

        _transaction[`${name}`] = val;

        setTransaction(_transaction);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _transaction = { ...transaction };

        _transaction[`${name}`] = val;

        setTransaction(_transaction);
    };

    const onDateChange = (e) => {
        const value = e.target.value;
        let _transaction = { ...transaction };
    
        _transaction['timestamp'] = value;
    
        setTransaction(_transaction);
    };
    
    const transactionDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveTransaction} />
        </>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog visible={props.transactionDialog} header="Transaction Details" modal className="p-fluid" footer={transactionDialogFooter} onHide={hideDialog}>
            <div className="field">
                <label htmlFor="title" className="font-bold">
                    Title
                </label>
                <InputText id="title" value={transaction.title} onChange={(e) => onInputChange(e, 'title')} required  />
                {submitted && !transaction.title && <small className="p-error">Title is required.</small>}
            </div>
            <div className="field">
                <label htmlFor="description" className="font-bold">
                    Description
                </label>
                <InputText id="description" value={transaction.description} onChange={(e) => onInputChange(e, 'description')}/>
            </div>
            <div className="field">
                <label className="font-bold">Type</label>
                <div className="formgrid grid">
                    <div className="field-radiobutton col-6" >
                        <RadioButton inputId="category1" name="type" value="INCOME" onChange={onCategoryChange} checked={transaction.type === 'INCOME'} />
                        <label htmlFor="category1">INCOME</label>
                    </div>
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="category2" name="type" value="EXPENSE" onChange={onCategoryChange} checked={transaction.type === 'EXPENSE'} />
                        <label htmlFor="category2">EXPENSE</label>
                    </div>
                </div>
                {submitted && !transaction.type && <small className="p-error">Please select an option.</small>}
            </div>
            <div className="field">
                <label htmlFor="amount" className="font-bold">
                    Amount
                </label>
                <InputNumber id="amount" value={transaction.amount} onValueChange={(e) => onInputNumberChange(e, 'amount')} mode="currency" currency="INR" locale="en-US" required  />
                {submitted && (transaction.amount<=0) && <small className="p-error">Positive amount is required.</small>}
            </div>
            <div className="field">
                <label htmlFor="timestamp" className="font-bold">
                    DateTime
                </label>
                <Calendar
                    id="timestamp"
                    value={transaction.timestamp}
                    onChange={(e) => onDateChange(e)}
                    showTime
                    hourFormat="12"
                    dateFormat="mm/dd/yy"
                />
            </div>
            </Dialog>
        </>
    )
}

export default NewEnterDialog
