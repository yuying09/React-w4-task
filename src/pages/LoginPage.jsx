import axios from "axios";
import {  useState,useEffect } from "react";
const baseUrl = import.meta.env.VITE_BASE_URL;

function LoginPage({setIsAuth}) {
    const [account, setAccount] = useState({
        "username": "example@test.com",
        "password": "example"
      })
    
    //   const checkLogin = async () => {
    //     try {
    //       await axios.post(`${baseUrl}/v2/api/user/check`);
    //       getProducts();
    //       setIsAuth(true);
    //     } catch (error) {
    //       console.log("請登入");
    //     }
    //   }
    //   useEffect(() => {
    //     const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1",);
    
    //     axios.defaults.headers.common['Authorization'] = token;
    //     checkLogin();
    
    //   }, []);
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
            const { token, expired } = res.data;
            document.cookie = `token=${token};expires=${new Date(expired)}`;
            axios.defaults.headers.common[`Authorization`] = token;
            setIsAuth(true);
        } catch (error) {
            alert("登入失敗請重試")
        }
    }
    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
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
        </div>)
}

export default LoginPage