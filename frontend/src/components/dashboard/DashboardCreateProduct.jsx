import React, { useState, useEffect } from "react";
import "./dashboardCreateProduct.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../redux/toolkits/productSlice";
import Loader from "../loader/Loader";
import axios from "axios";

const DashboardCreateProduct = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [moneyShip, setMoneyShip] = useState(0);
    const [price, setPrice] = useState(0);
    const [sale, setSale] = useState(0);
    const [images, setImages] = useState([]);
    const [category, setCategory] = useState("");
    const [Stock, setStock] = useState(0);
    const [avatarPreview, setAvatarPreview] = useState([]);
    const { loading } = useSelector((state) => state.productState);
    const [categories, setCategories] = useState([]);

    const createProductImagesChange = (event) => {
        setAvatarPreview([]);
        setImages([]);
        const selectedImages = Array.from(event.target.files);
        // Read and store the file URLs in an array
        const imageUrls = selectedImages.map((image) =>
            URL.createObjectURL(image)
        );
        setAvatarPreview((prevState) => [...prevState, ...imageUrls]);
        const imageArray = [];
        selectedImages.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    imageArray.push(reader.result);
                    setImages([...imageArray]);
                }
            };

            reader.readAsDataURL(file);
        });
    };

    useEffect(() => {
        const getCategories = async () => {
            try {
                const { data } = await axios.get("/api/v1/admin/categories");
                setCategories(data.categories);
            } catch (error) {
                console.log(error.response.data.message);
            }
        };
        getCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            name !== "" &&
            description !== "" &&
            price !== 0 &&
            category !== "" &&
            Stock !== 0 &&
            sale !== 0 &&
            moneyShip !== 0 &&
            images.length !== 0 &&
            category
        ) {
            try {
                await dispatch(
                    createProduct({
                        name,
                        description,
                        price,
                        category,
                        Stock,
                        sale,
                        moneyShip,
                        images,
                        categoryId: category,
                    })
                ).unwrap();
                history("/dashboard/products");
                toast.success("Sản phẩm mới vừa được tạo thành công");
            } catch (error) {
                console.log(error.response.data.message);
            }
        } else {
            toast.error(`Vui lòng nhập đầy đủ và chính xác thông tin!`);
        }
    };
    return (
        <div className="col l-10 create-product">
            <form action="name" onSubmit={handleSubmit}>
                <div className="form-group">
                    <div className="form-group__align">
                        <label htmlFor="name">Tên sản phẩm</label>
                    </div>
                    <input
                        required
                        type="text"
                        placeholder="Tên sản phẩm..."
                        id="name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                </div>
                <div className="form-group">
                    <div className="form-group__align">
                        <label htmlFor="description">Mô tả sản phẩm</label>
                    </div>
                    <textarea
                        required
                        type="text"
                        placeholder="Mô tả sản phẩm..."
                        id="description"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                    />
                </div>
                <div className="form-group">
                    <div className="form-group__align">
                        <label htmlFor="moneyship">Tiền ship</label>
                    </div>
                    <input
                        required
                        type="number"
                        min={0}
                        placeholder="Tiền ship..."
                        id="moneyship"
                        onChange={(e) => {
                            setMoneyShip(e.target.value);
                        }}
                    />
                </div>
                <div className="form-group">
                    <div className="form-group__align">
                        <label htmlFor="price">Giá</label>
                    </div>
                    <input
                        required
                        type="number"
                        min={0}
                        placeholder="Giá..."
                        id="price"
                        onChange={(e) => {
                            setPrice(e.target.value);
                        }}
                    />
                </div>
                <div className="form-group">
                    <div className="form-group__align">
                        <label htmlFor="sale">Giảm giá</label>
                    </div>
                    <input
                        required
                        type="number"
                        min={0}
                        placeholder="Giảm giá theo %, VD: 5"
                        id="sale"
                        onChange={(e) => {
                            setSale(e.target.value);
                        }}
                    />
                </div>
                <div className="form-group">
                    <div className="form-group__align">
                        <label htmlFor="category">Loại</label>
                    </div>

                    <select
                        className="input__dashboard"
                        name="update"
                        id=""
                        onChange={(e) => {
                            setCategory(e.target.value);
                        }}
                    >
                        <option value="">Chọn danh mục Sản phẩm</option>
                        {categories?.map((cate, i) => (
                            <option value={cate._id} key={i}>
                                {cate.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <div className="form-group__align">
                        <label htmlFor="stock">Số lượng</label>
                    </div>
                    <input
                        required
                        type="number"
                        min={0}
                        placeholder="Số lượng..."
                        id="stock"
                        onChange={(e) => {
                            setStock(e.target.value);
                        }}
                    />
                </div>
                {/* <div className="form-group">
                    <input
                      required
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={createProductImagesChange}
                        multiple
                    />
                </div> */}
                <div className="form-group avt-file my-[2rem]">
                    {/* <img src={avatarPreview} alt="Avatar Preview" /> */}

                    <label className="file -bottom-[5px]">
                        <input
                            className="input__dashboard"
                            required
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={createProductImagesChange}
                            multiple
                        />
                        <span className="file-custom"></span>
                    </label>
                    <div className="wrap--img--product flex-1 flex justify-start items-center">
                        {avatarPreview.length > 0 &&
                            avatarPreview.map((avt, i) => (
                                <img src={avt} alt="Avatar Preview" />
                            ))}
                    </div>
                </div>
                <button className="btn" onClick={handleSubmit}>
                    TẠO MỚI
                </button>
            </form>
            {loading && <Loader />}
        </div>
    );
};

export default DashboardCreateProduct;
