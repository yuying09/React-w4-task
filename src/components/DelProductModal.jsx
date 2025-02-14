import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function RemoveProductModal({removeProductModalRef,tempProduct,getProducts}) {
    useEffect(() => {
        new Modal(removeProductModalRef.current, { backdrop: false });
        console.log(Modal.getInstance(removeProductModalRef.current));
    }, [])
    const handleRemoveProductModalHide = () => {
        const modalInstance = Modal.getInstance(removeProductModalRef.current);
        modalInstance.hide();
    };

    const handleRemoveProduct = async () => {
        try {
            await removeProduct();
            getProducts();
            handleRemoveProductModalHide();
        } catch (error) {
            alert("刪除失敗")
        }
    }
    const removeProduct = async () => {
        try {
            await axios.delete(`${baseUrl}/v2/api/${apiPath}/admin/product/${tempProduct.id}`,
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
            alert("刪除失敗");
        }
    }
    return (<div
        ref={removeProductModalRef}
        className="modal fade"
        id="delProductModal"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5">刪除產品</h1>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={handleRemoveProductModalHide}
                    ></button>
                </div>
                <div className="modal-body">
                    你是否要刪除
                    <span className="text-danger fw-bold">{tempProduct.title}</span>
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleRemoveProductModalHide}>
                        取消
                    </button>
                    <button type="button" className="btn btn-danger" onClick={handleRemoveProduct}>
                        刪除
                    </button>
                </div>
            </div>
        </div>
    </div>)
}


export default RemoveProductModal;
