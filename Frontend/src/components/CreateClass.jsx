import { useState, useEffect } from "react";
import { Modal, Box, Button, Select, MenuItem, Input } from "@mui/material";
import axios from "axios";

function CreateClass({ onClose, classes }) {
    const [displayProfile, setDisplayProfile] = useState(true);
    const [selectedClass, setSelectedClass] = useState("");
    // State for available classes for user
    const [classList, setClassList] = useState([]);
    const [showAddButton, setShowAddButton] = useState(false);

    let className = ""
    let description = ""

    // Add user to class
    const addClass = async(req, res) => {
        try {
            await axios.post("http://localhost:3000/add-class", {
                classID: selectedClass,
            });
            // Refresh browser to show changes
            window.location.reload();
        } catch(error) {
            console.error("Error adding user to class", error);
        }
    };

  useEffect(() => {
    setDisplayProfile(true);
    openUserProfile();
  }, []);

  function openUserProfile() {
    setDisplayProfile(true);
  }

  function closeUserProfile() {
    setDisplayProfile(false);
    onClose();
  }


  return (
    <>
      {displayProfile && (
        <Modal open={true} onClose={closeUserProfile} id="the-user-profile">
          <Box
            sx={{
              maxWidth: '500px',
              margin: 'auto',
              marginTop: '50px',
              padding: '20px',
              borderRadius: '4px',
              textAlign: 'center',
            }}
          >
            <div className="user-profile-content">
                <h4>Create a Class</h4>
                <h6>Class Name</h6>
                <input 
                    type="text"
                    // value={className} 
                    // onChange={handleClassNameChange} 
                    placeholder="Enter class name"
                />
                <h6><br/>Description (optional)</h6>
                <input 
                    type="text"
                    // value={description} 
                    // onChange={handleClassDescriptionChange} 
                    placeholder="Enter class description"
                />
                <br/>
                <br/>
                <button
                  variant="contained"
                  color="primary"
                //   onClick={addClass}
                  style={{ width: "15%", marginTop: "44%", marginRight: "10%" }}
                  className="profile-button"
                >
                  Add
                </button>
              <br />
            </div>
          </Box>
        </Modal>
      )}
    </>
  );
}

export default CreateClass;
