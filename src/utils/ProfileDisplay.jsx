import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig"; // Adjust the path as needed
import { collection, getDocs } from "firebase/firestore";
import { IoPersonCircle } from "react-icons/io5"; 
import { Card, CardHeader, CardBody, CardFooter, Text, Image, Flex, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function ProfileDisplay() {
    const [profiles, setProfiles] = useState([]);
    const navigate = useNavigate(); // Initialising useNavigate

    useEffect(() => {
        const fetchProfiles = async () => {
            const profilesCollection = collection(db, "profiles"); // Adjust if the collection name is different
            const profilesSnapshot = await getDocs(profilesCollection);
            const profilesList = profilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProfiles(profilesList);
        };
        
        fetchProfiles();
    }, []);

    useEffect(() => {
        console.log(profiles);
    }, [profiles])

    return (
        <div className="flex flex-wrap justify-center p-4">
            {profiles.map((profile, index) => (
                <Link key={index} to={`/display/${profile.id}`}>
                    <Card width="15rem" m={4} borderRadius="lg" overflow="hidden"> {/* Wider card */}
                        <CardHeader bg="#1524bd" py={4} textAlign="center"> {/* Replace 'yourCustomColor' with actual color */}
                            <Box display="flex" justifyContent="center">
                                {profile.profileImage ? <Image 
                                    borderRadius="full" 
                                    boxSize="10rem"
                                    src={profile.profileImage} 
                                    alt={profile.name} 
                                    objectFit="cover" 
                                /> : 
                                <IoPersonCircle className="w-20 h-auto text-gray-400" />
                                }
                            </Box>
                            <Text 
                                fontSize="xl" 
                                fontWeight="bold" 
                                textColor={"white"} 
                                cursor="pointer" // Change cursor to pointer for clickable text
                            >
                                {profile.name}
                            </Text>
                            <Text fontSize="lg" color="gray.500" textColor={"white"}>{profile.jobTitle}</Text>
                        </CardHeader>
                        <CardBody>
                            <Text textAlign="center">{profile.jobDescription}</Text>
                        </CardBody>
                        <CardFooter>
                            <Flex justifyContent="center" width="100%">
                                <Flex alignItems="center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                    </svg>
                                    <Text ml={1}>{profile.country}, {profile.state}</Text>
                                </Flex>
                            </Flex>
                        </CardFooter>
                    </Card> 
                </Link>
            ))}
        </div>
    );
}

export default ProfileDisplay;
