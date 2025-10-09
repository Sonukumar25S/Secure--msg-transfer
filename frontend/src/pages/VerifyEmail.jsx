import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const [status, setStatus] = useState('Verifying...');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('Invalid token');
      return;
    }

   
    api.get(`/auth/verify?token=${token}`)
      .then(() => {
        
        setStatus('Email verified successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      })
      .catch((err) => {
       
        console.error("Verification Error:", err);
        setStatus(err?.response?.data || 'Verification failed. Please try again.');
      });
  }, [navigate, searchParams]); 
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10 text-center">
      <h2 className="text-xl font-bold">{status}</h2>
    </div>
  );
}
