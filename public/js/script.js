
console.log("IN SCRIPT")
const qres = await db.query("SELECT * FROM users")

const users = qres.rows
const alumni = users

for (const user of users) {
  const qres2 = await db.query("SELECT * FROM achievements WHERE user_id = $1", [user.user_id])
  const achievements = { [user.name]: qres2.rows };
}
// Alumni Achievements
console.log(achievements)


function renderAlumni(alumniList) {
  const container = document.getElementById('alumniContainer');
  container.innerHTML = '';

  alumniList.forEach(alum => {
    const card = `
    <div class="card">
      <img src="${alum.image}" alt="${alum.name}" class="profile-pic">
      <h3 class="name">${alum.name}</h3>
      <p class="details"><strong>Batch:</strong> ${alum.graduationYear}</p>
      <p class="details"><strong>Branch:</strong> ${alum.branch}</p>
      <p class="details"><strong>Company:</strong> ${alum.company}</p>
      <p class="details"><strong>Job Title:</strong> ${alum.jobTitle}</p>
      <p class="details"><strong>Location:</strong> ${alum.location}</p>
      <div class="links">
        ${alum.linkedin ? `<a href="${alum.linkedin}" target="_blank" class="connect-btn">LinkedIn</a>` : ''}
        ${alum.github ? `<a href="${alum.github}" target="_blank" class="connect-btn github">GitHub</a>` : ''}
      </div>
      <button class="btn btn-primary view-profile-btn" data-bs-toggle="modal" data-bs-target="#alumniModal" onclick="showAlumniDetails('${alum.name}')">View Full Profile</button>
    </div>
    `;
    container.insertAdjacentHTML('beforeend', card);
  });
}
function showAlumniDetails(name) {
  const alumniDetails = alumni.find(alum => alum.name === name);

  document.getElementById('alumniImage').src = alumniDetails.image;
  document.getElementById('alumniName').innerText = alumniDetails.name;
  document.getElementById('alumniBatch').innerText = alumniDetails.graduationYear;
  document.getElementById('alumniBranch').innerText = alumniDetails.branch;
  document.getElementById('alumniCompany').innerText = alumniDetails.company;
  document.getElementById('alumniJobTitle').innerText = alumniDetails.jobTitle;
  document.getElementById('alumniLocation').innerText = alumniDetails.location;

  const linkedinLink = document.getElementById('alumniLinkedin');
  const githubLink = document.getElementById('alumniGithub');

  linkedinLink.style.display = alumniDetails.linkedin ? 'inline-block' : 'none';
  linkedinLink.href = alumniDetails.linkedin || '#';

  githubLink.style.display = alumniDetails.github ? 'inline-block' : 'none';
  githubLink.href = alumniDetails.github || '#';

  // Add Achievements
  const achievementsContainer = document.getElementById('achievementsContainer');
  achievementsContainer.innerHTML = ''; // Clear previous

  const alumAchievements = achievements[name] || [];
  alumAchievements.forEach(ach => {
    const achCard = `
      <div class="achievement-card">
        <div class="achievement-line"></div>
        <img src="${ach.image}" alt="Badge" class="achievement-badge">
        <div class="achievement-details">
          <h4>${ach.title}</h4>
          <p>${ach.year}</p>
        </div>
      </div>
    `;
    achievementsContainer.insertAdjacentHTML('beforeend', achCard);
  });
}

// Initial render
renderAlumni(alumni);

// Search Inputs
const searchName = document.getElementById('searchName');
const searchBatch = document.getElementById('searchBatch');
const searchCompany = document.getElementById('searchCompany');
const searchLocation = document.getElementById('searchLocation');
const searchBranch = document.getElementById('searchBranch');
const searchJob = document.getElementById('searchJob');

// Filter function
function filterAlumni() {
  const nameVal = searchName.value.trim().toLowerCase();
  const batchVal = searchBatch.value.trim();
  const companyVal = searchCompany.value.trim().toLowerCase();
  const locationVal = searchLocation.value.trim().toLowerCase();
  const branchVal = searchBranch.value.trim().toLowerCase();
  const jobVal = searchJob.value.trim().toLowerCase();

  const filtered = alumni.filter(alum => {
    return (
      alum.name.toLowerCase().includes(nameVal) &&
      alum.graduationYear.includes(batchVal) &&
      alum.company.toLowerCase().includes(companyVal) &&
      alum.location.toLowerCase().includes(locationVal) &&
      alum.branch.toLowerCase().includes(branchVal) &&
      alum.jobTitle.toLowerCase().includes(jobVal)
    );
  });

  renderAlumni(filtered);
}

// Add Event Listeners
searchName.addEventListener('input', filterAlumni);
searchBatch.addEventListener('input', filterAlumni);
searchCompany.addEventListener('input', filterAlumni);
searchLocation.addEventListener('input', filterAlumni);
searchBranch.addEventListener('input', filterAlumni);
searchJob.addEventListener('input', filterAlumni);


modal.classList.add('show');
document.getElementById('closeModal').addEventListener('click', () => {
  const modal = document.getElementById('profileModal');
  modal.classList.add('hidden');
  modal.classList.remove('show');
});

window.addEventListener('click', (e) => {
  const modal = document.getElementById('profileModal');
  if (e.target === modal) {
    modal.classList.add('hidden');
    modal.classList.remove('show');
  }
});




// comuunity--------------------------------------------------------------------------------------------


 