import {
  Input,
  Select,
  Textarea,
  Button,
  VStack,
  Stack,
  FormControl,
  FormLabel,
  Box,
  Radio,
  RadioGroup,
  Alert,
  AlertIcon,
  Image // Import the Image component
} from "@chakra-ui/react";
import { Country, State } from "country-state-city";
import { useUser } from "../utils/UserContext";
import DynamicServiceSelect from "../utils/DynamicServiceSelect"; // Assuming you have this component
import Navbar from "../utils/Navbar";
import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore"; // Updated to use setDoc
import { db, storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

function JobProfile() {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    jobTitle: "",
    jobDescription: "",
    githubAccount: "",
    bio: "",
    country: "",
    state: "",
    services: [],
  });
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [hasGithub, setHasGitHub] = useState("0");

  const navigate = useNavigate();

  useEffect(() => {
    const updateImage = async () => {
      if (user) {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, user.profileImage);
        const imageUrl = await getDownloadURL(storageRef);
        setUser((prevUser) => ({
          ...prevUser,
          profileImage: imageUrl,
        }));
      }
    };
    updateImage();
  }, [profileImagePreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const profileDocRef = doc(db, "profiles", user.uid);
    try {
      await setDoc(profileDocRef, formData);

      setUser((prevData) => ({
        ...prevData,
        profile: formData,
      }));

      alert("Profile updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  
  return (
    <div>
      <Navbar />
      <div className="bg-[url('../wallpaper.jpg')] bg-repeat text-white cursor-default">
        <div className="h-28"></div>
        <div className="w-1/3 bg-white text-black mx-auto p-11 flex flex-col items-center rounded-lg shadow-2xl justify-center">
          <h1 className="text-4xl font-medium text-center">Profile</h1>

          {/* Display the profile image */}
          {user.profileImage && (
            <Box mb={4}>
              <Image
                borderRadius="full"
                boxSize="100px" // Adjust size as needed
                src={user.profileImage}
                alt="Profile Image"
                objectFit="cover"
              />
            </Box>
          )}

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
                  <option value="Social Media Specialist">Social Media Specialist</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Videographer">Videographer</option>
                  <option value="Editor">Editor</option>
                  <option value="Musician">Musician</option>
                  <option value="Content Writer">Content Writer</option>
                  <option value="Software Developer">Software Developer</option>
                  <option value="Tutor">Tutor</option>
                  <option value="Other">Other</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Do you use GitHub?</FormLabel>
                <RadioGroup
                  value={hasGithub}
                  onChange={setHasGitHub}
                >
                  <Stack direction='row'>
                    <Radio value="1">Yes</Radio>
                    <Radio value="0">No</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
              {hasGithub === "1" && (
                <FormControl>
                  <FormLabel>GitHub Linking</FormLabel>
                  <Input
                    size="lg"
                    placeholder="GitHub link"
                    value={formData.githubAccount}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, githubAccount: e.target.value }))
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
              <DynamicServiceSelect
                services={formData.services}
                setServices={(updatedServices) =>
                  setFormData((prev) => ({ ...prev, services: updatedServices }))
                }
              />
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
              <Button type="submit" colorScheme="teal" size="lg">
                Save Profile
              </Button>
            </VStack>
          </form>
        </div>
        <div className="h-10"></div>
      </div>
    </div>
  );
}

export default JobProfile;
