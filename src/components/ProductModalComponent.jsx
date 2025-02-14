import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
import { v4 as uuidv4 } from "uuid";

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function ProductModalComponent({ modalMode, tempProduct,setTempProduct,productModalRef,getProducts }) {
    

    useEffect(() => {
        new Modal(productModalRef.current, { backdrop: false });
        console.log(Modal.getInstance(productModalRef.current));
    }, [])

    const handleProductModalHide = () => {
        const modalInstance = Modal.getInstance(productModalRef.current);
        modalInstance.hide();
    }

    const handleModalInputChange = (e) => {
        const { value, name, checked, type } = e.target;
        setTempProduct({
            ...tempProduct,
            [name]: type === "checkbox" ? checked : value

        })
    }

    const handleImageChange = (e, index) => {
        const { value } = e.target;
        const newImages = [...tempProduct.imagesUrl];

        newImages[index] = value;

        setTempProduct({
            ...tempProduct,
            imagesUrl: newImages
        })
    }

    const handleAddImage = () => {
        const newImages = [...tempProduct.imagesUrl, ""];

        setTempProduct({
            ...tempProduct,
            imagesUrl: newImages
        })
    }

    const handleRemoveImage = () => {
        const newImages = [...tempProduct.imagesUrl];

        newImages.pop();

        setTempProduct({
            ...tempProduct,
            imagesUrl: newImages
        })
    }

    //modal上傳圖片
    const handleFileChange = async (e) => {
        console.dir(e.target.files);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file-to-upload', file);
        // formData.forEach((value, key) => {
        //   console.log(`${key}:`, value);
        // });

        try {
            const res = await axios.post(`${baseUrl}/v2/api/${apiPath}/admin/upload`, formData);
            const uploadImgUrl = res.data.imageUrl;
            setTempProduct({
                ...tempProduct,
                imageUrl: uploadImgUrl
            })
        } catch (error) {
            console.log("上傳失敗");

        }
    }

    const handleUpdateProduct = async () => {
        const apiCall = modalMode === "create" ? createProduct : editProduct;
        try {
            await apiCall();
            getProducts();
            handleProductModalHide();
        } catch (error) {
            alert("更新失敗")
        }
    }
    const createProduct = async () => {
        try {
            await axios.post(`${baseUrl}/v2/api/${apiPath}/admin/product`,
                {
                    data:
                    {
                        ...tempProduct,
                        origin_price: Number(tempProduct.origin_price),
                        price: Number(tempProduct.price),
                        is_enabled: tempProduct.is_enabled ? 1 : 0
                    }
                });
        } catch (error) {
            alert("新增失敗");
        }
    }
    const editProduct = async () => {
        try {
            await axios.put(`${baseUrl}/v2/api/${apiPath}/admin/product/${tempProduct.id}`,
                {
                    data:
                    {
                        ...tempProduct,
                        origin_price: Number(tempProduct.origin_price),
                        price: Number(tempProduct.price),
                        is_enabled: tempProduct.is_enabled ? 1 : 0
                    }
                });
        } catch (error) {
            alert("編輯失敗");
        }
    }
    return (<><div ref={productModalRef} className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content border-0 shadow">
                <div className="modal-header border-bottom">
                    <h5 className="modal-title fs-4">{modalMode === "create" ? "新增產品" : "編輯產品"}</h5>
                    <button type="button" className="btn-close" aria-label="Close" onClick={handleProductModalHide}></button>
                </div>

                <div className="modal-body p-4">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="mb-5">
                                <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    className="form-control"
                                    id="fileInput"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="primary-image" className="form-label">
                                    主圖
                                </label>
                                <div className="input-group">
                                    <input
                                        value={tempProduct.imageUrl}
                                        onChange={handleModalInputChange}
                                        name="imageUrl"
                                        type="text"
                                        id="primary-image"
                                        className="form-control"
                                        placeholder="請輸入圖片連結"
                                    />
                                </div>
                                <img
                                    src={tempProduct.imageUrl}
                                    alt={tempProduct.title}
                                    className="img-fluid"
                                />
                            </div>




                            {/* 副圖 */}
                            <div className="border border-2 border-dashed rounded-3 p-3">
                                {tempProduct.imagesUrl?.map((image, index) => (
                                    <div key={index} className="mb-2">
                                        <label
                                            htmlFor={`imagesUrl-${index + 1}`}
                                            className="form-label"
                                        >
                                            副圖 {index + 1}
                                        </label>
                                        <input
                                            value={image}
                                            onChange={(e) => handleImageChange(e, index)}
                                            id={`imagesUrl-${index + 1}`}
                                            type="text"
                                            placeholder={`圖片網址 ${index + 1}`}
                                            className="form-control mb-2"
                                        />
                                        {image && (
                                            <img
                                                src={image}
                                                alt={`副圖 ${index + 1}`}
                                                className="img-fluid mb-2"
                                            />
                                        )}
                                    </div>
                                ))}
                                <div className="btn-group w-100">
                                    {tempProduct.imagesUrl.length < 5 && tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1] !== ""
                                        && (<button type="button" className="btn btn-outline-primary btn-sm w-100" onClick={handleAddImage} >新增圖片</button>)}
                                    {tempProduct.imagesUrl.length > 1
                                        && (<button type="button" className="btn btn-outline-danger btn-sm w-100" onClick={handleRemoveImage} >取消圖片</button>)}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-8">
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">
                                    標題
                                </label>
                                <input
                                    value={tempProduct.title}
                                    onChange={handleModalInputChange}
                                    name="title"
                                    id="title"
                                    type="text"
                                    className="form-control"
                                    placeholder="請輸入標題"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="category" className="form-label">
                                    分類
                                </label>
                                <input
                                    value={tempProduct.category}
                                    onChange={handleModalInputChange}
                                    name="category"
                                    id="category"
                                    type="text"
                                    className="form-control"
                                    placeholder="請輸入分類"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="unit" className="form-label">
                                    單位
                                </label>
                                <input
                                    value={tempProduct.unit}
                                    onChange={handleModalInputChange}
                                    name="unit"
                                    id="unit"
                                    type="text"
                                    className="form-control"
                                    placeholder="請輸入單位"
                                />
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-6">
                                    <label htmlFor="origin_price" className="form-label">
                                        原價
                                    </label>
                                    <input
                                        value={tempProduct.origin_price}
                                        onChange={handleModalInputChange}
                                        name="origin_price"
                                        id="origin_price"
                                        type="number"
                                        className="form-control"
                                        placeholder="請輸入原價"
                                    />
                                </div>
                                <div className="col-6">
                                    <label htmlFor="price" className="form-label">
                                        售價
                                    </label>
                                    <input
                                        value={tempProduct.price}
                                        onChange={handleModalInputChange}
                                        name="price"
                                        id="price"
                                        type="number"
                                        className="form-control"
                                        placeholder="請輸入售價"
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">
                                    產品描述
                                </label>
                                <textarea
                                    value={tempProduct.description}
                                    onChange={handleModalInputChange}
                                    name="description"
                                    id="description"
                                    className="form-control"
                                    rows={4}
                                    placeholder="請輸入產品描述"
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="content" className="form-label">
                                    說明內容
                                </label>
                                <textarea
                                    value={tempProduct.content}
                                    onChange={handleModalInputChange}
                                    name="content"
                                    id="content"
                                    className="form-control"
                                    rows={4}
                                    placeholder="請輸入說明內容"
                                ></textarea>
                            </div>

                            <div className="form-check">
                                <input
                                    checked={tempProduct.is_enabled}
                                    onChange={handleModalInputChange}
                                    name="is_enabled"
                                    type="checkbox"
                                    className="form-check-input"
                                    id="isEnabled"
                                />
                                <label className="form-check-label" htmlFor="isEnabled">
                                    是否啟用
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer border-top bg-light">
                    <button type="button" className="btn btn-secondary" onClick={handleProductModalHide}>
                        取消
                    </button>
                    <button onClick={handleUpdateProduct} type="button" className="btn btn-primary">
                        確認
                    </button>
                </div>
            </div>
        </div>
    </div>

    </>)
}

export default ProductModalComponent;