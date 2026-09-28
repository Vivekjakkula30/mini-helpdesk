// Backend ka base URL environment variable se aa raha hai
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Common FetchService function
const fetchService = async (endpoint, options = {}) => {
    const {
        method = "GET",
        body,
        headers = {}
    } = options;

    // Browser ke localStorage se JWT token read kar rahe hain
    const token = localStorage.getItem("token");

    // Check kar rahe hain ki body FormData hai ya nahi
    const isFormData = body instanceof FormData;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,

        headers: {
            // JSON request ke liye Content-Type set hoga
            // FormData ke liye browser automatically Content-Type set karega
            ...(!isFormData && {
                "Content-Type": "application/json"
            }),

            ...(token && {
                Authorization: `Bearer ${token}`
            }),

            ...headers  //This means if a particular API sends custom headers, they can still be added.
        },

        // FormData ko directly send karenge
        // JSON body ko stringify karenge
        body: body
            ? isFormData
                ? body
                : JSON.stringify(body)
            : undefined
    });

    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
};

export default fetchService;