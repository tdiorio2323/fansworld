import { useState } from "react";

export default function VIP() {
    const [username, setUsername] = useState("");
    const [code, setCode] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 🔑 Replace with real validation later
        if (username && code) {
            alert(`Welcome ${username}! Your VIP code is ${code}`);
        } else {
            alert("Please enter both username and VIP code.");
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
            <div className="bg-white/10 p-8 rounded-xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center">VIP Access</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 rounded bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                        type="text"
                        placeholder="VIP Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full px-4 py-2 rounded bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <button
                        type="submit"
                        className="w-full py-2 bg-purple-500 hover:bg-purple-600 rounded font-semibold"
                    >
                        Enter
                    </button>
                </form>
            </div>
        </main>
    );
}
