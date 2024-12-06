import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function Loader() {
    return (
        <div className="card flex justify-content-center">
            <ProgressSpinner />
        </div>
    );
}