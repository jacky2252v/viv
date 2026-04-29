import React from "react";
import { useNavigate } from "react-router";
function SignInForm() {
    const [state, setState] = React.useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate()
    const handleChange = evt => {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });
    };

    const handleOnSubmit = async evt => {
        evt.preventDefault();

        const { email, password } = state;
        if (email === "admin@gmail.com" &&  password === "1234") {
            navigate("/admin")
        } else {
            try {
                const response = await fetch('http://localhost:4000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();
                console.log("...", data)

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    alert("Login successful!");
                    navigate("/post")
                } else {
                    alert(data.message || "Login failed");
                }
            } catch (err) {
                console.error("Network error:", err);
            }
        }

        for (const key in state) {
            setState({
                ...state,
                [key]: ""
            });
        }
    };

    return (
        <div className="form-container sign-in-container">
            <form onSubmit={handleOnSubmit}>
                <h1>Sign in</h1>
                <span>or use your account</span>
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={state.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={state.password}
                    onChange={handleChange}
                />
                <a href="#">Forgot your password?</a>
                <button>Sign In</button>
            </form>
        </div>
    );
}

export default SignInForm;