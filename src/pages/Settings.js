import { useEffect, useState } from "react";
import "./styles/Settings.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Loader } from "../components/loader";
import SaveButton from "../components/SaveButton";

export const Settings = () => {
  const [images, setImages] = useState([{}]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [checkAdmin, setAdmin] = useState(false)

  const fetchWallpapers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/wallpapers`,
        {
          withCredentials: true,
        }
      );
      setImages(res.data.wallpapers);
      setAdmin(res.data.isAdmin);
    } catch (error) {
      console.error("Fetch error:", error);

      setTimeout(() => {
        toast.error(
        error?.response?.data?.message || "Failed to load wallpapers."
      );
      }, 1);
      
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallpapers();
  }, []);

  const uploadToCloudinary = async (fileOrUrl) => {
    const formData = new FormData();
    formData.append(
      "upload_preset",
      process.env.REACT_APP_UNSIGNED_PRESENT_CHAT_BACKGROUND
    );
    formData.append("folder", "Omnio/Chat_Backgrounds");

    if (fileOrUrl instanceof File) {
      formData.append("file", fileOrUrl);
    } else {
      formData.append("file", fileOrUrl);
    }

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
      formData
    );

    return res.data.secure_url;
  };

  const postToBackend = async (imageUrl) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/wallpapers`,
        { wallpaper_url: imageUrl },
        { withCredentials: true }
      );
      setImages((prev) => {
        return [...prev, { wallpaper_url: imageUrl }];
      });

      setTimeout(() => {
        toast.success(res.data.message || "Success", {
        closeOnClick: true,
        draggable: true,
        closeButton: false,
      });
      }, 1);
      
    } catch (err) {
      setTimeout(() => {
        toast.error(err.response.data.message || "Failed to save to server", {
        draggable: true,
        closeOnClick: true,
      });
      }, 1);
      
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) return;

    setIsLoading(true);
    try {
      const uploadedUrl = await uploadToCloudinary(imageFile);
      await postToBackend(uploadedUrl);
      setImageFile(null);
    } catch (err) {
      setTimeout(() => {
        toast.error(err.response.data.massage || "Upload failed", {
        draggable: true,
        closeOnClick: true,
      });
      }, 1);
      
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl) return;

    setIsLoading(true);
    try {
      const uploadedUrl = await uploadToCloudinary(imageUrl.trim());
      await postToBackend(uploadedUrl);
      setImageUrl("");
    } catch (err) {
      setTimeout(() => {
        toast.error(err.response.data.message || "Upload via URL failed", {
        draggable: true,
        closeOnClick: true,
      });
      }, 1);
      
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeWallpaper = (chat_background) => {
    setIsLoading(true)
    axios.post(`${process.env.REACT_APP_SERVER_URL}/users/wallpaper`, {
      chat_background, id: localStorage.getItem("user")
    }, {
      withCredentials: true
    })
    .then(res => {
      setIsLoading(false)
      localStorage.setItem("chat_background", chat_background)
      setTimeout(() => {
              toast.success(res.data.message || "Wallpaper Changed", {
                draggable: true,
                closeOnClick: true,
                closeButton: false
              })

      }, 1);
      
    })
    .catch(err => {
      toast.error(err.response.data.message || "Error in changing wallpaper", {
                draggable: true,
                closeOnClick: true,
                closeButton: false
              })
      console.log(err.response || "Error in changing wallpaper")
    })
  }

  if (isLoading) return <Loader />;

  return (
    <div className="gallery-container">
      <h2>Wallpapers</h2>

      {checkAdmin && (
        /* Upload Section */
        <div className="upload-section">
          <form onSubmit={handleFileUpload}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            <button type="submit">Upload File</button>
          </form>

          <form onSubmit={handleUrlSubmit}>
            <input
              type="text"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <button type="submit">Add via URL</button>
          </form>
        </div>
      )}

      {/* Image Grid */}
       <div className="image-grid">
      {images &&
        images.map((img, idx) => (
          <span
            key={idx}
            onMouseEnter={() => setShowButton(idx)}
            onMouseLeave={() => setShowButton(null)}
            style={{ position: 'relative', display: 'inline-block' }}
          >
            <img
              src={img.wallpaper_url || img.url || img}
              alt={`img-${idx}`}
            />
            {showButton === idx && (
              <div className="background-save-button" style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 10
              }} onClick={() => handleChangeWallpaper(img.wallpaper_url || img.url || img)}>
                <SaveButton />
              </div>
            )}
          </span>
        ))}
    </div>

      <ToastContainer />
    </div>
  );
};
