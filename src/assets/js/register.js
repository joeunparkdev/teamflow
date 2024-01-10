// Kakao 로그인 버튼 클릭 이벤트 핸들러
document
  .getElementById("kakao-login-btn")
  .addEventListener("click", function () {
    handleKakao_login();
  });

// Kakao 로그인 함수
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

    // Kakao.Auth.login을 호출하여 로그인
    Kakao.Auth.login({
      success: async (authObj) => {
        // 사용자가 Kakao로 성공적으로 로그인
        console.log(authObj);
        const kakaoAccessToken = Kakao.Auth.getAccessToken();
        await sendKakaoAccessTokenToServer(kakaoAccessToken);
      },
      fail: (err) => {
        // 로그인 실패 처리
        console.log(err);
      },
    });
  } catch (error) {
    console.error(error);
  }
}

//카카오 토큰 보내기
async function sendKakaoAccessTokenToServer(accessToken) {
  try {
    // 서버로 전송할 URL 및 데이터 설정
    const url = `/api/auth/kakao/callback?code=${encodeURIComponent(
      accessToken,
    )}`;

    // 서버로 HTTP GET 요청 보내기
    const response = await fetch(url, {
      method: "GET",
    });

    // 서버 응답 확인
    if (response.ok) {
      console.log("Kakao access token sent to server successfully.");
    } else {
      alert("카카오로 이미 회원가입한 회원입니다.");
      console.error("Failed to send Kakao access token to server.");
    }
  } catch (error) {
    console.error("Error while sending Kakao access token to server:", error);
  }
}

function sign_up() {
  const username = document.getElementById("inputNickname").value;
  console.log("Username:", username);
  const email = document.getElementById("inputEmail").value;
  const password = document.getElementById("inputPassword1").value;
  const confirmPassword = document.getElementById("inputPassword2").value;
  const verificationCode = document.getElementById(
    "inputVerificationCode",
  ).value;
  console.log("verificationCode:", verificationCode);
  const userTypeFormGroup = document.getElementById("userTypeFormGroup");
  const usertype = userTypeFormGroup.querySelector(":checked").value;

  const data = {
    username,
    email,
    password,
    confirmPassword,
    verificationCode,
  };

  fetch(`/api/auth/signup/${usertype}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    mode: "cors",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.success) {
        alert("회원가입 성공!");
        window.location.href = "login.html";
      } else {
        alert(`회원가입 실패: ${result.message}`);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

let attemptsRemaining = 3; // 허용된 시도 횟수
document.getElementById("timer-container").style.display = "none";
let verificationStartTime; // 인증 코드가 전송된 시간을 저장하는 변수

async function send_code() {
  const email = document.getElementById("inputEmail").value;

  if (!email) {
    alert("이메일을 입력해주세요.");
    return;
  }
  console.log(JSON.stringify({ email: email }));

  try {
    const response = await fetch(`/api/auth/sendCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
      mode: "cors",
      credentials: "include",
    });

    const result = await response.json();
    console.log(result);
    if (result.success) {
      alert("인증 코드를 이메일로 전송했습니다.");
      verificationStartTime = Date.now(); // 인증 코드가 전송된 시간을 기록
      startVerificationTimer(); // 타이머 시작
      document.getElementById("timer-container").style.color = "red";
      document.getElementById("timer-container").style.display = "block";
    } else {
      alert("인증 코드 전송에 실패했습니다.");
    }
  } catch (error) {
    console.error("에러:", error);
  }
}

function startVerificationTimer() {
  let timeRemaining = 3 * 60; // 초 단위로 설정된 제한 시간
  const timerElement = document.getElementById("timer");
  const timerContainer = document.getElementById("timer-container");

  function updateTimer() {
    const elapsedSeconds = Math.floor(
      (Date.now() - verificationStartTime) / 1000,
    );
    const remainingSeconds = Math.max(0, timeRemaining - elapsedSeconds);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    timerElement.textContent = `${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;

    if (remainingSeconds <= 0) {
      clearInterval(verificationTimer);
      alert("인증 시간이 만료되었습니다. 다시 시도해주세요.");
      document.getElementById("verifyButton").disabled = true; // 시간 초과 후 버튼 비활성화
      timerContainer.style.color = "black";
    }
  }

  // 초기 업데이트
  updateTimer();

  // 매 초마다 타이머 업데이트
  verificationTimer = setInterval(updateTimer, 1000);
}

async function verify_code() {
  const verificationCode = document.getElementById(
    "inputVerificationCode",
  ).value;

  if (!verificationCode) {
    alert("인증 코드를 입력해주세요.");
    return;
  }

  const email = document.getElementById("inputEmail").value;

  const data = {
    email,
    verificationCode,
    startTime: verificationStartTime, // 시작 시간을 서버에 전송
  };

  try {
    const response = await fetch(`http://localhost:3001/api/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      mode: "cors",
    });

    const result = await response.json();

    if (result.success) {
      alert("인증 코드 확인 성공!");
      clearTimeout(verificationTimer); // 인증이 성공하면 타이머를 초기화
    } else {
      attemptsRemaining--;

      if (attemptsRemaining > 0) {
        alert(`잘못된 인증 코드입니다. 남은 시도 횟수: ${attemptsRemaining}`);
      } else {
        alert("최대 시도 횟수를 초과했습니다. 나중에 다시 시도해주세요.");
        document.getElementById("verifyButton").disabled = true; // 최대 시도 횟수 초과 후 버튼 비활성화
      }
    }
  } catch (error) {
    console.error("에러:", error);
  }
}

document.addEventListener("DOMContentLoaded", startVerificationTimer);
