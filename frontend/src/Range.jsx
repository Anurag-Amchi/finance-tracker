import React from 'react';
import { Calendar } from 'primereact/calendar';

const Range = (props) => {

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span>
                <label htmlFor="start" className='m-2'><b>From :</b></label>
                <Calendar
                    className='m-2'
                    id="start"
                    value={props.startDate}
                    onChange={(e) => props.setStartDate(e.value)}
                    showTime
                    hourFormat="12"
                />
            </span>
            <span>
                <label htmlFor="end" className='m-2'><b>To :</b></label>
                <Calendar
                    className='m-2'
                    id="end"
                    value={props.endDate}
                    onChange={(e) => props.setEndDate(e.value)}
                    showTime
                    hourFormat="12" 
                />
            </span>
        </div>
    );
};

export default Range;
