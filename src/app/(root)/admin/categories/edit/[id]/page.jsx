"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditCategoryPage() {
  const [category, setCategory] = useState({
    categoryName: "",
    parentCategory: null,
    old_image: "",
    enterprises: [],
  });
  const [file, setFile] = useState(null);
  const form = useRef(null);
  const router = useRouter();
  const params = useParams();

  const [enterpriseOptions, setEnterpriseOptions] = useState([]);

  const handleChange = (e) => {
    if (e.target.type === "checkbox") {
      // console.log(e.target.checked);
      if (e.target.checked) {
        console.log("agregado");
        setCategory({
          ...category,
          [e.target.name]: [
            ...category[e.target.name],
            parseInt(e.target.value),
          ],
        });
      } else {
        setCategory({
          ...category,
          [e.target.name]: category[e.target.name].filter(
            (item) => item !== parseInt(e.target.value)
          ),
        });
      }
    } else {
      setCategory({
        ...category,
        [e.target.name]: e.target.value,
      });
    }
    // console.log(category);
  };
  useEffect(() => {
    console.log("reload");
    fetch("/api/categories/" + params.id)
      .then((response) => response.json())
      .then((data) => {
        const enterprises = [];
        data.category.enterprises.forEach((enterprise) => {
          enterprises.push(enterprise.id);
        });
        // console.log(data);
        setCategory({
          categoryName: data.category.categoryName,
          parentCategory: data.category.parentCategory,
          old_image: data.category.imageCategory,
          enterprises: enterprises,
        });
        // console.log(enterprise.logo);
      })
      .catch((error) => {
        console.error("Error al obtener le empresa:", error);
      });

    fetch("/api/enterprises")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.enterprises);
        const options = data.enterprises.map((enterprise) => ({
          value: enterprise.id,
          label: enterprise.enterpriseName, // Supongamos que el nombre de la empresa se llama 'name'
        }));
        setEnterpriseOptions(options);
      })
      .catch((error) => {
        console.error("Error al obtener las empresas:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("categoryName", category.categoryName);
    formData.append("parentCategory", category.parentCategory);
    formData.append("enterprises", category.enterprises);
    formData.append("old_image", category.old_image);

    if (file) {
      formData.append("imageCategory", file);
    }

    const res = await fetch(`/api/categories/${params.id}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      form.current.reset();
      router.refresh();
      router.push("/admin/categories");
    }
  };
  return (
    <div className="w-full px-2 pt-8 m-auto md:w-2/5 sm:px-0">
      <div className="">
        <form
          className="px-8 pt-6 pb-8 mb-4 bg-white rounded-md shadow-md"
          onSubmit={handleSubmit}
          ref={form}
        >
          <label
            htmlFor="categoryName"
            className="block my-2 text-sm font-bold text-gray-700"
          >
            Nombre de la división:
          </label>
          <input
            name="categoryName"
            type="text"
            // placeholder="Marr"
            onChange={handleChange}
            value={category.categoryName}
            className="w-full px-3 py-2 shadow appearance-none"
            required
            autoFocus
          />

          <label
            htmlFor="categoryName"
            className="block my-2 text-sm font-bold text-gray-700"
          >
            Categoria padre:
          </label>
          <select
            name="parentCategory"
            onChange={handleChange}
            value={category.parentCategory}
            className="w-full px-3 py-2 border shadow"
            required
          >
            <option value="">Selecciona categoria padre</option>

            <option value="2">Inventarios</option>
            {/* <option value="1">Impresiones</option> */}
          </select>

          <label
            htmlFor="enterprises"
            className="block my-2 text-sm font-bold text-gray-700"
          >
            Marca:
          </label>
          <div className="flex flex-col space-y-2">
            {enterpriseOptions.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  name="enterprises"
                  type="checkbox"
                  value={option.value}
                  checked={category.enterprises.includes(option.value)}
                  onChange={handleChange}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>

          {/* <label
            htmlFor="imageCategory"
            className="block my-2 text-sm font-bold text-gray-700"
          >
            Imagen:
          </label>
          <input
            type="file"
            className="w-full px-3 py-2 mb-2 border shadow appearance-none"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          {!file && (
            <img
              className="object-contain mx-auto my-4 w-96"
              src={category.old_image}
              alt=""
            />
          )}
          {file && (
            <img
              className="object-contain mx-auto my-4 w-96"
              src={URL.createObjectURL(file)}
              alt=""
            />
          )} */}

          <button className="px-4 py-2 mt-4 font-bold text-white bg-primaryBlue">
            {params.id ? "Actualizar" : "Crear"}
          </button>
        </form>
      </div>
    </div>
  );
}
