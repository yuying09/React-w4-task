import axios, { toFormData } from "axios";
import { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
import { v4 as uuidv4 } from "uuid";


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


function App() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const apiPath = import.meta.env.VITE_API_PATH;


  // 帳號驗證功能
  const [account, setAccount] = useState({
    "username": "example@test.com",
    "password": "example"
  })

  const [isAuth, setIsAuth] = useState(false)


  const handleInputChange = (e) => {
    const { value, name } = e.target
    setAccount({
      ...account,
      [name]: value
    })

  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/v2/admin/signin`, account);
      setIsAuth(true);
      const { token, expired } = res.data;
      document.cookie = `token=${token};expires=${new Date(expired)}`;
      axios.defaults.headers.common[`Authorization`] = token;
      getProducts()
    } catch (error) {
      alert("登入失敗請重試")
    }
  }



  const checkLogin = async () => {
    try {
      await axios.post(`${baseUrl}/v2/api/user/check`);
      getProducts();
      setIsAuth(true);
    } catch (error) {
      console.log("請登入");
    }
  }



  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1",);

    axios.defaults.headers.common['Authorization'] = token;
    checkLogin();

  }, []);


  // 產品相關功能

  const [products, setProducts] = useState([])

  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/products?page=${page}`);
      setProducts(res.data.products);
      setPageInfo(res.data.pagination)
    } catch (err) {
      console.log("資料取得失敗");
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

  const handleRemoveProduct = async () => {
    try {
      await removeProduct();
      getProducts();
      handleRemoveProductModalHide();
    } catch (error) {
      alert("刪除失敗")
    }
  }


  // 產品modal

  const [modalMode, setModalMode] = useState(null);
  const productModalRef = useRef(null);
  const removeProductModalRef = useRef(null);

  useEffect(() => {
    new Modal(productModalRef.current, { backdrop: false });
    console.log(Modal.getInstance(productModalRef.current));
  }, [])

  useEffect(() => {
    new Modal(removeProductModalRef.current, { backdrop: false });
    console.log(Modal.getInstance(removeProductModalRef.current));
  }, [])

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

  const handleProductModalHide = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  }

  const handleRemoveProductModalShow = (product) => {
    setTempProduct(product);
    const modalInstance = Modal.getInstance(removeProductModalRef.current);
    modalInstance.show();
  }

  const handleRemoveProductModalHide = () => {
    const modalInstance = Modal.getInstance(removeProductModalRef.current);
    modalInstance.hide();
  };




  const [tempProduct, setTempProduct] = useState(defaultModalState);

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
  const handleFileChange = async(e) => {
    console.dir(e.target.files);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file-to-upload', file);
    // formData.forEach((value, key) => {
    //   console.log(`${key}:`, value);
    // });
    
    try {
      const res = await axios.post(`${baseUrl}/v2/api/${apiPath}/admin/upload`,formData);
      const uploadImgUrl =res.data.imageUrl;
      setTempProduct({
        ...tempProduct,
        imageUrl: uploadImgUrl
      })
    } catch (error) {
      console.log("上傳失敗");
      
    }
    
  }


  //分頁
  const [pageInfo, setPageInfo] = useState({});

  const handlePageChange = (page) => {
    getProducts(page)
  }

  return (
    <>

      {isAuth ? (
        <><div className="container py-5">
          <div className="row">
            <div className="col">
              <div className="d-flex justify-content-between">
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
              </table>
            </div>
            <div className="d-flex justify-content-center">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${!pageInfo.has_pre && "disabled"}`}>
                    <a className="page-link" href="#" onClick={() => handlePageChange(pageInfo.current_page - 1)}>
                      上一頁
                    </a>
                  </li>
                  {/* page-item
      page-link */}
                  {Array.from({ length: pageInfo.total_pages }).map((_, index) => (
                    <li key={index} className={`page-item ${pageInfo.current_page === index + 1 && "active"}`}>
                      <a className="page-link" href="#" onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                      </a>
                    </li>))}



                  <li className={`page-item ${!pageInfo.has_next && "disabled"}`}>
                    <a className="page-link" href="#" onClick={() => handlePageChange(pageInfo.current_page + 1)}>
                      下一頁
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div></>) : (<div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <h1 className="mb-5">請先登入</h1>
          <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
            <div className="form-floating mb-3">
              <input type="email" name="username" value={account.username} onChange={handleInputChange} className="form-control" id="username" placeholder="name@example.com" />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input type="password" name="password" value={account.password} onChange={handleInputChange} className="form-control" id="password" placeholder="Password" />
              <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-primary">登入</button>
          </form>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>)}

      <div ref={productModalRef} className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
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

      <div
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
      </div>
    </>
  )
}

export default App
