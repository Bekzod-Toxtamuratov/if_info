async function getAuthors() {
  let accessToken = localStorage.getItem("accessToken");
  console.log("accessToken: ", accessToken);

  const accessTokenExpTime = getTokenExpiration(accessToken);

  console.log("accessTokenExpTime: ", accessTokenExpTime);

  if (accessTokenExpTime) {
    const currentTime = new Date();

    if (currentTime < accessTokenExpTime) {
      console.log("Access token faol");
    } else {
      console.log("Access tokeni vaqti chiqib ketdi ");
      accessToken = await refreshTokenFunc();
      console.log("NewAccessToken", accessToken);
    }
  } else {
    console.log("Invalid access token format");
  }

  fetch("http://localhost:3003/api/author", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    mode: "cors",
  })
    .then((response) => {
      console.log(response);
      if (response.ok) {
        return response.json();
      } else {
        console.log("Request failed with status" + response.status);
      }
    })
    .then((author) => {
      console.log(author);
      displayAuthors(author.data);
    })
    .catch((error) => {
      console.log("Error", error);
    });
}

function getTokenExpiration(token) {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));

  if (decodedToken.exp) {
    return new Date(decodedToken.exp * 1000);
  }
  return null;
}

async function refreshTokenFunc() {
  const loginUrl = "/login";
  try {
    const response = await fetch("http://localhost:3003/api/author/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      Accept: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data.error && data.error === "jwt expired") {
      console.log("Refresh token vaqti chiqib ketdi ");
      return window.location.replace(loginUrl);
    }
    console.log("Tokenlar Refresh token orqali mufaqiyatli yangilandi ");
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.log(error);
    return window.location.replace(loginUrl);
  }
}

function displayAuthors(authors) {
  const listContainer = document.getElementById("author-list");

  listContainer.innerHTML = "";

  authors.forEach((author) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${author.author_first_name} ${author.author_last_name} ${author.author_email}`;
    listContainer.appendChild(listItem);
  });
}

// Topic malumotlarini qoshish boldi bu yerda;
//  *****************************************************************************
function displayTopics(topic) {
  const listContainer = document.getElementById("topic-list");
  listContainer.innerHTML = "";
  topic.forEach((top) => {
    const listItem = document.createElement("li");
    listItem.textContent = `/${top.topic_title}/ => /${top.topic_text} /`;
    listContainer.appendChild(listItem);
  });
}

async function getTopic() {
  let accessToken = localStorage.getItem("accessToken");
  console.log("AccessToken", accessToken);
  const accessTokenExpTime = getTokenExpiration(accessToken);
  console.log("accessTokenExpTime", accessTokenExpTime);

  if (accessTokenExpTime) {
    const currentTime = new Date();
    if (currentTime < accessTokenExpTime) {
      console.log("Access token faol");
    } else {
      console.log("Access tokendi vaqti chiqib ketdi");
      accessToken = await refreshTokenFunc();
      console.log("NewAccessToken:", accessToken);
    }
  } else {
    console.log("Invalid access token format");
  }
  fetch("http://localhost:3003/api/topic", {
    method: "GET",
    // mode: "cors",
  })
    .then((response) => {
      if (response.ok) {
        console.log("responce : ", response);
        return response.json();
      } else {
        console.log("Request failed with status:", response);
      }
    })
    .then((topic) => {
      console.log(" topic data  :  :    :   : ", topic.data);
      displayTopics(topic.data);
    })
    .catch((error) => {
      console.log("Error", error);
    });
}
// Dictionary ga  uyga vazifa yozish hisoblanadi;
// *****************************************

function displayDictionary(dictionaries) {
  const listContainer = document.getElementById("dict-list");
  listContainer.innerHTML = "";
  dictionaries.forEach((dict) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${dict.term}  :     =>   :  ${dict.letter} `;
    listContainer.appendChild(listItem);
  });
}

async function getDictionary() {
  let accessToken = localStorage.getItem("accessToken");
  console.log("AccessToken", accessToken);
  const accessTokenExpTime = getTokenExpiration(accessToken);
  console.log("accessTokenExpTime", accessTokenExpTime);

  if (accessTokenExpTime) {
    const currentTime = new Date();
    if (currentTime < accessTokenExpTime) {
      console.log("Access token faol");
    } else {
      console.log("Access tokendi vaqti chiqib ketdi");
      accessToken = await refreshTokenFunc();
      console.log("NewAccessToken:", accessToken);
    }
  } else {
    console.log("Invalid access token format");
  }
  fetch("http://localhost:3003/api/dict", {
    method: "GET",
    // mode: "cors",
  })
    .then((response) => {
      if (response.ok) {
        console.log("responce : ", response);
        return response.json();
      } else {
        console.log("Request failed with status:", response);
      }
    })
    .then((topic) => {
      console.log(" topic data  :  :    :   : ", topic.data);
      displayDictionary(topic.data);
    })
    .catch((error) => {
      console.log("Error", error);
    });
}
