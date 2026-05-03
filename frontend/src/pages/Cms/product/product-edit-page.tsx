import {
  InputLabel,
  NumberInputComponent,
  SelectComponent,
  SubmitButton,
  TextAreaInputComponent,
  TextInputComponent,
} from "../../../components/common/form/input-component.";
import { Heading3 } from "../../../components/common/title";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authSvc from "../../auth/auth.service";
import { toast } from "react-toastify";
import ProductSvc from "./product-service";

const EditProduct = () => {
  const schema = yup.object({
    title: yup.string().required(),
    image: yup.mixed().required(),
    description: yup.string().required(),
    price: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      )
      .typeError("Price must be a number")
      .min(1, "Price must be greater than 0")
      .max(1000000, "Price cannot exceed 1,000,000")
      .required("Price is required"),
    category: yup
      .object({
        label: yup.string().required(),
        value: yup.string().required(),
      })
      .required(),
    brand: yup
      .object({
        label: yup.string().required(),
        value: yup.string().required(),
      })
      .required(),
    quantity: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      )
      .typeError("Quantity must be a number")
      .min(0, "Quantity cannot be negative")
      .integer("Quantity must be a whole number")
      .required("Quantity is required"),
    features: yup.string(),
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<any>();
  const params = useParams();
  const [category, setCategory] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const getBrand = async () => {
    try {
      // setLoading(true)
      const response: any = await authSvc.getRequest("/brand/getall");
      console.log(response);
      setBrands(response.result);
      console.log(brands);
    } catch (exception) {
      toast.error("Error while fetching brand list");
      console.log(exception);
    }
  };
  const getCategory = async () => {
    try {
      // setLoading(true)
      const response: any = await authSvc.getRequest("/category/getall");
      console.log(response);
      setCategory(response.result);
      console.log(category);
    } catch (exception) {
      toast.error("Error while fetching category list");
      console.log(exception);
    }
  };
  useEffect(() => {
    (getCategory(), getBrand());
  }, []);

  const getDetail = async () => {
    try {
      const detail: any = await ProductSvc.getRequest(
        `/product/getaproduct/${params.id}`,
        { auth: true },
      );
      const data = {
        title: detail.result.title,
        image: detail.result.image,
        description: detail.result.description,
        price: detail.result.price,
        category: detail.result.category,
        brand: detail.result.brand,
        quantity: detail.result.quantity,
        features: detail.result.features,
      };
      setDetail(detail.result);
      console.log(detail.result);
      console.log(data);
    } catch (exception) {
      toast.error("Error while fetching Product list");
      navigate("/admin/Product");
      console.log(exception);
    }
  };
  useEffect(() => {
    getDetail();
  }, []);

  useEffect(() => {
    if (detail) {
      setValue("title", detail.title);
      setValue("image", detail.image);
      setValue("description", detail.description);
      setValue("price", detail.price);
      setValue("category", {
        label: detail.category.title,
        value: detail.category._id,
      });
      setValue("brand", { label: detail.brand.title, value: detail.brand._id });
      setValue("features", detail.features.join(", "));
      setValue("quantity", detail.quantity);
    }
  }, [detail]);

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const submitData = {
        ...data,
        category: data.category.value,
        brand: data.brand.value,
        features: data.features.split(",").map((tag: string) => tag.trim()),
      };
      console.log(submitData);
      await ProductSvc.patchRequest(
        `/product/updateaproduct/${params.id}`,
        submitData,
        { auth: true, file: true },
      );

      toast.success("Product Edited successfully. ");
      navigate("/admin/Product");
    } catch (exception: any) {
      if (+exception.status === 400) {
        Object.keys(exception.data.result).map((field: any) => {
          setError(field, { message: exception.data.result[field] });
        });
      }
      toast.error(exception.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="overflow-x-auto mt-5 mb-5">
        <Heading3>
          <>Edit Product</>
        </Heading3>
        <hr />
      </div>
      <div className="overflow-x-auto">
        <div className="py-3 px-5 lg:py-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <InputLabel htmlFor="name">Product Name</InputLabel>

                <TextInputComponent
                  name="title"
                  errMsg={errors.title?.message as string}
                  defaultValue=""
                  control={control}
                />
              </div>
              <div className="sm:col-span-2">
                <InputLabel htmlFor="description">Description</InputLabel>
                <TextAreaInputComponent
                  control={control}
                  name="description"
                  errMsg={errors?.description?.message as string}
                />
              </div>
              <div className="">
                <InputLabel htmlFor="category">Category</InputLabel>

                <SelectComponent
                  name="category"
                  control={control}
                  options={category.map((item) => ({
                    label: item.title,
                    value: item._id,
                  }))}
                  errMsg={errors.category?.message as string}
                />
              </div>
              <div className="">
                <InputLabel htmlFor="brand">Brand</InputLabel>

                <SelectComponent
                  name="brand"
                  control={control}
                  options={brands.map((item) => ({
                    label: item.title,
                    value: item._id,
                  }))}
                  errMsg={errors.brand?.message as string}
                />
              </div>
              <div className="">
                <InputLabel htmlFor="name">Features</InputLabel>

                <TextInputComponent
                  name="features"
                  errMsg={errors.features?.message as string}
                  defaultValue=""
                  control={control}
                />
              </div>
              <div className="">
                <InputLabel htmlFor="name">Price</InputLabel>

                <NumberInputComponent
                  name="price"
                  errMsg={errors.price?.message as string}
                  defaultValue={undefined}
                  control={control}
                />
              </div>

              <div className="">
                <InputLabel htmlFor="quantity">Quantity</InputLabel>

                <NumberInputComponent
                  name="quantity"
                  errMsg={errors.quantity?.message as string}
                  defaultValue={undefined}
                  control={control}
                />
              </div>
              <div className="sm:col-span-2">
                <InputLabel htmlFor="Image">Image</InputLabel>

                <input
                  type="file"
                  name="image"
                  onChange={(e: any) => {
                    const image = e.target.files["0"];
                    // console.lo g("Selected file:", image);
                    setValue("image", image);
                  }}
                />
              </div>
              <div className="sm:col-span-2">
                {/* <CancelButton loading={loading}>Cancel</CancelButton> */}
                <SubmitButton loading={loading}>Edit</SubmitButton>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* <div className="w-full">
                  <label htmlFor="Product" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product</label>
                  <input type="text" name="Product" id="Product" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500" placeholder="Product Product" required />
              </div>
              <div className="w-full">
                  <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                  <input type="number" name="price" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500" placeholder="$2999" required />
              </div>
              <div>
                  <label htmlFor="Product" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product</label>
                  <select id="Product" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500">
                      <option value="">Select Product</option>
                      <option value="TV">TV/Monitors</option>
                      <option value="PC">PC</option>
                      <option value="GA">Gaming/Console</option>
                      <option value="PH">Phones</option>
                  </select> 
              </div>
              <div>
                  <label htmlFor="item-weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Item Weight (kg)</label>
                  <input type="number" name="item-weight" id="item-weight" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500" placeholder="12" required/>
              </div> 
              <div className="sm:col-span-2">
                  <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                  <textarea id="description" rows={8} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500" placeholder="Your description here"></textarea>
              </div> */}
    </>
  );
};

export default EditProduct;
