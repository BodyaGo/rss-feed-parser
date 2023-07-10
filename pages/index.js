import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import axios from "axios";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import { fetchPosts } from "./feedParser";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterDate, setFilterDate] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [adminMode, setAdminMode] = useState(false);
  const [nickname, setNickname] = useState("");
  const isAdmin = user && user.username === "bohdan@admin"; // Check if user exists and has the username property

  useEffect(() => {
    const fetchData = async () => {
      const items = await fetchPosts();
      setPosts(items);
    };

    fetchData();
  }, []);

  const deletePost = (index) => {
    if (isAdmin && user && user.username === "bohdan@admin") {
      const updatedPosts = [...posts];
      updatedPosts.splice(index, 1);
      setPosts(updatedPosts);
    }
  };

  const handleLogin = (token) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axios
      .get("/api/user")
      .then((response) => response.data)
      .then((data) => {
        setIsLoggedIn(true);
        setUser({ username: data.username }); // Extract username from the response data
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  };

  const handleLogout = () => {
    axios.defaults.headers.common["Authorization"] = "";

    setIsLoggedIn(false);
    setUser({});
    localStorage.removeItem("token");
  };

  const handleRegister = (username, password) => {
    return axios.post("/api/register", { username, password });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      handleLogin(storedToken);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && user.username) {
      // Generate the nickname
      const nicknameParts = user.username.split("@");
      const nickname = nicknameParts[0];
      setNickname(nickname);
    }
  }, [isLoggedIn, user]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts
    .filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((post) => {
      if (filterDate) {
        const postDate = new Date(post.isoDate);
        const filterDateObj = new Date(filterDate);
        return (
          postDate.getFullYear() === filterDateObj.getFullYear() &&
          postDate.getMonth() === filterDateObj.getMonth() &&
          postDate.getDate() === filterDateObj.getDate()
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.isoDate) - new Date(a.isoDate);
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  const totalPosts = currentPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) {
      return;
    }
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">RSS Parser</h1>
      {!isLoggedIn ? (
        <>
          <LoginForm handleLogin={handleLogin} />
          <RegistrationForm handleRegister={handleRegister} />
        </>
      ) : (
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xl font-bold mb-2">
              Logged in as: {nickname}
              {isAdmin && <span className="text-red-500"> (Admin)</span>}
            </p>
          </div>
          {isAdmin && (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300"
              onClick={() => setAdminMode(!adminMode)}
            >
              {adminMode ? "Disable Admin Mode" : "Enable Admin Mode"}
            </button>
          )}
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <label className="mr-2">Sort By:</label>
          <select
            className="border border-gray-300 px-2 py-1 rounded"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Date</option>
            <option value="title">Title</option>
          </select>
        </div>
        <div className="flex items-center">
          <label className="mr-2">Filter By Date:</label>
          <input
            type="date"
            className="border border-gray-300 px-2 py-1 rounded"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <input
          type="text"
          className="border border-gray-300 px-4 py-2 rounded"
          placeholder="Search posts"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="mt-8">
        {currentPosts.length > 0 ? (
          currentPosts
            .slice(indexOfFirstPost, indexOfLastPost)
            .map((post, index) => (
              <div className="mb-8" key={index}>
                <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                <p className="mb-4">{post.contentSnippet}</p>
                {adminMode && (
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-300"
                    onClick={() => deletePost(index)}
                  >
                    Delete Post
                  </button>
                )}
              </div>
            ))
        ) : (
          <p className="text-center">No posts found.</p>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-4">
          <button
            className={`mx-2 px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 text-gray-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() => paginate(currentPage - 1)}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`mx-2 px-4 py-2 rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700 hover:bg-blue-500 hover:text-white"
              }`}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className={`mx-2 px-4 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() => paginate(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );  
}

export default Home;