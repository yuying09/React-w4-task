import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PaginationComponent from "../components/PaginationComponent";
import ProductModalComponent from "../components/ProductModalComponent";
import RemoveProductModal from "../components/DelProductModal";
import ProductListComponent from "../components/ProductListComponent";

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

const defaultModalState = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""],
    id: uuidv4()
};

function ProductPage(setIsAuth) {
    // 產品modal
    const productModalRef = useRef(null);
    const [modalMode, setModalMode] = useState(null);

    const removeProductModalRef = useRef(null);

    const [tempProduct, setTempProduct] = useState(defaultModalState);

    
    // 產品相關功能
    const [products, setProducts] = useState([]);

    const getProducts = async (page = 1) => {
        try {
            const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/products?page=${page}`);
            setProducts(res.data.products);
            setPageInfo(res.data.pagination)
        } catch (err) {
            console.log("資料取得失敗");
        }
    }

    useEffect(()=>{
        getProducts()
    },[])

    //分頁
    const [pageInfo, setPageInfo] = useState({});

    const handlePageChange = (page) => {
        getProducts(page)
    }
    return (
        <><div className="container py-5">
            <div className="row">
                <div className="col">
                <ProductListComponent setModalMode={setModalMode} productModalRef={productModalRef}  removeProductModalRef={removeProductModalRef} products={products} defaultModalState={defaultModalState}  setTempProduct={setTempProduct}/>
                </div>
               <PaginationComponent pageInfo={pageInfo} handlePageChange={handlePageChange}  /> 
            </div>
        </div>
        <ProductModalComponent modalMode={modalMode} tempProduct={tempProduct} setTempProduct={setTempProduct} productModalRef={productModalRef} getProducts={getProducts}/>
        <RemoveProductModal removeProductModalRef={removeProductModalRef}  tempProduct={tempProduct} getProducts={getProducts}/>

        </>)
}

export default ProductPage;