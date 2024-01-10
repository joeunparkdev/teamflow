// Kakao 로그인 버튼 클릭 이벤트 핸들러
document
  .getElementById("kakao-login-btn")
  .addEventListener("click", function () {
    handleKakao_login();
  });
// Kakao 고객님 로그인 버튼 클릭 이벤트 핸들러
document
  .getElementById("kakao-client-login-btn")
  .addEventListener("click", function () {
    handleKakao_login_client();
  });

// Kakao 사장님 로그인 버튼 클릭 이벤트 핸들러
document
  .getElementById("kakao-owner-login-btn")
  .addEventListener("click", function () {
    handleKakao_login_owner();
  });

// Kakao  로그인 함수
async function handleKakao_login() {
  try {
    await new Promise((resolve) => {
      if (window.Kakao) {
        resolve();
      } else {
        window.onload = resolve;
      }
    });

    // Kakao SDK를 초기화
    Kakao.init("3980c403de0926c15940e444945aef79");
    Kakao.Auth.authorize({
      redirectUri: `http://localhost:3000/api/auth/kakao/callback`,
    });
  } catch (error) {
    console.error(error);
  }
}

// Kakao 고객님 로그인 함수
async function handleKakao_login_owner() {
  try {
    await new Promise((resolve) => {
      if (window.Kakao) {
        resolve();
      } else {
        window.onload = resolve;
      }
    });

    // Kakao SDK를 초기화
    Kakao.init("3980c403de0926c15940e444945aef79");
    const userType = "CLIENT";
    Kakao.Auth.authorize({
      redirectUri: `http://localhost:3000/api/auth/kakao/callback?userType=${userType}`,
    });
  } catch (error) {
    console.error(error);
  }
}

// Kakao 사장님 로그인 함수
async function handleKakao_login_owner() {
  try {
    await new Promise((resolve) => {
      if (window.Kakao) {
        resolve();
      } else {
        window.onload = resolve;
      }
    });

    // Kakao SDK를 초기화
    Kakao.init("3980c403de0926c15940e444945aef79");

    const userType = "OWNER";
    Kakao.Auth.authorize({
      redirectUri: `http://localhost:3000/api/auth/kakao/callback?userType=${userType}`,
    });
  } catch (error) {
    console.error(error);
  }
}

function sign_in() {
  const email = document.getElementById("inputEmail").value;
  const password = document.getElementById("inputPassword").value;

  fetch(`http://localhost:3000/api/auth/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    mode: "cors",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.success) {
        alert("로그인 성공!");
        window.location.href = "main.html";
      } else {
        alert(`로그인 실패: ${result.message}`);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
