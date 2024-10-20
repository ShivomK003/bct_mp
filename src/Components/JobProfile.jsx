import {
  Input,
  Select,
  Textarea,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Box,
} from "@chakra-ui/react";
import { Country, State, City } from "country-state-city";
import { useUser } from "../utils/UserContext";
import DynamicServiceSelect from "../utils/DynamicServiceSelect"; // Assuming you have this component
import Navbar from "../utils/Navbar";
import { useState, useEffect } from "react";
import { IoPersonCircle } from "react-icons/io5";
import { doc, setDoc } from "firebase/firestore"; // Updated to use setDoc
import { db, storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function JobProfile() {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    jobTitle: "",
    technical: "NT",
    jobDescription: "",
    github: "",
    bio: "",
    country: "",
    state: "",
    services: [],
  });
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  useEffect(() => {
    const updateImage = async () => {
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(storageRef, user.profileImage);
      const imageUrl = await getDownloadURL(storageRef);
      setUser((prevUser) => ({
        ...prevUser,
        profileImage: imageUrl,
      }));
    };
    updateImage();
  }, [profileImagePreview]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      profileImage: file,
    }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setProfileImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const profileDocRef = doc(db, "profiles", user.uid);
    try {
      await setDoc(profileDocRef, formData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  return (
    <div className="bg-[url('../wallpaper.jpg')] bg-repeat text-white cursor-default">
      <Navbar />
      <div className="w-3/4 bg-white text-black mx-auto m-10 -mb-10 pb-10 p-5 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-medium text-center">Profile</h1>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch" width="full">
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                size="lg"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Job Title</FormLabel>
              <Select
                placeholder="Select job title"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))
                }
              >
                <option value="Web Developer">Web Developer</option>
                <option value="Graphic Designer">Graphic Designer</option>
                <option value="Social Media Specialist">
                  Social Media Specialist
                </option>
                <option value="Accountant">Accountant</option>
                <option value="Videographer">Videographer</option>
                <option value="Editor">Editor</option>
                <option value="Musician">Musician</option>
                <option value="Content Writer">Content Writer</option>
                <option value="Software Developer (T)">
                  Software Developer (T)
                </option>
                <option value="Tutor">Tutor</option>
                <option value="Other">Other</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Technical or Non-Technical Background</FormLabel>
              <Select
                placeholder="Select background"
                value={formData.technical}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, technical: e.target.value }))
                }
              >
                <option value="T">Technical</option>
                <option value="NT">Non-Technical</option>
              </Select>
            </FormControl>

            {formData.technical === "T" && (
              <FormControl>
                <FormLabel>GitHub Linking</FormLabel>
                <Input
                  size="lg"
                  placeholder="GitHub link"
                  value={formData.github}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, github: e.target.value }))
                  }
                />
              </FormControl>
            )}

            <FormControl>
              <FormLabel>Job Description</FormLabel>
              <Textarea
                placeholder="Job Description"
                value={formData.jobDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    jobDescription: e.target.value,
                  }))
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>About Yourself</FormLabel>
              <Textarea
                placeholder="About Yourself"
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Country Based In</FormLabel>
              <Select
                placeholder="Select country"
                value={formData.country}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
              >
                {Country.getAllCountries().map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Region Based In</FormLabel>
              <Select
                placeholder="Select state"
                value={formData.state}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    state: e.target.value,
                  }))
                }
              >
                {State.getStatesOfCountry(formData.country).map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <DynamicServiceSelect
              services={formData.services}
              setServices={(services) =>
                setFormData((prev) => ({ ...prev, services }))
              }
            />

            <Button type="submit" colorScheme="teal" size="lg">
              Save Profile
            </Button>
          </VStack>
        </form>
      </div>
    </div>
  );
}

export default JobProfile;
