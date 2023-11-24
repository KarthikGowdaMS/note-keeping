import React from 'react';

export const Alert = (props) => {
    const { alert } = props;
    // console.log(alert);
    return (
        <>
            <div style={{height: '50px'}}>
                {alert && <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                    <strong>{alert.type}</strong> : {alert.msg}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>}
            </div>
        </>
    )
}