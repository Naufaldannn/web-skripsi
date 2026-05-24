document.addEventListener("DOMContentLoaded", () => {
   // ==========================================
   // 1. DATA & UI ELEMENTS
   // ==========================================
   const layananData = [
      { id: 1, nama: "Izin Apotek", instansi: "Dinas Kesehatan" },
      {
         id: 2,
         nama: "Izin Praktik Psikolog Klinis",
         instansi: "Dinas Kesehatan",
      },
      {
         id: 3,
         nama: "Izin Pendirian SMP Swasta",
         instansi: "Dinas Pendidikan",
      },
      {
         id: 4,
         nama: "Izin Trayek Angkatan Umum",
         instansi: "Dinas Perhubungan",
      },
      { id: 5, nama: "Izin Usaha Perikanan", instansi: "Dinas Perikanan" },
   ];

   const modals = {
      login: document.getElementById("loginModal"),
      register: document.getElementById("registerModal"),
      verify: document.getElementById("verifyModal"),
      reset: document.getElementById("resetModal"),
      success: document.getElementById("successModal"),
      pengajuan: document.getElementById("modalOverlay"),
      formDetail: document.getElementById("modalFormDetail"),
   };

   const buttons = {
      navMasuk: document.getElementById("btn-nav-masuk"),
      heroMasuk: document.getElementById("btn-masuk-utama"),
      linkDaftar: document.querySelector(".signup-text a"),
      linkLupaPass: document.querySelector(".forgot-link"),
      batalReg: document.getElementById("btnBatalReg"),
      verifikasiSekarang: document.querySelector("#verifyModal .btn-login"),
      mulaiUlang: document.getElementById("btnMulaiUlang"),
      btnAjukan: document.getElementById("openModal"),
      btnBatalAjukan: document.getElementById("cancelBtn"),
   };

   const forms = {
      register: document.getElementById("registerForm"),
      reset: document.getElementById("resetForm"),
      login: document.getElementById("loginForm"),
      pengajuan: document.getElementById("formIzin"),
      finalPengajuan: document.getElementById("formFinalPengajuan"),
      editProfil: document.querySelector(".form-card form"),
   };

   const tableElements = {
      body: document.getElementById("tableBody"),
      emptyRow: document.getElementById("emptyRow"),
   };

   const otpInputs = document.querySelectorAll(".otp-input");

   let pengajuanCounter = 0;
   let mainCounter = 0;

   // ==========================================
   // 2. MODAL CONTROLLER
   // ==========================================
   const closeAllModals = () => {
      Object.values(modals).forEach((modal) => {
         if (modal) modal.style.display = "none";
      });
   };

   const openModal = (modalElement) => {
      if (!modalElement) return;
      closeAllModals();
      modalElement.style.display = "flex";
   };

   // ==========================================
   // 3. RENDER & HELPER FUNCTIONS
   // ==========================================
   const renderModalServices = () => {
      const modalServiceList = document.getElementById("modalServiceList");
      if (!modalServiceList) return;

      modalServiceList.innerHTML = layananData
         .map(
            (item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.nama}</td>
                <td>${item.instansi}</td>
                <td style="text-align: center;">
                    <button class="btn-add-service" onclick="tahapDuaForm('${item.nama}', '${item.instansi}')">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </td>
            </tr>
        `,
         )
         .join("");
   };

   window.tahapDuaForm = (namaLayanan, instansi) => {
      const serviceInput = document.getElementById("selectedService");
      const instansiInput = document.getElementById("selectedInstansi");
      const labelLayanan = document.getElementById("labelLayananTerpilih");
      const inputNIK = document.getElementById("formNIK");
      const inputNama = document.getElementById("formNama");

      if (serviceInput) serviceInput.value = namaLayanan;
      if (instansiInput) instansiInput.value = instansi;
      if (labelLayanan) labelLayanan.innerText = namaLayanan;

      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
         const user = JSON.parse(storedUser);

         if (inputNIK) {
            inputNIK.value = user.nik || "";
            inputNIK.readOnly = true;
            inputNIK.style.backgroundColor = "#f0f0f0";
         }

         if (inputNama) {
            inputNama.value = user.nama || "";
            inputNama.readOnly = true;
            inputNama.style.backgroundColor = "#f0f0f0";
         }
      }

      if (modals.pengajuan) modals.pengajuan.style.display = "none";
      if (modals.formDetail) modals.formDetail.style.display = "flex";
   };

   // ==========================================
   // 4. PEMUATAN DATA PROFIL PENGGUNA
   // ==========================================
   const loadProfileData = () => {
      const storedUser = localStorage.getItem("currentUser");

      if ((window.location.pathname.includes("home-pemohon") || window.location.pathname.includes("edit-profile")) && !storedUser) {
         window.location.href = "index.html";
         return;
      }

      if (!storedUser && !window.location.pathname.includes("index.html")) {
         window.location.href = "index.html";
         return;
      }

      if (storedUser) {
         const user = JSON.parse(storedUser);

         const path = window.location.pathname;
         if (path.includes("home-dinas1") && user.role !== "dinas1") {
            window.location.href = "home-pemohon.html";
         } else if (path.includes("home-dinas2") && user.role !== "dinas2") {
            window.location.href = "home-pemohon.html";
         } else if (path.includes("home-dinas3") && user.role !== "dinas3") {
            window.location.href = "home-pemohon.html";
         } else if (path.includes("home-dinas4") && user.role !== "dinas4") {
            window.location.href = "home-pemohon.html";
         }

         const userProfileText = document.getElementById("userProfileText");
         if (userProfileText) {
            userProfileText.innerHTML = `${user.username || "@user"}<br><strong>${user.nama || "Nama Lengkap"}</strong>`;
         }

         const editForm = forms.editProfil;
         if (editForm) {
            editForm.querySelector('input[type="text"][placeholder*="NIK"], input[type="text"][placeholder*="NIK/KITAS/KITAP"]').value = user.nik || "";
            editForm.querySelector('input[type="text"][placeholder*="Nama Lengkap"]').value = user.nama || "";
            editForm.querySelector('input[type="text"][placeholder*="Tempat Tanggal Lahir"]').value = user.ttl || "";
            editForm.querySelector('input[type="text"][placeholder*="Username"]').value = user.username || "";
            editForm.querySelector('input[type="password"]').value = user.password || "";
         }
      }
   };
   loadProfileData();

   // ==========================================
   // 5. EVENT LISTENERS - AUTH & PROFIL
   // ==========================================
   [buttons.navMasuk, buttons.heroMasuk].forEach((btn) => {
      btn?.addEventListener("click", () => openModal(modals.login));
   });

   buttons.linkDaftar?.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(modals.register);
   });

   buttons.linkLupaPass?.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(modals.verify);
   });

   buttons.verifikasiSekarang?.addEventListener("click", () => {
      openModal(modals.reset);
   });

   buttons.mulaiUlang?.addEventListener("click", () => {
      if (modals.success) {
         modals.success.style.display = "none";
      }
   });

   // ==========================================
   // 6. EVENT LISTENERS - PENGAJUAN
   // ==========================================
   buttons.btnAjukan?.addEventListener("click", () => {
      renderModalServices();
      openModal(modals.pengajuan);
   });

   buttons.btnBatalAjukan?.addEventListener("click", closeAllModals);

   forms.finalPengajuan?.addEventListener("submit", (e) => {
      e.preventDefault();

      const service = document.getElementById("selectedService")?.value || "";
      const instansi = document.getElementById("selectedInstansi")?.value || "";
      const isPerpanjangan = document.getElementById("isPerpanjangan")?.checked;
      const tipe = isPerpanjangan ? "Perpanjangan" : "Izin Baru";

      const dateApply = document.getElementById("formDate")?.value || "Tanggal Permohonan";
      const nikPemohon = document.getElementById("formNIK")?.value || "NIK";
      const namaPemohon = document.getElementById("formNama")?.value || "Pemohon";

      if (mainCounter === 0 && tableElements.emptyRow) {
         tableElements.body.innerHTML = "";
      }
      mainCounter++;

      const fileSerahTerima = "Tanda-Terima-" + Math.floor(Math.random() * 10000) + ".pdf";

      const progressUI = `
            <div class="status-progress-wrapper action-timeline-icon" style="cursor: pointer;">
                <div class="status-step active"><input type="checkbox" checked disabled><span>1</span></div>
                <div class="status-step"><input type="checkbox"><span>2</span></div>
                <div class="status-step"><input type="checkbox"><span>3</span></div>
                <div class="status-step"><input type="checkbox"><span>4</span></div>
            </div>
        `;

      const row = `
            <tr>
                <td>${mainCounter}</td>
                <td>
                    <div style="font-weight: 600;">${dateApply}</div>
                    <div style="display: inline-block; background-color: #d8eafe; color: #1a4fa0; padding: 4px 12px; border-radius: 5px; font-size: 0.6rem; font-weight: 400;">
                            <i class="fa-solid fa-file-pdf" style="margin-right: 4px;"></i> ${fileSerahTerima}
                    </div>
                </td>
                <td>
                    <div style="font-size: 0.8rem; color: #777;">${nikPemohon}</div>
                    <div style="font-weight: 600;">${namaPemohon}</div>
                </td>
                <td>
                    <div style="font-weight: 600;">${instansi}</div>
                    <div style="font-size: 0.8rem; color: #777;">${service}</div>
                    <div style="display: inline-block; background-color: #d8eafe; color: #1a4fa0; padding: 4px 12px; border-radius: 5px; font-size: 0.6rem; font-weight: 400;">${tipe}</div>
                </td>
                <td>${progressUI}</td>
                <td>
                    <i class="fa-solid fa-file-lines action-upload-icon" style="cursor: pointer; color: #1a4fa0;"></i>
                    <i class="fa-regular fa-comment action-comment-icon" style="margin-left: 10px;"></i>
                </td>
            </tr>`;

      tableElements.body.insertAdjacentHTML("beforeend", row);

      if (modals.formDetail) modals.formDetail.style.display = "none";

      if (modals.success) {
         modals.success.style.display = "flex";
      }

      document.getElementById("formFinalPengajuan").reset();
   });

   // ==========================================
   // 7. EDIT PROFIL & SIMPAN PERUBAHAN
   // ==========================================
   if (forms.editProfil) {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
         const user = JSON.parse(storedUser);
         const inputs = forms.editProfil.querySelectorAll("input");
         if (inputs.length >= 5) {
            inputs[0].value = user.nik || "";
            inputs[1].value = user.nama || "";
            inputs[2].value = user.ttl || "";
            inputs[3].value = user.username || "";
            inputs[4].value = user.password || "";
         }
      }

      forms.editProfil.addEventListener("submit", (e) => {
         e.preventDefault();

         const inputs = forms.editProfil.querySelectorAll("input");
         const storedUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

         const updatedUser = {
            ...storedUser,
            nik: inputs[0].value,
            nama: inputs[1].value,
            ttl: inputs[2].value,
            username: inputs[3].value,
            password: inputs[4].value,
         };

         localStorage.setItem("currentUser", JSON.stringify(updatedUser));
         alert("Profil berhasil diperbarui!");
         if (updatedUser.role === "dinas1") {
            window.location.href = "home-dinas1.html";
         } else if (updatedUser.role === "dinas2") {
            window.location.href = "home-dinas2.html";
         } else if (updatedUser.role === "dinas3") {
            window.location.href = "home-dinas3.html";
         } else if (updatedUser.role === "dinas4") {
            window.location.href = "home-dinas4.html";
         } else {
            window.location.href = "home-pemohon.html";
         }
      });

      const btnBatal = forms.editProfil.querySelector(".btn-cancel") || forms.editProfil.querySelector(".btn-batal");
      btnBatal?.addEventListener("click", () => {
         const storedUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
         if (storedUser.role === "dinas1") {
            window.location.href = "home-dinas1.html";
         } else if (storedUser.role === "dinas2") {
            window.location.href = "home-dinas2.html";
         } else if (storedUser.role === "dinas3") {
            window.location.href = "home-dinas3.html";
         } else if (storedUser.role === "dinas4") {
            window.location.href = "home-dinas4.html";
         } else {
            window.location.href = "home-pemohon.html";
         }
      });
   }

   // ==========================================
   // 8. GENERAL CONTROLS & LISTENERS
   // ==========================================
   document.querySelectorAll(".close-btn").forEach((btn) => {
      btn.addEventListener("click", closeAllModals);
   });

   buttons.batalReg?.addEventListener("click", closeAllModals);

   [document.getElementById("closeModal"), document.getElementById("closeFormDetail"), document.getElementById("btnBatalForm")].forEach((btn) => {
      btn?.addEventListener("click", () => {
         if (modals.pengajuan) modals.pengajuan.style.display = "none";
         if (modals.formDetail) modals.formDetail.style.display = "none";
      });
   });

   window.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-overlay") || e.target === modals.pengajuan || e.target === modals.formDetail) {
         closeAllModals();
      }
   });

   const btnCloseSuccess = document.getElementById("closeSuccess");
   btnCloseSuccess?.addEventListener("click", () => {
      if (modals.success) {
         modals.success.style.display = "none";
      }
   });

   // ==========================================
   // 9. OTP LOGIC
   // ==========================================
   otpInputs.forEach((input, index) => {
      input.addEventListener("input", (e) => {
         if (e.target.value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
         }
      });

      input.addEventListener("keydown", (e) => {
         if (e.key === "Backspace" && !e.target.value && index > 0) {
            otpInputs[index - 1].focus();
         }
      });
   });

   // ==========================================
   // 10. AUTH SUBMISSIONS
   // ==========================================

   // --- REGISTER SUBMISSIONS ---
   forms.register?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = forms.register.querySelector("button[type='submit']");
      const originalText = submitBtn.innerText;
      const inputs = forms.register.querySelectorAll("input");
      const nikInput = inputs[0].value;
      const usernameInput = inputs[1].value;
      const namaInput = inputs[2].value;
      const passwordInput = inputs[3].value;
      const tempatLahir = inputs[4].value;
      const tanggalLahir = inputs[5].value;
      const ttlLengkap = `${tempatLahir}, ${tanggalLahir}`;

      submitBtn.innerText = "Mendaftarkan...";
      submitBtn.disabled = true;

      try {
         const response = await fetch("../../database/users.json");
         const data = await response.json();
         const localUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");

         const isNikExists = data.users.some((user) => user.nik === nikInput) || localUsers.some((user) => user.nik === nikInput);

         setTimeout(() => {
            if (isNikExists) {
               alert("Gagal Mendaftar: NIK " + nikInput + " sudah terdaftar!");
            } else {
               const newUser = {
                  nik: nikInput,
                  nama: namaInput,
                  ttl: ttlLengkap,
                  username: usernameInput,
                  password: passwordInput,
                  role: "user",
               };

               localUsers.push(newUser);
               localStorage.setItem("registeredUsers", JSON.stringify(localUsers));

               alert("Pendaftaran berhasil! Silahkan login.");
               closeAllModals();
               if (modals.login) openModal(modals.login);
            }
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
         }, 1000);
      } catch (err) {
         console.error("Kesalahan fetch database:", err);
         alert("Gagal terhubung ke database.");
         submitBtn.innerText = originalText;
         submitBtn.disabled = false;
      }
   });

   // --- LOGIN SUBMISSIONS ---
   forms.login?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = forms.login.querySelector("button");
      const originalText = submitBtn.innerText;

      submitBtn.innerText = "Memproses...";
      submitBtn.disabled = true;

      try {
         const response = await fetch("../../database/users.json");
         const data = await response.json();

         const usernameInput = document.getElementById("username").value;
         const passwordInput = document.getElementById("password").value;

         const localUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
         const allUsers = [...data.users, ...localUsers];

         const matchedUser = allUsers.find((u) => u.username === usernameInput && u.password === passwordInput);

         setTimeout(() => {
            if (matchedUser) {
               localStorage.setItem("currentUser", JSON.stringify(matchedUser));
               if (matchedUser.role === "dinas1") window.location.href = "home-dinas1.html";
               else if (matchedUser.role === "dinas2") window.location.href = "home-dinas2.html";
               else if (matchedUser.role === "dinas3") window.location.href = "home-dinas3.html";
               else if (matchedUser.role === "dinas4") window.location.href = "home-dinas4.html";
               else window.location.href = "home-pemohon.html";
            } else {
               alert("Username atau kata sandi salah!");
            }
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
         }, 1000);
      } catch (err) {
         alert("Database tidak ditemukan.");
         submitBtn.innerText = originalText;
         submitBtn.disabled = false;
      }
   });

   forms.reset?.addEventListener("submit", (e) => {
      e.preventDefault();
      openModal(modals.success);
   });

   // ==========================================
   // 11. DROPDOWN & NOTIFICATION CONTROLS & LOGOUT
   // ==========================================
   const profileTrigger = document.getElementById("profileDropdownTrigger");
   const profileDropdown = document.getElementById("profileDropdown");
   const notifTrigger = document.getElementById("notifTrigger");
   const notifDropdown = document.getElementById("notifDropdown");
   const btnLogout = document.getElementById("btnLogout");
   const unreadBadge = document.getElementById("unreadBadge");

   const logoutModal = document.getElementById("logoutConfirmModal");
   const btnBatalLogout = document.getElementById("btnBatalLogout");
   const btnYaLogout = document.getElementById("btnYaLogout");

   profileTrigger?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (notifDropdown?.classList.contains("show")) {
         notifDropdown.classList.remove("show");
      }
      profileDropdown?.classList.toggle("show");
   });

   notifTrigger?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (profileDropdown?.classList.contains("show")) {
         profileDropdown.classList.remove("show");
      }

      notifDropdown?.classList.toggle("show");

      if (unreadBadge) {
         unreadBadge.style.display = "none";
      }

      document.querySelectorAll(".notif-item.unread").forEach((item) => {
         item.classList.remove("unread");
      });
   });

   window.addEventListener("click", () => {
      if (profileDropdown?.classList.contains("show")) {
         profileDropdown.classList.remove("show");
      }
      if (notifDropdown?.classList.contains("show")) {
         notifDropdown.classList.remove("show");
      }
   });

   btnLogout?.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();

      if (profileDropdown?.classList.contains("show")) {
         profileDropdown.classList.remove("show");
      }

      if (logoutModal) {
         logoutModal.style.display = "flex";
      }
   });

   btnBatalLogout?.addEventListener("click", () => {
      if (logoutModal) {
         logoutModal.style.display = "none";
      }
   });

   btnYaLogout?.addEventListener("click", () => {
      console.log("Logout Berhasil");
      localStorage.removeItem("currentUser");
      window.location.href = "index.html";
   });

   window.addEventListener("click", (e) => {
      if (e.target === logoutModal) {
         logoutModal.style.display = "none";
      }
   });

   // ==========================================
   // 12. COMMENT MODAL LOGIC
   // ==========================================
   const commentModal = document.getElementById("commentModal");
   const commentSuccessModal = document.getElementById("commentSuccessModal");
   const commentForm = document.getElementById("commentForm");
   const closeCommentModal = document.getElementById("closeCommentModal");
   const btnBatalComment = document.getElementById("btnBatalComment");
   const closeSuccessComment = document.getElementById("closeSuccessComment");
   const btnSuccessClose = document.getElementById("btnSuccessClose");

   document.addEventListener("click", (e) => {
      if (e.target && e.target.classList.contains("action-comment-icon")) {
         if (commentModal) {
            commentModal.style.display = "flex";
         }
      }
   });

   [closeCommentModal, btnBatalComment, closeSuccessComment, btnSuccessClose].forEach((btn) => {
      btn?.addEventListener("click", () => {
         if (commentModal) commentModal.style.display = "none";
         if (commentSuccessModal) commentSuccessModal.style.display = "none";
      });
   });

   commentForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      document.getElementById("commentText").value = "";

      if (commentModal) commentModal.style.display = "none";
      if (commentSuccessModal) commentSuccessModal.style.display = "flex";
   });

   window.addEventListener("click", (e) => {
      if (e.target === commentModal) {
         commentModal.style.display = "none";
      }
      if (e.target === commentSuccessModal) {
         commentSuccessModal.style.display = "none";
      }
   });

   // ==========================================
   // 13. UPLOAD DOCUMENT MODAL DYNAMIC CONTROLLER
   // ==========================================
   const uploadModal = document.getElementById("uploadDocumentModal");
   const closeUploadModal = document.getElementById("closeUploadModal");
   const deleteDocModal = document.getElementById("deleteDocConfirmModal");
   const btnBatalHapusDoc = document.getElementById("btnBatalHapusDoc");
   const btnYaHapusDoc = document.getElementById("btnYaHapusDoc");
   let currentUploadRow = null;

   document.addEventListener("click", (e) => {
      if (e.target && e.target.classList.contains("action-upload-icon")) {
         const row = e.target.closest("tr");

         const layananLengkap = row.children[3].innerText.split("\n");
         const instansi = layananLengkap[0] || "Instansi";
         const service = layananLengkap[1] || "Layanan Surat";

         const pemohonData = row.children[2].innerText.split("\n");
         const formNIK = pemohonData[0] || "NIK";
         const formNama = pemohonData[1] || "Nama Pemohon";
         const tipe = row.children[3].querySelector("div:last-child")?.innerText || "Tipe";

         const docHeaderTitle = document.getElementById("docHeaderTitle");
         const uploadModal = document.getElementById("uploadDocumentModal");
         const closeUploadModal = document.getElementById("closeUploadModal");
         if (docHeaderTitle) {
            docHeaderTitle.innerText = `Upload Dokumen - ${service}`;
         }

         const docHeaderInfo = document.getElementById("docHeaderInfo");
         if (docHeaderInfo) {
            docHeaderInfo.innerHTML = `
                    <strong>${formNama}</strong><br>
                    NO. ${formNIK} / ${new Date().getFullYear()}<br>
                    ${service} - ${instansi}<br><br>
                    Lengkapi semua item persyaratan dibawah ini.<br>
                    Tombol <i class="fa-solid fa-upload"></i> (Ikon upload dokumen) untuk upload file dokumen (*.pdf), Tombol <i class="fa-regular fa-file-pdf"></i> (Ikon dokumen) untuk menampilkan file dokumen, Tombol <i class="fa-solid fa-trash"></i> (Ikon hapus) untuk menghapus file dokumen.<br><br>
                    <strong>Catatan :</strong> Semua item persyaratan harus ada/terupload.
                `;
         }

         if (uploadModal) {
            uploadModal.style.display = "flex";
         }
      }
      closeUploadModal?.addEventListener("click", () => {
         if (uploadModal) {
            uploadModal.style.display = "none";
         }
      });

      window.addEventListener("click", (e) => {
         if (e.target === uploadModal) {
            uploadModal.style.display = "none";
         }
      });
   });

   // ==========================================
   // 14. LOGIKA CRUD DOKUMEN DALAM MODAL
   // ==========================================
   const documentTableBody = document.getElementById("documentTableBody");

   documentTableBody?.addEventListener("click", (e) => {
      if (e.target.classList.contains("fa-upload")) {
         const row = e.target.closest("tr");
         const fileInput = document.createElement("input");
         fileInput.type = "file";
         fileInput.accept = ".pdf";

         fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
               const statusSpan = row.querySelector("td span");
               if (statusSpan) {
                  statusSpan.innerText = "ADA";
                  statusSpan.style.backgroundColor = "#e6f4ea";
                  statusSpan.style.color = "#137333";
               }
               alert(`File "${file.name}" berhasil diunggah!`);
            }
         };

         fileInput.click();
      }

      if (e.target.classList.contains("fa-file-pdf")) {
         const row = e.target.closest("tr");
         const statusText = row.querySelector("td span").innerText;

         if (statusText === "TIDAK ADA") {
            alert("Anda belum mengunggah dokumen.");
         } else {
            alert("Membuka dokumen yang telah diunggah...");
         }
      }

      if (e.target.classList.contains("fa-trash")) {
         const row = e.target.closest("tr");
         const statusText = row.querySelector("td span").innerText;

         if (statusText === "TIDAK ADA") {
            alert("Dokumen masih kosong, tidak ada yang dihapus.");
            return;
         }

         currentUploadRow = row;
         if (deleteDocModal) {
            deleteDocModal.style.display = "flex";
         }
      }
   });

   btnYaHapusDoc?.addEventListener("click", () => {
      if (currentUploadRow) {
         const statusSpan = currentUploadRow.querySelector("td span");
         if (statusSpan) {
            statusSpan.innerText = "TIDAK ADA";
            statusSpan.style.backgroundColor = "#fce8e6";
            statusSpan.style.color = "#c5221f";
         }
         if (deleteDocModal) {
            deleteDocModal.style.display = "none";
         }
         alert("Dokumen berhasil dihapus.");
      }
   });

   btnBatalHapusDoc?.addEventListener("click", () => {
      if (deleteDocModal) {
         deleteDocModal.style.display = "none";
      }
   });

   const currentPath = window.location.pathname;
   let currentDinasLevel = 1;

   if (currentPath.includes("home-dinas2")) currentDinasLevel = 2;
   else if (currentPath.includes("home-dinas3")) currentDinasLevel = 3;
   else if (currentPath.includes("home-dinas4")) currentDinasLevel = 4;

   // ==========================================
   // 15. TIMELINE MODAL CONTROLLER
   // ==========================================
   let currentRowTarget = null;
   const timelineModal = document.getElementById("timelineDocumentModal");
   const closeTimelineModal = document.getElementById("closeTimelineModal");

   document.addEventListener("click", (e) => {
      if (e.target && e.target.closest(".action-timeline-icon")) {
         const row = e.target.closest("tr");

         const status1 = row.getAttribute("data-status-fo") || "TERKIRIM";
         const statusDinas2 = row.getAttribute("data-status-dinas2") || "MENUNGGU";
         const statusDinas3 = row.getAttribute("data-status-dinas3") || "MENUNGGU";
         const statusDinas4 = row.getAttribute("data-status-dinas4") || "MENUNGGU";
         const rejectNote = row.getAttribute("data-reject-note") || "";

         const pemohonData = row.children[2]?.innerText.split("\n") || [];
         const formNIK = pemohonData[0] || "NIK";
         const formNama = pemohonData[1] || "Nama Pemohon";

         const layananLengkap = row.children[3]?.innerText.split("\n") || [];
         const instansi = layananLengkap[0] || "Instansi";
         const service = layananLengkap[1] || "Layanan Surat";

         const tanggalPengajuan = new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
         });

         const timelineTitle = document.getElementById("timelineHeaderTitle");
         if (timelineTitle) timelineTitle.innerText = `Tracking - ${service}`;

         const timelineInfo = document.getElementById("timelineHeaderInfo");
         if (timelineInfo) {
            timelineInfo.innerHTML = `
            <strong>Diajukan oleh:</strong> ${formNama} (${formNIK})<br>
            <strong>Instansi:</strong> ${instansi}<br>
            <strong>File Tanda Terima:</strong> Tanda_Terima_${formNIK}.pdf<br>
            <strong>Tanggal Permohonan:</strong> ${tanggalPengajuan}
         `;
         }

         const getStatusStyle = (status) => {
            const isBlue = status === "DISETUJUI" || status === "TERKIRIM";
            const isGray = status === "DIBATALKAN";

            return `
            display: inline-block; 
            background-color: ${isBlue ? "#d8eafe" : isGray ? "#f3f4f6" : "#fce8e6"}; 
            color: ${isBlue ? "#1a4fa0" : isGray ? "#6b7280" : "#c5221f"}; 
            padding: 2px 8px; border-radius: 5px; font-size: 0.65rem; font-weight: 600; margin-top: 5px;
         `;
         };

         const timelineItemsContainer = document.getElementById("timelineItemsContainer");
         if (timelineItemsContainer) {
            timelineItemsContainer.innerHTML = `
            <div class="timeline-item active">
               <div class="timeline-icon-box"><i class="fa-solid fa-user"></i></div>
               <div class="timeline-content-box">
                  <div class="timeline-text-group">
                     <h4>Data Pemohon</h4>
                     <p><strong>${formNama}</strong> - ${formNIK}</p>
                  </div>
               </div>
            </div>

            <div class="timeline-item active">
               <div class="timeline-icon-box"><i class="fa-solid fa-envelope"></i></div>
               <div class="timeline-content-box">
                  <div class="timeline-text-group">
                     <h4>Registrasi Permohonan</h4>
                     <p>${service} - ${instansi}</p>
                  </div>
                  <div class="timeline-date-group">
                     <span style="color: #64748b;">Waktu Create:</span><br>
                     <span style="color: #1a4fa0; font-weight: 600;">${tanggalPengajuan}</span>
                  </div>
               </div>
            </div>

            <div class="timeline-item active">
               <div class="timeline-icon-box" style="${status1 === "DITOLAK" ? "background-color: #ef4444;" : ""}">
                  <i class="fa-solid ${status1 === "DITOLAK" ? "fa-xmark" : "fa-user-tie"}" 
                     style="${status1 === "DITOLAK" ? "color: #ffffff;" : ""}"></i>
               </div>
               <div class="timeline-content-box">
                  <div class="timeline-text-group">
                     <h4>Dinas 1</h4>
                     <span style="${getStatusStyle(status1)}">${status1}</span>
                     ${status1 === "DITOLAK" ? `<p style="color: #b91c1c; font-size: 0.75rem; margin-top: 5px;">Alasan: ${rejectNote}</p>` : ""}
                  </div>
               </div>
            </div>

            <div class="timeline-item ${statusDinas2 !== "MENUNGGU" ? "active" : ""}">
               <div class="timeline-icon-box" style="${statusDinas2 === "DITOLAK" ? "background-color: #ef4444;" : ""}">
                  <i class="fa-solid ${statusDinas2 === "DITOLAK" ? "fa-xmark" : "fa-user-tie"}" 
                     style="${statusDinas2 === "DITOLAK" ? "color: #ffffff;" : ""}"></i>
               </div>
               <div class="timeline-content-box">
                  <div class="timeline-text-group">
                     <h4>Dinas 2</h4>
                     <span style="${getStatusStyle(statusDinas2)}">${statusDinas2}</span>
                     ${statusDinas2 === "DITOLAK" ? `<p style="color: #b91c1c; font-size: 0.75rem; margin-top: 5px;">Alasan: ${rejectNote}</p>` : ""}
                  </div>
               </div>
            </div>

            <div class="timeline-item ${statusDinas3 !== "MENUNGGU" ? "active" : ""}">
               <div class="timeline-icon-box" style="${statusDinas3}">
                  <i class="fa-solid ${statusDinas3 === "DITOLAK" ? "fa-xmark" : "fa-user-tie"}" 
                     style="${statusDinas3 === "DITOLAK" ? "color: #ffffff;" : ""}"></i>
               </div>
               <div class="timeline-content-box">
                  <div class="timeline-text-group">
                     <h4>Dinas 3</h4>
                     <span style="${getStatusStyle(statusDinas3)}">${statusDinas3}</span>
                     ${statusDinas3 === "DITOLAK" ? `<p style="color: #b91c1c; font-size: 0.75rem; margin-top: 5px;">Alasan: ${rejectNote}</p>` : ""}
                  </div>
               </div>
            </div>

            <div class="timeline-item ${statusDinas4 !== "MENUNGGU" ? "active" : ""}">
               <div class="timeline-icon-box" style="${statusDinas4 === "DITOLAK" ? "background-color: #ef4444;" : ""}">
                  <i class="fa-solid ${statusDinas4 === "DITOLAK" ? "fa-xmark" : "fa-user-tie"}" 
                     style="${statusDinas4 === "DITOLAK" ? "color: #ffffff;" : ""}"></i>
               </div>
               <div class="timeline-content-box">
                  <div class="timeline-text-group">
                     <h4>Dinas 4</h4>
                     <span style="${getStatusStyle(statusDinas4)}">${statusDinas4}</span>
                     ${statusDinas4 === "DITOLAK" ? `<p style="color: #b91c1c; font-size: 0.75rem; margin-top: 5px;">Alasan: ${rejectNote}</p>` : ""}
                  </div>
               </div>
            </div>
         `;
         }

         if (timelineModal) timelineModal.style.display = "flex";
      }
   });

   // ==========================================
   // 16. LOAD DATA DINAS DARI JSON (Dinamis per Halaman)
   // ==========================================
   const loadDinasTable = async () => {
      const tableBody = document.getElementById("tableBodyDinas");

      if (!window.location.pathname.includes("home-dinas") || !tableBody) return;

      try {
         const response = await fetch("../database/permohonan.json");
         const data = await response.json();

         if (data.pengajuan && data.pengajuan.length > 0) {
            tableBody.innerHTML = "";
            data.pengajuan.forEach((item, index) => {
               const attrD1 = currentDinasLevel > 1 ? "DISETUJUI" : "TERKIRIM";
               const attrD2 = currentDinasLevel === 2 ? "TERKIRIM" : currentDinasLevel > 2 ? "DISETUJUI" : "MENUNGGU";
               const attrD3 = currentDinasLevel === 3 ? "TERKIRIM" : currentDinasLevel > 3 ? "DISETUJUI" : "MENUNGGU";
               const attrD4 = currentDinasLevel === 4 ? "TERKIRIM" : "MENUNGGU";

               const renderStepBox = (stepNumber) => {
               if (currentDinasLevel > stepNumber) {
                  return `
                     <div class="status-step active">
                        <div class="custom-check-box" style="background-color: #1a4fa0; border: 1px solid #1a4fa0; width: 13px; height: 13px; border-radius: 3px; display: flex; align-items: center; justify-content: center;">
                           <i class="fa-solid fa-check" style="color: #ffffff; font-size: 9px;"></i>
                        </div>
                        <span>${stepNumber}</span>
                     </div>
                  `;
               } 
               else if (currentDinasLevel === stepNumber) {
                  return `
                     <div class="status-step active current-stage">
                        <input type="checkbox" checked disabled style="accent-color: #94a3b8; filter: grayscale(1); opacity: 0.7;">
                        <span>${stepNumber}</span>
                     </div>
                  `;
               } 
               else {
                  return `
                     <div class="status-step">
                        <input type="checkbox" disabled>
                        <span>${ stepNumber}</span>
                     </div>
                  `;
               }
            };

               const row = `
                <tr data-status-fo="${attrD1}" 
                    data-status-dinas2="${attrD2}" 
                    data-status-dinas3="${attrD3}" 
                    data-status-dinas4="${attrD4}">
                    <td>${index + 1}</td>
                    <td>
                        <div style="font-weight: 600;">${item.tanggal}</div>
                        <div style="display: inline-block; background-color: #d8eafe; color: #1a4fa0; padding: 4px 12px; border-radius: 5px; font-size: 0.6rem; font-weight: 400;">
                            <i class="fa-solid fa-file-pdf"></i> ${item.file_terima}
                        </div>
                    </td>
                    <td>
                        <div style="font-size: 0.8rem; color: #777;">${item.nik}</div>
                        <div style="font-weight: 600;">${item.nama}</div>
                    </td>
                    <td>
                        <div style="font-weight: 600;">${item.instansi}</div>
                        <div style="font-size: 0.8rem; color: #777;">${item.layanan}</div>
                        <div style="display: inline-block; background-color: #d8eafe; color: #1a4fa0; padding: 4px 12px; border-radius: 5px; font-size: 0.6rem; font-weight: 400;">${item.tipe}</div>
                    </td>
                    <td>
                        <div class="status-progress-wrapper action-timeline-icon" style="cursor: pointer;">
                            ${renderStepBox(1)} ${renderStepBox(2)} ${renderStepBox(3)} ${renderStepBox(4)} </div>
                    </td>
                    <td>
                        <i class="fa-solid fa-file-lines admin-view-doc" style="cursor: pointer; color: #1a4fa0;"></i>
                        <i class="fa-regular fa-comment admin-action-comment" style="cursor:pointer; margin-left: 10px;"></i>
                    </td>
                </tr>`;
               tableBody.insertAdjacentHTML("beforeend", row);
            });
         }
      } catch (err) {
         console.error("Gagal memuat data:", err);
      }
   };
   loadDinasTable();

   // ==========================================
   // 17. UPDATE STATUS UI HELPER (Dinamis per Level)
   // ==========================================
   const updateRowStatusUI = (row, action) => {
      const steps = row.querySelectorAll(".status-step");
      const targetIndex = currentDinasLevel - 1;
      const currentStep = steps[targetIndex];

      if (!currentStep) return;

      const getStepLabel = (level) => (level === 1 ? "1" : level);

      if (action === "setuju") {
         currentStep.classList.remove("rejected");
         currentStep.classList.add("active");
         currentStep.innerHTML = `
         <div class="custom-x-box" style="background-color: #1a4fa0; border: 1px solid #1a4fa0; width: 13px; height: 13px; border-radius: 3px; display: flex; align-items: center; justify-content: center;">
            <i class="fa-solid fa-check" style="color: #ffffff; font-size: 9px;"></i>
         </div>
         <span>${getStepLabel(currentDinasLevel)}</span>
      `;

         const nextIndex = currentDinasLevel;
         const nextStep = steps[nextIndex];
         if (nextStep) {
            nextStep.classList.add("active");
            nextStep.classList.remove("rejected");
            nextStep.innerHTML = `
            <input type="checkbox" checked disabled>
            <span>${getStepLabel(currentDinasLevel + 1)}</span>
         `;
         }
      } else if (action === "tolak") {
         currentStep.classList.remove("active");
         currentStep.classList.add("rejected");
         currentStep.innerHTML = `
         <div class="custom-x-box" style="background-color: #ef4444; border: 1px solid #ef4444; width: 13px; height: 13px; border-radius: 3px; display: flex; align-items: center; justify-content: center;">
            <i class="fa-solid fa-xmark" style="color: #ffffff; font-size: 9px;"></i>
         </div>
         <span>${getStepLabel(currentDinasLevel)}</span>
      `;

         for (let i = currentDinasLevel; i < steps.length; i++) {
            steps[i].classList.remove("active", "rejected");
            steps[i].innerHTML = `
            <input type="checkbox" disabled>
            <span>${getStepLabel(i + 1)}</span>
         `;
         }
      }
   };

   // ==========================================
   // 18. MODAL DOKUMEN, TERUSKAN & KOMENTAR (ADMIN)
   // ==========================================
   const adminDocModal = document.getElementById("adminDocModal");
   const adminForwardModal = document.getElementById("forwardModal");
   const adminForwardSuccess = document.getElementById("forwardSuccessModal");
   const adminDocHeaderInfo = document.getElementById("adminDocHeaderInfo");
   const adminDocHeaderTitle = document.getElementById("adminDocHeaderTitle");
   const adminCommentModal = document.getElementById("adminCommentModal");
   const adminCommentSuccess = document.getElementById("commentSuccessModal");
   const rejectModal = document.getElementById("rejectReasonModal");
   const rejectSuccessModal = document.getElementById("rejectSuccessModal");

   document.addEventListener("click", (e) => {
      const target = e.target;
      const row = target.closest("tr");

      if (row) currentRowTarget = row;

      if (target.classList.contains("fa-file-pdf")) {
         if (window.location.pathname.includes("home-dinas") && row) {
            const statusSpan = row.querySelector("td span");
            const statusText = statusSpan ? statusSpan.innerText.trim() : "";

            if (statusText === "TIDAK ADA") {
               alert("Anda belum mengunggah dokumen.");
            } else {
               alert("Membuka dokumen yang telah diunggah...");
            }
         }
      }

      if (target.classList.contains("admin-view-doc") || target.classList.contains("fa-file-lines")) {
         if (window.location.pathname.includes("home-dinas") && row) {
            const nikPemohon = row.children[2].querySelector("div:first-child").innerText;
            const namaPemohon = row.children[2].querySelector("div:last-child").innerText;
            const instansi = row.children[3].querySelector("div:first-child").innerText;
            const layanan = row.children[3].querySelector("div:nth-child(2)").innerText;

            if (adminDocHeaderTitle) adminDocHeaderTitle.innerText = `Detail Dokumen - ${layanan}`;
            if (adminDocHeaderInfo) {
               adminDocHeaderInfo.innerHTML = `
                    <strong>${namaPemohon}</strong><br>
                    NO. ${nikPemohon} / ${new Date().getFullYear()}<br>
                    ${layanan} - ${instansi}<br><br>
                    Silahkan periksa dokumen persyaratan di bawah ini.<br>
                    Klik ikon <i class="fa-solid fa-comment"></i> untuk memberikan revisi pada dokumen tertentu.
                `;
            }
            if (adminDocModal) adminDocModal.style.display = "flex";
         }
      }

      if (target.classList.contains("admin-action-comment") || target.classList.contains("fa-comment")) {
         if (adminDocModal) adminDocModal.style.display = "none";
         if (adminCommentModal) adminCommentModal.style.display = "flex";
      }

      if (target.id === "btnTeruskan") {
         if (adminDocModal) adminDocModal.style.display = "none";
         if (adminForwardModal) adminForwardModal.style.display = "flex";
      }

      const closeIDs = [
         "closeAdminDoc",
         "btnBatalAdminDoc",
         "closeForwardModal",
         "btnBatalForward",
         "closeSuccessForward",
         "btnForwardDone",
         "closeRejectModal",
         "btnBatalReject",
         "closeSuccessReject",
         "btnRejectDone",
         "closeTimelineModal",
         "adminCloseCommentModal",
         "adminBtnBatalComment",
         "closeSuccessComment",
         "btnSuccessClose",
         "btnMulaiUlang",
         "adminCloseSuccessComment",
         "adminBtnSuccessClose",
      ];

      if (closeIDs.includes(target.id) || target.classList.contains("x-close-btn")) {
         const modals = [adminDocModal, adminForwardModal, adminForwardSuccess, rejectModal, timelineModal, adminCommentModal, adminCommentSuccess, rejectSuccessModal];
         modals.forEach((m) => {
            if (m) m.style.display = "none";
         });
      }
   });

   // ==========================================
   // 19. FORM SUBMIT HANDLERS (REVISI FINAL)
   // ==========================================
   document.getElementById("forwardForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const filterValue = document.getElementById("forwardFilter").value;

      if (!currentRowTarget) return;

      if (filterValue.startsWith("dinas")) {
         updateRowStatusUI(currentRowTarget, "setuju");

         currentRowTarget.setAttribute(`data-status-dinas${currentDinasLevel}`, "DISETUJUI");
         if (currentDinasLevel === 1) {
            currentRowTarget.setAttribute("data-status-fo", "DISETUJUI");
         }

         currentRowTarget.setAttribute("data-reject-note", "");

         const nextLevel = currentDinasLevel + 1;
         if (nextLevel <= 4) {
            currentRowTarget.setAttribute(`data-status-dinas${nextLevel}`, "TERKIRIM");
         }

         if (adminForwardModal) adminForwardModal.style.display = "none";
         if (adminForwardSuccess) adminForwardSuccess.style.display = "flex";
      }
      else if (filterValue === "tolak") {
         if (adminForwardModal) adminForwardModal.style.display = "none";
         if (rejectModal) rejectModal.style.display = "flex";
      }
   });

   document.getElementById("rejectReasonForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = document.getElementById("rejectNote").value;

      if (currentRowTarget) {
         updateRowStatusUI(currentRowTarget, "tolak");

         currentRowTarget.setAttribute(`data-status-dinas${currentDinasLevel}`, "DITOLAK");
         if (currentDinasLevel === 1) {
            currentRowTarget.setAttribute("data-status-fo", "DITOLAK");
         }

         for (let i = currentDinasLevel + 1; i <= 4; i++) {
            currentRowTarget.setAttribute(`data-status-dinas${i}`, "DIBATALKAN");
         }

         currentRowTarget.setAttribute("data-reject-note", note);
      }

      if (rejectModal) rejectModal.style.display = "none";
      if (rejectSuccessModal) rejectSuccessModal.style.display = "flex";
      e.target.reset();
   });

   document.getElementById("adminCommentForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      if (adminCommentModal) adminCommentModal.style.display = "none";

      const commentSuccess = document.getElementById("commentSuccessModal");
      if (commentSuccess) {
         commentSuccess.style.display = "flex";
      } else if (adminCommentSuccess) {
         adminCommentSuccess.style.display = "flex";
      }

      e.target.reset();
   });

   // ==========================================
   // 20. TOGGLE SHOW/HIDE PASSWORD (ICON VERSION)
   // ==========================================
   document.addEventListener("click", (e) => {
      if (e.target.classList.contains("toggle-password")) {
         const toggleIcon = e.target;
         const passwordInput = toggleIcon.parentElement.querySelector("input");

         if (passwordInput.type === "password") {
            passwordInput.type = "text";
            toggleIcon.classList.remove("fa-eye");
            toggleIcon.classList.add("fa-eye-slash");
         } else {
            passwordInput.type = "password";
            toggleIcon.classList.remove("fa-eye-slash");
            toggleIcon.classList.add("fa-eye");
         }
      }
   });
});
