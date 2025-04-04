"use client";
import React from 'react'

interface ErrorFallBackProps {
  error: Error;
}

const ErrorFallBack = ({error}: ErrorFallBackProps) => {
  return (
    <div className="error-fallback">
      <h2>Oops! Something went wrong.</h2>
      <p>{error.message}</p>
    </div>
  )
}

export default ErrorFallBack