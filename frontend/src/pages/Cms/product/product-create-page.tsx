import {  InputLabel, NumberInputComponent, SelectComponent,  SubmitButton, TextAreaInputComponent, TextInputComponent } from "../../../components/common/form/input-component.";
import { Heading3 } from "../../../components/common/title"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import authSvc from "../../auth/auth.service";
import { toast } from "react-toastify";


const CreateProduct = () => {

    const schema = yup.object({
        title: yup.string().required("Product name is required"),
        image: yup.mixed().required("Image is required"),
        description: yup.string().required("Description is required"),
        price: yup
            .number()
            .typeError("Price must be a number")
            .min(1, "Price must be greater than 0")
            .max(1000000, "Price should be a safe number")
            .required("Price is required"),
        category: yup.object({
            label: yup.string().required(),
            value: yup.string().required()
        }).required("Category is required"),
        brand: yup.object({
            label: yup.string().required(),
            value: yup.string().required()
        }).required("Brand is required"),
        quantity: yup
            .number()
            .typeError("Quantity must be a number")
            .min(0, "Quantity cannot be negative")
            .integer("Quantity must be a whole number")
            .required("Quantity is required"),
        features: yup.string(),
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);

    const getBrand = async () => {
        try {
            const response: any = await authSvc.getRequest("/brand/getall")
            setBrands(response.result);
        } catch (exception) {
            toast.error("Error while fetching brand list")
            console.log(exception)
        }
    }

    const getCategory = async () => {
        try {
            const response: any = await authSvc.getRequest("/category/getall")
            setCategory(response.result);
        } catch (exception) {
            toast.error("Error while fetching category list")
            console.log(exception)
        }
    }

    useEffect(() => {
        getCategory();
        getBrand();
    }, [])

    const {
        control,
        handleSubmit,
        setError,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            title: "",
            description: "",
            features: "",
            price: undefined,
            quantity: undefined,
        }
    });

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            const submitData = {
                ...data,
                category: data.category.value,
                brand: data.brand.value,
                features: data.features ? data.features.split(',').map((tag: string) => tag.trim()) : []
            }
            await authSvc.postRequest('/product/createProduct', submitData, { auth: true, file: true });
            toast.success("Product Created successfully.")
            navigate('/admin/Product')
        } catch (exception: any) {
            if (+exception.status === 400) {
                Object.keys(exception.data.result).map((field: any) => {
                    setError(field, { message: exception.data.result[field] })
                })
            }
            toast.error(exception.data.message)
        } finally {
            setLoading(false)
        }
    };

    return (
        <>
            <div className="overflow-x-auto mt-5 mb-5">
                <Heading3><>Create Product</></Heading3>
                <hr />
            </div>

            <div className="overflow-x-auto">
                <div className="py-3 px-5 lg:py-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">

                            <div className="sm:col-span-2">
                                <InputLabel htmlFor="title">Product Name</InputLabel>
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

                            <div>
                                <InputLabel htmlFor="category">Category</InputLabel>
                                <SelectComponent
                                    name="category"
                                    control={control}
                                    options={category.map((item) => ({ label: item.title, value: item._id }))}
                                    errMsg={errors.category?.message as string}
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="brand">Brand</InputLabel>
                                <SelectComponent
                                    name="brand"
                                    control={control}
                                    options={brands.map((item) => ({ label: item.title, value: item._id }))}
                                    errMsg={errors.brand?.message as string}
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="features">Features (comma separated)</InputLabel>
                                <TextInputComponent
                                    name="features"
                                    errMsg={errors.features?.message as string}
                                    defaultValue=""
                                    control={control}
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="price">Price (max: 1,000,000)</InputLabel>
                                <NumberInputComponent
                                    name="price"
                                    errMsg={errors.price?.message as string}
                                    defaultValue={undefined}
                                    control={control}
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="quantity">Quantity</InputLabel>
                                <NumberInputComponent
                                    name="quantity"
                                    errMsg={errors.quantity?.message as string}
                                    defaultValue={undefined}
                                    control={control}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <InputLabel htmlFor="image">Image</InputLabel>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={(e: any) => {
                                        const image = e.target.files['0'];
                                        setValue("image", image);
                                    }}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <SubmitButton loading={loading}>Create</SubmitButton>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CreateProduct;