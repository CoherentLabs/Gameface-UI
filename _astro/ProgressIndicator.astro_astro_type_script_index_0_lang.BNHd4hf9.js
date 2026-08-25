window.addEventListener("scroll", function() {
  updateProgressScroll();
});
window.addEventListener("load", function() {
  updateProgressScroll();
});
function updateProgressScroll() {
  const progressScroll = document.getElementById("progress-scroll");
  if (progressScroll) {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0) {
      const progress = scrollTop / scrollHeight * 100;
      progressScroll.style.width = progress + "%";
    } else {
      progressScroll.style.width = "0%";
    }
  }
}
