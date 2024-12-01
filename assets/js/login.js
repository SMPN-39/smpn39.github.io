document.addEventListener("DOMContentLoaded", () => {
  console.log("Script login.js dimuat.");

  // Login menggunakan email dan password
  document.getElementById("loginButton").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Validasi input
    if (!email || !password) {
      showModal("Harap isi semua data!");
      return;
    }

    try {
      const response = await fetch(
        "https://backend-eight-phi-75.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Simpan token ke localStorage
        localStorage.setItem("token", data.token);
        alert("Login berhasil!");

        // Redirect berdasarkan role
        const userRole = parseJwt(data.token).role;
        if (userRole === "admin") {
          window.location.href =
            "/tokline.github.io/src/page/Admin/dashboard/index.html";
        } else if (userRole === "pelanggan") {
          window.location.href = "/tokline.github.io/index.html";
        }
      } else {
        showModal(data.message || "Login gagal!");
      }
    } catch (error) {
      console.error("Error:", error);
      showModal("Terjadi kesalahan saat mencoba login.");
    }
  });

  // Login menggunakan Google
  document.getElementById("googleLoginButton").addEventListener("click", () => {
    window.location.href =
      "https://backend-eight-phi-75.vercel.app/api/auth/google";
  });

  // Tangani callback Google login
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  console.log("URL saat ini:", window.location.href);
  console.log("Token dari URL:", token);

  if (token) {
    console.log("Token ditemukan di URL:", token);

    // Simpan token ke localStorage
    try {
      localStorage.setItem("token", token);
      console.log(
        "Token berhasil disimpan ke localStorage:",
        localStorage.getItem("token")
      );

      // Bersihkan URL dengan redirect manual
      setTimeout(() => {
        const baseUrl = window.location.origin + window.location.pathname;
        console.log("Mengalihkan ke URL tanpa query:", baseUrl);
        window.location.replace(baseUrl);
      }, 100);
    } catch (error) {
      console.error("Gagal menyimpan token ke localStorage:", error);
    }

    // Parse role user dari token
    const userRole = parseJwt(token).role;

    // Redirect berdasarkan role
    if (userRole === "admin") {
      window.location.href =
        "/tokline.github.io/src/page/Admin/dashboard/index.html";
    } else if (userRole === "pelanggan") {
      window.location.href = "/tokline.github.io/index.html";
    }
  } else {
    console.log("Token tidak ditemukan di URL.");
  }
});

// Fungsi untuk mem-parse JWT
function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join("")
  );

  return JSON.parse(jsonPayload);
}

// Fungsi untuk menampilkan modal error
function showModal(message) {
  const modal = document.getElementById("modalAlert");
  modal.querySelector("p").innerText = message;
  modal.classList.remove("hidden");

  document.getElementById("closeModal").addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}

// Event listener untuk tombol WhatsApp Login
document.getElementById("whatsappLogin").addEventListener("click", function () {
  window.location.href = "./../../../src/page/whatsauth/index.html";
});

// Redirect ke signup.html dengan efek loading
const loadingOverlay = document.getElementById("loadingOverlay");
document
  .getElementById("signupRedirect")
  .addEventListener("click", function (e) {
    e.preventDefault(); // Mencegah perilaku default
    loadingOverlay.classList.remove("hidden"); // Tampilkan overlay loading
    setTimeout(() => {
      window.location.href = "./signup.html"; // Redirect setelah 2 detik
    }, 2000);
  });
