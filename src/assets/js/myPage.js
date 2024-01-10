import { checkUserType } from "./me.js";
document.addEventListener("DOMContentLoaded", async () => {
  await getUserDetails();
  const userType = await checkUserType();
  console.log(userType);
  if (userType === "OWNER") {
    const targetElement = document.getElementById("targetElement");
    displayRedirectButton(targetElement);
  } else if (userType === "CLIENT") {
    displayRedirectButtonClient(targetElement);
  }
});

function displayRedirectButton(targetElement) {
  try {
    console.log("1");
    const redirectButton = document.createElement("button");
    console.log("2");
    redirectButton.className = "btn btn-success";
    console.log("3");
    redirectButton.textContent = "주문 관리 페이지로 이동";
    console.log("4");
    targetElement.appendChild(redirectButton);
    redirectButton.onclick = function () {
      console.log("버튼 클릭됨");
      window.location.href = "owner.order.html";
    };
  } catch (error) {
    console.error("displayRedirectButton 함수에서 오류 발생:", error);
  }
}

function displayRedirectButtonClient(targetElement) {
  try {
    console.log("1");
    const redirectButton = document.createElement("button");
    console.log("2");
    redirectButton.className = "btn btn-success";
    console.log("3");
    redirectButton.textContent = "주문 상세 페이지로 이동";
    console.log("4");
    targetElement.appendChild(redirectButton);
    redirectButton.onclick = function () {
      console.log("버튼 클릭됨");
      window.location.href = "customer.order.check.html";
    };
  } catch (error) {
    console.error("displayRedirectButton 함수에서 오류 발생:", error);
  }
}

async function deleteProfile() {
  console.log("Before confirm");
  const confirmed = confirm("정말로 탈퇴하시겠습니까?");
  console.log("After confirm");
  if (confirmed) {
    try {
      const response = await fetch(`/api/users/me`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        alert("탈퇴되었습니다.");
      } else if (response.status === 403) {
        // 권한이 없는 경우 알림 표시
        alert("탈퇴할 권한이 없습니다.");
      } else {
        console.error(
          "Error deleting profile:",
          response.status,
          response.statusText,
        );
        const errorData = await response.json();
        console.error("Additional error details:", errorData);
      }
    } catch (error) {
      console.error("Error deleting profile:", error.message);
    }
  }
}

// 프로필 가져오기
async function getUserDetails() {
  try {
    const response = await fetch(`/api/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const result = await response.json();
      const userData = result.data;
      console.log(userData);

      // Update HTML with user details
      document.getElementById("userName").innerText =
        `이름: ${userData.username}`;
      document.getElementById("userEmail").innerText =
        `Email: ${userData.email}`;
      document.getElementById("point").innerText = `Point: ${userData.points}`;
    } else if (response.status === 403) {
      alert("조회할 권한이 없습니다.");
    } else {
      console.error(
        "Error fetching user profile:",
        response.status,
        response.statusText,
      );
    }
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
  }
}
//주문 정보 가져오기
function displayOrderDetails(orderDetails) {
  var orderDetailsContainer = document.getElementById("orderDetails");
  var orderDetailsList = document.createElement("ul");
  orderDetailsList.className = "list-group";

  if (Array.isArray(orderDetails) && orderDetails.length > 0) {
    orderDetails.forEach(function (item) {
      var listItem = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.textContent = `${item.product} - Quantity: ${
        item.quantity
      } - Total: $${item.total.toFixed(2)}`;
      orderDetailsList.appendChild(listItem);
    });
  } else {
    var listItem = document.createElement("li");
    listItem.className = "list-group-item";
    listItem.textContent = "No order details available.";
    orderDetailsList.appendChild(listItem);
  }

  orderDetailsContainer.appendChild(orderDetailsList);
}
