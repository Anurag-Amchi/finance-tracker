import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';
import NewEnterDialog from './NewEnterDialog';
import { Toast } from "primereact/toast";

export default function Table(props) {
    const [transactions, setTransactions] = useState([]);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [statuses] = useState(['EXPENSE', 'INCOME']);
    const [transactionDialog, setTransactionDialog] = useState(false);
    const toast = useRef(null);

    const getSeverity = (type) => {
        switch (type) {
            case 'EXPENSE':
                return 'danger';
    
            case 'INCOME':
                return 'success';
    
            default:
                return '';
        }
    };
    
    useEffect(() => {
        setTransactions(props.data);
        initFilters();
    }, [props.data]);

    const formatDate = (value) => {
        return value.toLocaleString('en-US');
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'INR' });
    };

    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            title: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            timestamp: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            amount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            type: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        });
        setGlobalFilterValue('');
    };
    
    const openNew = () => {
        setTransactionDialog(true);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <Button label="New" icon="pi pi-plus" onClick={openNew} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.timestamp);
    };

    const dateFilterTemplate = (options) => {
        return <Calendar 
            value={options.value} 
            onChange={(e) => options.filterCallback(e.value, options.index)}
            showTime
            hourFormat="12"  
            dateFormat="dd/mm/yy" 
            placeholder="dd/mm/yyyy hh:mm "
        />;
    };

    const balanceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.amount);
    };

    const balanceFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="INR" locale="en-US" />;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.type} severity={getSeverity(rowData.type)} />;
    };

    const statusFilterTemplate = (options) => {
        return<Dropdown 
            value={options.value} 
            options={statuses} 
            onChange={(e) => options.filterCallback(e.value, options.index)} 
            itemTemplate={statusItemTemplate} 
            placeholder="Select One" 
            className="p-column-filter" 
            showClear 
        />
    };

    const statusItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const header = renderHeader();

    const onRowEditComplete = async (e) => {
        const _transactions = [...transactions];
        const { newData, index } = e;
        _transactions[index] = newData;
        try{
            const response = await fetch(`https://finance-tracker-eqoj.onrender.com/txns/${newData._id}`, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(newData),
            });
            if (!response.ok) {
                toast.current.show({severity:'error', summary: "Error !", detail:"Failed to edit transaction", life: 1000});
            } else if(response.status === 200){
                toast.current.show({severity:'success', summary: "Success !", detail:"Transaction edited successfully", life: 1000});
                setTransactions(_transactions);
            }
        } catch (err) {
            console.log(err);
        } 
    };
    
    const deleteButtonTemplate = (rowData) => (
        <Button icon="pi pi-trash" className="p-button-danger" onClick={() => deleteRow(rowData)} />
    );
    
    const deleteRow = async (rowData) => {
        console.log(rowData);
        const filteredTransactions = transactions.filter((transaction) => transaction.title !== rowData.title);
        setTransactions(filteredTransactions);
        try {
            const response = await fetch(
              `https://finance-tracker-production-348a.up.railway.app/txns/${rowData._id}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (!response.ok) {
                toast.current.show({severity:'error', summary: "Error !", detail:"Failed to delete transaction", life: 1000});
            } else{
                toast.current.show({severity:'success', summary: "Success !", detail:"Transaction deleted successfully", life: 1000});
            }
          } catch (err) {
            console.log(err);
          }
    };
    
    const textEditor = (options) => (
        <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />
    );

    const typeEditor = (options) => (
        <Dropdown
            value={options.value}
            options={statuses} 
            onChange={(e) => options.editorCallback(e.value)} 
            placeholder="Select type"
            itemTemplate={(option) => (
                <Tag value={option} severity={getSeverity(option)}></Tag>
            )}
        />
    );

    const amountEditor = (options) => (
        <InputNumber
            value={options.value}
            onValueChange={(e) => options.editorCallback(e.value)}
            mode="currency"
            currency="INR"
            locale="en-US"
        />
    );
    
    const dateTimeEditor = (options) => (
        <Calendar 
            value={options.value} 
            onChange={(e) => options.editorCallback(e.value)} 
            showTime
            hourFormat="12"  
            dateFormat="dd/mm/yy"
        />
    );

    return (
        <>
            <Toast ref={toast} position="top-center" />
            <DataTable 
                className='m-2'
                value={transactions}
                paginator 
                rows={4} 
                dataKey="id" 
                filters={filters} 
                globalFilterFields={['title', 'amount', 'description']} 
                header={header} 
                sortMode="multiple" 
                removableSort 
                editMode="row"
                onRowEditComplete={onRowEditComplete}
                emptyMessage="No transactions found."
            >
                <Column field="title" header="Title" sortable filter filterPlaceholder="Search by title" editor={textEditor} />
                <Column field="amount" header="Amount" sortable filterField="amount" dataType="numeric" body={balanceBodyTemplate} filter filterElement={balanceFilterTemplate} editor={amountEditor} />
                <Column field="type" header="Type" filterMenuStyle={{ width: '14rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} editor={typeEditor} />
                <Column field="timestamp" header="DateTime" sortable filterField="timestamp" dataType="date" body={dateBodyTemplate} filter filterElement={dateFilterTemplate} editor={dateTimeEditor} />
                <Column field="description" header="Description" filter filterPlaceholder="Search by description" editor={textEditor}/>
                <Column rowEditor />
                <Column body={deleteButtonTemplate} />
            </DataTable>
            <NewEnterDialog setTransactionDialog={setTransactionDialog} transactions={transactions} setTransactions={setTransactions} transactionDialog={transactionDialog}/>
        </>
    );
}