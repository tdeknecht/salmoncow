import React from 'react';
import Loader from "../Loader/Loader";

function LoaderButton({ isLoading, disableButton, children, ...props }) {
  return (
    <button disabled={disableButton} className="btn btn-primary" {...props}>
      {isLoading ? <Loader /> : children}
    </button>
  );
}
export default LoaderButton;
