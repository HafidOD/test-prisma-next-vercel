import ButtonsActionAdmin from "@/components/ButtonsActionAdmin";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusSmallIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

const URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAddressesAdmin() {
  const res = await fetch(`${URL}/addresses/`, { cache: "no-store" });
  const data = await res.json();
  // console.log(data);

  return data.addresses;
}
export default async function AdminAddressesPage() {
  const addresses = await fetchAddressesAdmin();
  // console.log(addresses);
  return (
    <div className="w-full px-2 pt-8 m-auto md:w-3/5 sm:px-0">
      <section className="flex justify-between">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-center text-primaryBlue">
            Direcciones
          </h3>
        </div>
        <div>
          <Link
            href="/admin/addresses/nuevo"
            className="flex text-white bg-primaryBlue font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          >
            Nuevo
            <PlusSmallIcon className="block w-5 h-5 ml-1" aria-hidden="true" />
          </Link>
        </div>
      </section>
      <div className="p-4 mt-5 bg-white rounded-lg shadow-lg">
        {addresses.length === 0 && (
          <p className="mb-2">Aun no hay direcciones agregadas</p>
        )}
        <ul role="list" className="divide-y divide-gray-100">
          {addresses.map((address) => (
            <li
              key={addresses.id}
              className="flex items-center justify-between py-2 gap-x-6"
            >
              <div className="flex items-center gap-x-4">
                <div className="flex-auto min-w-0">
                  <p className="text-xs font-semibold leading-tight text-primaryBlue md:text-sm">
                    {address.officeName}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500 truncate">
                    {address.address}
                  </p>
                  {address.city && address.state && address.country ? (
                    <p className="text-xs leading-5 text-gray-500 truncate">
                      {address.city}, {address.state}, {address.country}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="justify-center sm:flex sm:flex-col sm:items-end ">
                <ButtonsActionAdmin id={address.id} itemURL={"addresses"} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
