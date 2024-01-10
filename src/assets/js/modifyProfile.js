let attemptsRemaining = 3; // 허용된 시도 횟수
document.getElementById("timer-container").style.display = "none";
let verificationStartTime; // 인증 코드가 전송된 시간을 저장하는 변수

async function send_code() {
  const email = document.getElementById("inputEmail").value;

  if (!email) {
    alert("이메일을 입력해주세요.");
    return;
  }

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

function checkLoginStatus() {
  // 클라이언트에서 쿠키에서 토큰 읽기
  const cookieString = document.cookie;

  // 토큰이 있다면 사용
  if (cookieString) {
    const token = cookieString
      .split("; ")
      .find((row) => row.startsWith("token="))
      .split("=")[1];

    return !!token;
  } else {
    console.log("No cookies found");
    return false;
  }
}

function modifyProfile() {
  const username = document.getElementById("inputNickname").value;
  const email = document.getElementById("inputEmail").value;
  const password = document.getElementById("inputPassword1").value;
  const confirmPassword = document.getElementById("inputPassword2").value;
  const verificationCode = document.getElementById(
    "inputVerificationCode",
  ).value;
  const userTypeFormGroup = document.getElementById("userTypeFormGroup");
  const usertype = userTypeFormGroup.querySelector(":checked").value;
  console.log("Username:", username);
  console.log("Email:", email);
  console.log("Password:", password);
  console.log("Confirm Password:", confirmPassword);
  console.log("Verification Code:", verificationCode);

  const data = {
    username,
    email,
    verificationCode,
    password,
    confirmPassword,
  };

  fetch(`/api/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
    mode: "cors",
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.success) {
        alert("회원 수정 성공!");
        window.history.back();
      } else {
        window.history.back();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

document.addEventListener("DOMContentLoaded", startVerificationTimer);
