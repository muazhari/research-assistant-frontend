import React from 'react';

const PassageSearch: React.FC = () => {
    return (
        <div className="container-fluid d-flex flex-column mt-5" style={{'height': '90vh'}}>
            <h2 className="mb-4 fw-normal">Passage Search</h2>
            <div className="row flex-grow-1">
                <div className="col">
                    <p className="mb-3">Configuration</p>
                    <div className="bg-dark text-light p-4 mb-3 w-100 d-flex align-items-center justify-content-center"  style={{'height': '353px'}}>
                        <span className="fs-4">Form</span>
                    </div>
                </div>
            </div>
            <div className="my-5">
                <button className="btn btn-primary">Search</button>
            </div>
            <div className="row flex-grow-1">
                <div className="col">
                    <p className="mb-3">Output</p>
                    <div className="bg-dark text-light p-4 mb-3 w-100 d-flex align-items-center justify-content-center"  style={{'height': '353px'}}>
                        <span className="fs-4">Visualization</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PassageSearch;
