import React from 'react';
import '.././App.css';
import loading from './../resource/loadingDot.gif';

const Loader = () => {
  return (
    <div className=".container-fluid" >
      <div className="row h-100 mt-auto mb-auto ">
        <div className="col-sm-12 col-md-8 offset-md-2 text-center">
          <img src={loading} width="100" height="100" alt="loading..."  />
        </div>
      </div>
    </div>
  );
};

export default Loader;
