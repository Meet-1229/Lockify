import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [data, setData] = useState([]);
  const [mode, setMode] = useState(null);
  const [inputwebsite, setInputwebsite] = useState("");
  const [inputusername, setInputusername] = useState("");
  const [inputpassword, setInputpassword] = useState("");
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user_id = localStorage.getItem('user_id');
  const navigate=useNavigate()
  useEffect(() => {
    if (!user_id) {
      navigate("/login")
      return;
    }

    const fetchWebsites = async () => {
      try {
        console.log("Fetch Websites Payload:", JSON.stringify({ user_id }));
        const response = await fetch("http://localhost/lockify/read_website.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Fetch websites failed with status:", response.status, "Headers:", Object.fromEntries(response.headers), "Response:", errorText);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let result;
        try {
          result = await response.json();
        } catch (jsonError) {
          const errorText = await response.text();
          console.error("JSON parse error (fetch websites):", jsonError, "Headers:", Object.fromEntries(response.headers), "Response:", errorText);
          throw new Error("Invalid server response: Unable to parse JSON");
        }

        if (result.status) {
          setData(result.websites);
        } else {
          alert(result.message || "Failed to load websites");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchWebsites();
    // eslint-disable-next-line
  }, [user_id]);

  const resetForm = () => {
    setInputwebsite("");
    setInputusername("");
    setInputpassword("");
    setEditId(null);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!inputwebsite || !inputpassword) {
      alert("Website and password are required");
      return;
    }

    if (!user_id) {
      alert("User not logged in");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      website_name: inputwebsite,
      username: inputusername,
      password: inputpassword,
      user_id: user_id,
    };

    try {
      console.log("Add Payload:", JSON.stringify(payload));
      const response = await fetch("http://localhost/lockify/insert_website.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Add failed with status:", response.status, "Headers:", Object.fromEntries(response.headers), "Response:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        const errorText = await response.text();
        console.error("JSON parse error (add):", jsonError, "Headers:", Object.fromEntries(response.headers), "Response:", errorText);
        throw new Error("Invalid server response: Unable to parse JSON");
      }

      if (result.status) {
        const newEntry = {
          website_id: result.id,
          website_name: inputwebsite,
          username: inputusername,
          password: inputpassword,
        };
        setData([...data, newEntry]);
        resetForm();
        setMode(null);
      } else {
        alert(result.message || "Error saving website");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (item) => {
    setInputwebsite(item.website_name);
    setInputusername(item.username || "");
    setInputpassword(item.password);
    setEditId(item.website_id);
    setMode("edit");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!inputwebsite || !inputpassword) {
      alert("Website and password are required");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      website_id: editId,
      website_name: inputwebsite,
      username: inputusername,
      password: inputpassword,
      user_id: user_id,
    };

    try {
      console.log("Update Payload:", JSON.stringify(payload));
      const response = await fetch("http://localhost/lockify/update_website.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update failed with status:", response.status, "Headers:", Object.fromEntries(response.headers), "Response:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        const errorText = await response.text();
        console.error("JSON parse error (update):", jsonError, "Headers:", Object.fromEntries(response.headers), "Response:", errorText);
        throw new Error("Invalid server response: Unable to parse JSON");
      }

      if (result.status) {
        const updatedData = data.map(item =>
          item.website_id === editId ? { ...item, website_name: inputwebsite, username: inputusername, password: inputpassword } : item
        );
        setData(updatedData);
        resetForm();
        setMode(null);
      } else {
        alert(result.message || "Error updating website");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (website_id) => {
    if (!user_id) {
      alert("User not logged in");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Delete Payload:", JSON.stringify({ user_id, website_id }));
      const response = await fetch("http://localhost/lockify/delete_website.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, website_id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete failed with status:", response.status, "Headers:", Object.fromEntries(response.headers), "Response:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        const errorText = await response.text();
        console.error("JSON parse error (delete):", jsonError, "Headers:", Object.fromEntries(response.headers), "Response:", errorText);
        throw new Error("Invalid server response: Unable to parse JSON");
      }

      if (result.status) {
        const updatedData = data.filter(item => item.website_id !== website_id);
        setData(updatedData);
      } else {
        alert(result.message || "Failed to delete website");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className='heading-home-container'>
        <h1>Add your password</h1>
      </div>

      {mode ? (
        <div className='add-container'>
          <form
            className='add-inner-container'
            onSubmit={mode === "add" ? handleAddSubmit : handleUpdate}
          >
            <label>Website Name:</label>
            <input
              type='text'
              placeholder='Enter Website name'
              value={inputwebsite}
              onChange={(e) => setInputwebsite(e.target.value)}
              required
              autoComplete="url"
            />
            <label>Username:</label>
            <input
              type='text'
              placeholder='Enter Username'
              value={inputusername}
              onChange={(e) => setInputusername(e.target.value)}
              autoComplete="username"
            />
            <label>Password:</label>
            <input
              type='password'
              placeholder='Enter your password'
              value={inputpassword}
              onChange={(e) => setInputpassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <div style={{ marginTop: '10px' }}>
              <button type='submit' disabled={isSubmitting}>
                {mode === "edit" ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <button className='add-btn-container' onClick={() => { resetForm(); setMode("add"); }} disabled={isSubmitting}>
            Add
          </button>

          <div className='home-container'>
            {data.length === 0 ? (
              <p>No saved websites yet</p>
            ) : (
              data.map((item) => (
                <div className='inner-container' key={item.website_id}>
                  <h3>Website name: {item.website_name}</h3>
                  <p>Username: {item.username || "N/A"}</p>
                  <p>Password: {item.password}</p>
                  <div className='home-btn-container'>
                    <button onClick={() => handleEditClick(item)} disabled={isSubmitting}>Edit</button>
                    <button onClick={() => handleDelete(item.website_id)} disabled={isSubmitting}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;