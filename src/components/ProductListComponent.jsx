import { Modal } from "bootstrap";

function ProductListComponent({setModalMode,defaultModalState,setTempProduct,productModalRef,removeProductModalRef,products}) {
    const handleProductModalShow = (mode, product) => {
        setModalMode(mode);

        if (mode === "create") {
            setTempProduct(defaultModalState);
        } else {
            setTempProduct(product);
        }
        const modalInstance = Modal.getInstance(productModalRef.current);
        modalInstance.show();
    }
    
    const handleRemoveProductModalShow = (product) => {
        setTempProduct(product);
        const modalInstance = Modal.getInstance(removeProductModalRef.current);
        modalInstance.show();
    }
    return( <><div className="d-flex justify-content-between">
        <h2>產品列表</h2>
        <button type="button" className="btn btn-primary" onClick={() => { handleProductModalShow("create") }}>建立新的產品</button>
    </div>
    <table className="table">
        <thead>
            <tr>
                <th scope="col">產品名稱</th>
                <th scope="col">原價</th>
                <th scope="col">售價</th>
                <th scope="col">是否啟用</th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
            {products.map((product) => (
                <tr key={product.id}>
                    <th scope="row">{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>{product.is_enabled ? (<span className="text-success">啟用</span>) : <span>未啟用</span>}</td>
                    <td>
                        <div className="btn-group">
                            <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => { handleProductModalShow("edit", product) }}>編輯</button>
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => { handleRemoveProductModalShow(product) }}>刪除</button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table> </>)
}

export default ProductListComponent;