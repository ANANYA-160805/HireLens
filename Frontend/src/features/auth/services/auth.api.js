import axios from "axios"


const api = axios.create({
    baseURL: "/api",
    withCredentials: true
})

export async function register({ username, email, password }) {

    try {
        const response = await api.post('/auth/register', {
            username, email, password
        })

        return response.data

    } catch (err) {
        console.error("Register Error:", err)
        throw err
    }

}

export async function login({ email, password }) {

    try {

        const response = await api.post("/auth/login", {
            email, password
        })

        return response.data

    } catch (err) {
        console.error("Login Error:", err)
        throw err
    }

}

export async function logout() {
    try {

        const response = await api.get("/auth/logout")

        return response.data

    } catch (err) {
        console.error("Logout Error:", err)
        throw err
    }
}

export async function getMe() {

    try {

        const response = await api.get("/auth/get-me")

        return response.data

    } catch (err) {
        console.error("Get Me Error:", err)
        throw err
    }
}