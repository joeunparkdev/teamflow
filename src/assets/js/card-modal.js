const closeBtn = modal.querySelector(".close-area")
        closeBtn.addEventListener("click", e => {
            document.querySelector(".modal-overlay").style.visibility="hidden";
        })