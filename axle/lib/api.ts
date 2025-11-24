export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const res = await fetch(`${API_URL}${endpoint}`,{
        ...options,
        credentials: "include",
        headers : {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
    });

    let data;
    try {
        data = await res.json();
    } catch {
        data = await res.text();
    }

    if (!res.ok) throw new Error(data?.error || data || "Request failed");
    return data;
}

export default apiRequest;