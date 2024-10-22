const stats = document.getElementById("stats");
const badges = document.getElementById("badges");
const leaderboard = document.getElementById("leaderboard");
const statsSection = document.querySelector(".stats");
const badgesSection = document.querySelector(".badges");
const leaderboardSection = document.querySelector(".leaderboard");
const username = document.getElementById("username");
const point = document.getElementById("total-points");
const mainLeaderboard = document.getElementById("leader-container");
const rank = document.getElementById("rank");
const quizCount = document.getElementById("quiz-count");
const backButton = document.getElementById("back-button");
const logoutButton = document.getElementById("logout-button");
const statsQuizCount = document.getElementById("stats-question-count");
const totalQuizCount =document.getElementById("total-questions-count");
const answeredQuizCount = document.getElementById("total-answered")
const userProfileImage = document.getElementById("userProfileImage")
let userData;
let userQuiz;
var a = document.createElement("a");
a.href = "#";

const url = "http://localhost:3000";

username.innerHTML = localStorage.getItem("name");
point.innerHTML = localStorage.getItem("totalScoreOfUser");
userProfileImage.src = `${url}/${localStorage.getItem("userProfileImage")}`;


stats.addEventListener("click", () => {
  leaderboard.classList.remove("selected");
  stats.classList.add("selected");
  badges.classList.remove("selected");
  statsSection.classList.remove("hid");
  badgesSection.classList.add("hid");
  leaderboardSection.classList.add("hid");
});

badges.addEventListener("click", () => {
  leaderboard.classList.remove("selected");
  stats.classList.remove("selected");
  badges.classList.add("selected");
  statsSection.classList.add("hid");
  badgesSection.classList.remove("hid");
  leaderboardSection.classList.add("hid");
});

leaderboard.addEventListener("click", () => {
  leaderboard.classList.add("selected");
  stats.classList.remove("selected");
  badges.classList.remove("selected");
  statsSection.classList.add("hid");
  badgesSection.classList.add("hid");
  leaderboardSection.classList.remove("hid");
});

backButton.addEventListener("click",()=>{
  window.history.back();
})

logoutButton.addEventListener("click",()=>{
  localStorage.clear();
  window.location.href="../index.html"
})

function updateRank(data){
  const userId = localStorage.getItem("userId");
  let ranking;
  data.forEach((ele,idx)=>{
    if(ele._id==userId){
      ranking=idx+1;
    }
  })
  rank.innerText=ranking
}


function updateQuizCount(data){
  quizCount.innerText=data.length;
}

function updateStats(data){
  statsQuizCount.innerText=data.length*10;
  totalQuizCount.innerText=data.length*10;
  let totalAnswer=0;
  data.forEach((ele)=>{
    console.log(ele.correctCount);
    totalAnswer+=Number(ele.correctCount)
  })
  answeredQuizCount.innerText=totalAnswer
}

const fetchData = async (endpoint) => {
  try {
    const res = await fetch(
      `${url}/${endpoint}?sort=totalScore&order=desc`
    );
    const data = await res.json();
    userData = data
    updateRank(data);
    console.log(data);
    appendLeaderboard(data);
  } catch (error) {
    console.log(error);
  }
};

function updateUsername(data) {
  // Assuming data.username exists, update the username element
  if (data.username) {
    username.innerText = data.username;
  }

}

const fetchQuiz =async () => {
  try{
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token")
  const res = await fetch(`${url}/results/${userId}`,{
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${token} `
    }
  });
  const data = await res.json();
  userQuiz = data;
  updateQuizCount(data);
  updateStats(data)
  console.log(data);
} catch (error) {
  console.log(error);
}
}

fetchQuiz()

fetchData("users/user");

const createLeaderboardCard = (item, index) => {
  const leaderCard = document.createElement("div");
  leaderCard.className = "leader-card";

  const leaderCont = document.createElement("div");
  leaderCont.className = "leader-cont";

  const leaderRank = document.createElement("span");
  leaderRank.className = "leader-rank";
  leaderRank.id = "leader-rank";
  leaderRank.innerHTML = index + 1;

  const img = document.createElement("img");
  img.src = "../assets/images/ganjaboy.png";
  img.alt = "ganja";

  const leaderDetails = document.createElement("div");
  leaderDetails.className = "leader-details";

  const username = document.createElement("p");
  username.id = "username";
  username.innerText = `${item.username}`;

  const p = document.createElement("p");
  const userScore = document.createElement("span");
  userScore.id = "user-score";

  userScore.innerHTML = `${item.totalScore} Points`;

  leaderCard.append(leaderCont, leaderDetails);
  leaderCont.append(leaderRank, img);
  leaderDetails.append(username, p);

  p.append(userScore);

  const medal = document.createElement("img");
  if (index + 1 === 1) {
    medal.src = "../assets/medals/gold-medal.png";
    leaderCard.append(medal);
  } else if (index + 1 === 2) {
    medal.src = "../assets/medals/silver-medal.png";
    leaderCard.append(medal);
  } else if (index + 1 === 3) {
    medal.src = "../assets/medals/bronze-medal.png";
    leaderCard.append(medal);
  }

  return leaderCard;
};

const appendLeaderboard = (data) => {
  mainLeaderboard.innerHTML = "";
  a.innerHTML = "See All Rankings";
  data.forEach((item, index) => {
    if(index<3){
      mainLeaderboard.append(createLeaderboardCard(item, index));
    }
  });
};
/////////////////////////////badges rendering////////////
document.addEventListener("DOMContentLoaded", async () => {
  const url = "http://localhost:3000";

  const userId = localStorage.getItem("userId");

  const userData = await fetchUserData(userId);

  const initialScore = userData.totalScore;
  const badgesArray = document.querySelectorAll(" .badge ");

  badgesArray.forEach(async (badge) => {
    const badgeCover = badge.querySelector(".cover");
    const requiredScore = getRequiredScore(badge);
    if (initialScore >= requiredScore) {
      badgeCover.classList.add('hid');
    }
    // else {
    //   badgeCover.classList.add('hid');
    // }
  });
});

async function fetchUserData(userId) {
  try {
    const res = await fetch(`${url}/users/user/${userId}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

function getRequiredScore(badgeElement) {
  const badgeImage = badgeElement.querySelector("img");
  const badgeType = badgeImage.alt;

  switch (badgeType) {
    case "Iron-1":
      return 100;
    case "Bronze-1":
      return 200;
    case "Silver-1":
      return 400;
    case "Gold-1":
      return 450;
    case "Platinum-1":
      return 1000;
    case "Diamond-1":
      return 2000;
    case "Ascendant-1":
      return 5000;
    case "Immortal-1":
      return 7000;
    case "Radiant":
      return 9800;
    default:
      return 0;
  }
}

const uploadModal = document.getElementById('uploadModal');
const profilePicInput = document.getElementById('profilePicInput');
const hiddenFileInput = document.getElementById('hiddenFileInput');

function openModal() {
  uploadModal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
  uploadModal.style.display = 'none';
}

// Function to handle profile picture upload
async function uploadProfilePicture() {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const formData = new FormData();
  formData.append('profilePic', profilePicInput.files[0]);

  try {
    const response = await fetch(`${url}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    // Check if the upload was successful and a path is returned
    if (response.ok && data.filePath) {
      // Now, update the user's profile picture path using the PATCH request
      const updatedData = {
        image: data.filePath,
      };
    
      const patchResponse = await fetch(`${url}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
    
      const patchData = await patchResponse.json();
    
      const imagePath = patchData.user.image;
    
      if (imagePath !== undefined) {
        const formattedImagePath = `${url}/${imagePath}`
        userProfileImage.src = formattedImagePath;
        localStorage.setItem('userProfileImage', imagePath);

    
        console.log('Response from PATCH endpoint:', patchData.message);
    
        console.log(patchData.message);
    
        closeModal();
      } else {
        console.error('Error: Image path not found in patchData');
      }
    } else {
      console.error('Error uploading profile picture:', data.message);
    }
  } catch (error) {
    console.error('Error uploading profile picture:', error);
  }
}

// Event listener to open the modal when the user profile image is clicked
userProfileImage.addEventListener('click', function () {
  openModal();
});

userProfileImage.style.borderRadius = '100px';
