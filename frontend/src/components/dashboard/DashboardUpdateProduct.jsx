import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./dashboardUpdateProduct.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import {
    getSingleProduct,
    updateProduct,
} from "../../redux/toolkits/productSlice";
import Loader from "../loader/Loader";
import axios from "axios";

const DashboardUpdateProduct = () => {
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
    const [keyFresh, setKeyFresh] = useState(0);
    const [avatarPreview, setAvatarPreview] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isChangeImage, setIsChangeImage] = useState(false);

    const { loading } = useSelector((state) => state.productState);

    const { id } = useParams();

    const createProductImagesChange = (event) => {
        setAvatarPreview([]);
        setImages([]);
        setOldImages([]);
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
        setIsChangeImage(true);
    };
    useEffect(() => {
        const getProduct = async () => {
            try {
                const data = await dispatch(getSingleProduct(id)).unwrap();
                setName(data.product.name);
                setDescription(data.product.description);
                setPrice(data.product.price);
                setCategory(data.product.category);
                setStock(data.product.Stock);
                setOldImages(data.product.images);
                setMoneyShip(data.product.moneyShip);
            } catch (err) {}
        };
        getProduct();
        const getCategories = async () => {
            try {
                const { data } = await axios.get("/api/v1/admin/categories");
                setCategories(data.categories);
            } catch (error) {
                console.log(error.response.data.message);
            }
        };
        getCategories();
    }, [keyFresh]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(
                updateProduct({
                    id,
                    name,
                    description,
                    price,
                    category,
                    Stock,
                    sale,
                    moneyShip,
                    images: oldImages.length > 0 ? oldImages : images,
                    categoryId: category,
                    isChangeImage,
                })
            ).unwrap();
            history("/dashboard/products");
            toast.success("Sản phẩm mới vừa được chỉnh sửa thành công");
            setKeyFresh((oldv) => oldv + 1);
        } catch (error) {
            console.log(error.response.data.message);
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
                        type="number"
                        min={0}
                        placeholder="Tiền ship..."
                        id="moneyship"
                        value={moneyShip}
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
                        type="number"
                        min={0}
                        placeholder="Giá..."
                        id="price"
                        value={price}
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
                        type="number"
                        min={0}
                        placeholder="Giảm giá..."
                        id="sale"
                        value={sale}
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
                            <option
                                selected={cate._id == category ? true : false}
                                value={cate._id}
                                key={i}
                            >
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
                        type="number"
                        min={0}
                        placeholder="Số lượng..."
                        id="stock"
                        value={Stock}
                        onChange={(e) => {
                            setStock(e.target.value);
                        }}
                    />
                </div>
                <div className="form-group avt-file my-[2rem]">
                    <label className="file -bottom-[5px]">
                        <input
                            className="input__dashboard"
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={createProductImagesChange}
                            multiple
                        />
                        <span className="file-custom"></span>
                    </label>
                    <div className="wrap--img--product flex-1 flex justify-start items-center">
                        {oldImages.length > 0
                            ? oldImages.map((avt, i) => (
                                  <img src={avt.url} alt="Avatar Preview" />
                              ))
                            : avatarPreview.map((avt, i) => (
                                  <img src={avt} alt="Avatar new" />
                              ))}
                    </div>
                </div>
                <button className="btn" onClick={handleSubmit}>
                    CHỈNH SỬA
                </button>
            </form>
            {loading && <Loader />}
        </div>
    );
};

export default DashboardUpdateProduct;
