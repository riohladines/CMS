document.addEventListener("DOMContentLoaded", () => {
    // === DARK MODE TOGGLE ===
    const toggle = document.getElementById("toggleDark");
    if (toggle) {
      toggle.addEventListener("change", () => {
        document.body.classList.toggle("dark", toggle.checked);
        localStorage.setItem("theme", toggle.checked ? "dark" : "light");
      });
  
      if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        toggle.checked = true;
      }
    }
  
    // === QUOTE GENERATOR ===
    const quotes = [
      "The best way to predict the future is to create it. – Abraham Lincoln",
      "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
      "The only way to do great work is to love what you do. – Steve Jobs",
      "It always seems impossible until it’s done. – Nelson Mandela",
      "Don’t watch the clock; do what it does. Keep going. – Sam Levenson",
      "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt"
    ];
  
    const quoteText = document.getElementById("quote-text");
    const refreshButton = document.getElementById("quote-refresh");
  
    if (quoteText && refreshButton) {
      refreshButton.addEventListener("click", () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteText.innerText = `"${quotes[randomIndex]}"`;
      });
      refreshButton.click(); // Show a quote on load
    }
  
    // === CONTENT LOADING (For content.html) ===
    const contentList = document.getElementById("content-list");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortOptions = document.getElementById("sortOptions");
  
    if (contentList && searchInput && categoryFilter && sortOptions) {
      let courses = [];
  
      function fetchCourses() {
        fetch("content.xml")
          .then((res) => res.text())
          .then((data) => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "text/xml");
            const courseElements = Array.from(xml.getElementsByTagName("course"));
            courses = courseElements.map((course) => ({
              title: course.getElementsByTagName("title")[0].textContent,
              description: course.getElementsByTagName("description")[0].textContent,
              category: course.getAttribute("category"),
              popularity: parseInt(course.getAttribute("popularity") || "0"),
            }));
            renderCourses();
          });
      }
  
      function renderCourses() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const sortOption = sortOptions.value;
  
        let filtered = courses.filter((c) =>
          c.title.toLowerCase().includes(searchTerm) &&
          (selectedCategory ? c.category === selectedCategory : true)
        );
  
        if (sortOption === "name") {
          filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOption === "popular") {
          filtered.sort((a, b) => b.popularity - a.popularity);
        }
  
        contentList.innerHTML = filtered
          .map(
            (c) => `
          <div class="course-card">
            <h3>${c.title}</h3>
            <p>${c.description}</p>
            <small><strong>Category:</strong> ${c.category}</small>
          </div>`
          )
          .join("");
      }
  
      searchInput.addEventListener("input", renderCourses);
      categoryFilter.addEventListener("change", renderCourses);
      sortOptions.addEventListener("change", renderCourses);
  
      fetchCourses();
    }
  });
  