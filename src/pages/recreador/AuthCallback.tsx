import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: tratar callback real do Supabase
    navigate("/recreador", { replace: true });
  }, [navigate]);

  return <div>Redirecionando para o portal do recreador...</div>;
}
