
document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll(".solarsystem a");
  const descriptions = document.querySelectorAll("#descriptions li");
  const section = document.querySelector("section");

  // Smooth scroll and highlight
  links.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Get target ID from href
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      // Scroll smoothly to the description
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });

      // Remove active class from all items
      links.forEach(l => l.classList.remove("active"));
      descriptions.forEach(d => d.classList.remove("active"));

      // Add active class to current selection
      this.classList.add("active");
      targetElement.parentElement.classList.add("active");
    });
  });

  // Optional: Highlight based on scroll position
  window.addEventListener("scroll", () => {
    let current = "";

    descriptions.forEach(desc => {
      const sectionTop = desc.offsetTop;
      if (pageYOffset >= sectionTop - 200) {
        current = desc.querySelector("h2").id;
      }
    });

    links.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
});