"use client";

import useAddress from "@/app/hooks/use-address";
import useCart from "@/app/hooks/use-cart";
import { useState } from "react";

export default function ExButt({ user }) {
  const [loading, setLoading] = useState(false);
  // console.log(user);
  const items = useCart((state) => state.items);
  const address = useAddress((state) => state.address);
  // console.log(address);
  const handleClick = async () => {
    // console.log(items);
    // Llama a la función para enviar el email con los detalles del pedido
    try {
      setLoading(true);
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items, user: user, address }),
      });
      // console.log(response);

      // console.log(response);
      if (response.ok) {
        const data = await response.json();
        // Redirigir a la página de agradecimiento
        // console.log(data);
        window.location.href = `/dashboard/thankyou?saleId=${data.sale.id}`;
      } else {
        console.error("Error al enviar el correo.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error de red:", error);
      setLoading(false);
    }
  };
  // console.log(items);
  return (
    <button
      // href={`/dashboard/thankyou`}
      onClick={handleClick}
      style={{ backgroundColor: `${loading ? "#ccc" : "#193761"}` }}
      className="w-full text-white bg-primaryBlue font-bold rounded-lg text-md px-5 py-2.5 text-center"
      disabled={loading}
    >
      {loading ? "Relizando pedido..." : "Realizar pedido"}
    </button>
  );
}
