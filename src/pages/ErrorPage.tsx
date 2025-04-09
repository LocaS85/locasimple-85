
import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  let errorMessage: string = "An unexpected error has occurred";
  
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-gray-700 mb-4">Sorry, an unexpected error has occurred.</p>
        <p className="text-sm text-gray-500 border-l-2 border-red-400 pl-3">{errorMessage}</p>
        <button 
          onClick={() => window.history.back()} 
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
