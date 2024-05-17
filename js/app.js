document.getElementById("startButton").addEventListener("click", function (e) {
  e.preventDefault()
  const substanceKey = document.getElementById("substance").value;
  const userName = document.getElementById("name").value;
  const substance = substances[substanceKey];
  const startTime = new Date().getTime(); // Record the exact time the session starts
  const outputContainer = document.getElementById("outputContainer")
  const trustedContact = document.getElementById("trustedContact").value;

  console.log(`Session started for ${substance.name.toLowerCase()} at ${new Date(startTime).toLocaleTimeString()}.`);

  startCountdown(substance, startTime);
  sendEmailToTrustedContact(substance, userName, startTime, trustedContact)

  outputContainer.style.display = "block";
  outputContainer.innerHTML = `<p>${userName} is using ${substance.name.toLowerCase()}.</p> <p>They consumed at: ${new Date(startTime).toLocaleTimeString()} on ${new Date(startTime).toLocaleDateString()}.</p> <p>It is imperative that you are aware of: ${substance.warning}.</p> <p>You have received this alert because ${userName} has nominated you as their trusted contact.</p>`;
})
function startCountdown(substance, startTime) {
  const endTime = startTime + substance.checkInterval; // Calculate when the session should end
  const interval = setInterval(() => {
    const now = new Date().getTime(); // Current time in milliseconds
    const timeRemaining = endTime - now; // Time left until the session should end

    if (timeRemaining <= 0) {
      clearInterval(interval); // Stop the timer if time is up
      document.getElementById("timeContainer").innerText = "Time to check in!";
      promptUser(substance, startTime);
      return;
    }

    // Update the display with the formatted time remaining
    document.querySelector('#timeContainer').style.display = 'flex'
    document.getElementById("timeSpan").innerText = formatTime(timeRemaining);
  }, 1000); // Update every second
}
function sendEmailToTrustedContact(substance, userName, startTime, trustedContact) {

  const subject = `${userName} is using ${substance.name.toLowerCase()}.`;
  const body = `${userName} is using ${substance.name.toLowerCase()}. They consumed at: ${new Date(startTime).toLocaleTimeString()} on ${new Date(startTime).toLocaleDateString()}. It is imperative that you are aware of: ${substance.warning}. You have received this alert because ${userName} has nominated you as their trusted contact.`;

  // Open the mail client
  window.location.href = `mailto:${trustedContact}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
function promptUser(substance, startTime) {
  alert(`Please confirm that you are okay!\nUsing: ${substance.name.toLowerCase()} since ${new Date(startTime).toLocaleTimeString()} (${new Date(startTime).toLocaleDateString()}).\nPress OK to cancel this message.\n\nContacting emergency contact in: ${formatTime(0.2*60*1000)}`);
  // Future implementations: check user response and handle accordingly


}
function formatTime(milliseconds) {
  if (milliseconds < 0) return "00:00"; // Return "00:00" if time has passed

  let totalSeconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  // Ensure that single digit seconds are padded with a zero
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;

  return minutes + ":" + seconds; // Return formatted time
}
