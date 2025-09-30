import { useState, useEffect } from 'react';
import "./../styles/index.css";

function App() {
  // retrieve posts from the mock API and display them
  const [posts, setPosts] = useState([]); // initialised to an empty array to hold the list of posts from the API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // category filter state
  const [selectedCategory, setSelectedCategory] = useState("All");

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  
  useEffect(() => {
    fetch('/api/posts')
    .then(response => response.json())
    .then((data) => {
      setPosts(data.posts);
      setLoading(false);
    })
    .catch(() => {
      setError("Error");
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  
  // categories list
  const categories = ["All", ...new Set(posts.flatMap(post => post.categories.map(category => category.name)))]; // Set removes duplicates, add "All" at the start so the user can reset the filter to see all posts
  
  // filter posts based on selected category
  const filteredPosts = selectedCategory.includes("All") ? posts : posts.filter(post => post.categories.some(category => selectedCategory.includes(category.name) ));

  // pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  return (
    <main>
      <header>
        <h1>Posts</h1>
          {/* category filter */}
          <label>Filter by category: </label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
      </header>

      <section>
        <ul>
            {/* list of posts */}
            {currentPosts.map((post) => (
              <li key={post.id}>
                <article>
                  <h2>{post.title}</h2>
                  <img src={post.author.avatar} alt={post.author.name} />
                  <p>Author: {post.author.name}</p>
                  <p>Publish Date: {new Date(post.publishDate).toLocaleDateString()}</p>
                  <p>Summary: {post.summary}</p>
                  <p>
                    Categories: {post.categories.map((category) => category.name).join(", ")}
                  </p>
                </article>
              </li>
            ))}
        </ul>
      </section>

      <nav>
        {/* pagination */}
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
      </nav>
    </main>);
}

export default App;
