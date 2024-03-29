import { useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function AuthContextProvider(props: any) {

	const [authTokens, setAuthTokens] = useState(() =>
		localStorage.getItem("tokens")
			? JSON.parse(localStorage.getItem("tokens") as string)
			: ""
	);
	const [user, setUser] = useState(() =>
		localStorage.getItem("tokens")
			? jwt_decode(JSON.parse(localStorage.getItem("tokens") as string).access)
			: ""
	);

	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	const loginUser = async (values: any, { setSubmitting, setFieldError }: any) => {
		try {
			const response = await axios.post("http://127.0.0.1:8000/api/token/", {
				username: values.username,
				password: values.password,
			});

			if (response.status === 200) {
				setAuthTokens(response.data);
				setUser(jwt_decode(response.data.access));
				localStorage.setItem("tokens", JSON.stringify(response.data));
				navigate("/");
			} else {
				setFieldError("password", "Something went wrong");
			}
		} catch (error: any) {
			if (error.response.status === 401) {
				error.response.data.detail ===
					"No active account found with the given credentials"
					? setFieldError(
						"password",
						"No account found with the given credentials"
					)
					: setFieldError("password", "Invalid username or password");
			} else {
				setFieldError("password", "Something went wrong");
			}
		} finally {
			setSubmitting(false);
		}
	};

	const logoutUser = () => {
		setAuthTokens(null);
		setUser(null);
		localStorage.removeItem("tokens");
		navigate("/login");
	};

	const updateTokens = async () => {
		try {
			const response = await axios.post(
				"http://127.0.0.1:8000/api/token/refresh/",
				{
					refresh: authTokens.refresh,
				}
			);

			if (response.status === 200) {
				setAuthTokens(response.data);
				setUser(jwt_decode(response.data.access));
				localStorage.setItem("tokens", JSON.stringify(response.data));
			} else {
				logoutUser();
			}
		} catch (error: any) {
			if (error.response?.status === 401) {
				logoutUser();
				throw new Error("Refresh token is invalid");
			}
			else if (error.response?.status === 400) {
				logoutUser();
				throw new Error("Refresh token is expired");
			} else {
				logoutUser();
			}
		}
		finally {
			setLoading(false);
		}
	};

	let runOnce = true;

	useEffect(() => {
		if (loading && runOnce) {
			updateTokens();
		}
		runOnce = false;

		let interval = setInterval(() => {
			if (authTokens) {
				updateTokens();
			}
		}, 1000 * 60 * 5);

		return () => {
			clearInterval(interval);
		};
	}, [authTokens, loading]);

	const contextData = {
		user: user,
		authTokens: authTokens,
		loginUser: loginUser,
		logoutUser: logoutUser,
	};


	return (
		<AuthContext.Provider value={contextData}>
			{loading ? (
				<div className="flex items-center justify-center min-h-screen">
					<div className="w-full max-w-md p-4 bg-white rounded-md shadow-md">
						<h1 className="text-2xl font-semibold mb-4">Loading...</h1>
					</div>
				</div>
			) : (
				props.children
			)}
		</AuthContext.Provider>
	);
}
