import { useState, useEffect } from "react";
import api from "@/lib/api";

export const useStripeConnect = () => {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState<any>(null);

  const fetchStatus = async () => {
    try {
      const res = await api.get("/stripe/account-status");
      const data = res.data.data;

      setStatus(data);

      if (
        data.detailsSubmitted &&
        data.chargesEnabled &&
        data.payoutsEnabled
      ) {
        setConnected(true);
      } else {
        setConnected(false);
      }
    } catch (err) {
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return { loading, connected, status, refetch: fetchStatus };
};