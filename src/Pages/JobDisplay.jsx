import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Country, State } from "country-state-city";
import Navbar from "../utils/Navbar";
import { useUser } from "../utils/UserContext";
import { IoPersonCircle } from "react-icons/io5"; 
import { Button } from '@chakra-ui/react'

function ProfileDisplayPage() {
    const { id } = useParams(); 
    const [profileData, setProfileData] = useState(null);
    const [services, setServices] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileAndServices = async () => {
            try {
                const profileDocRef = doc(db, "profiles", id);
                const profileDoc = await getDoc(profileDocRef);

                const servicesCollectionRef = collection(profileDocRef, "services");
                const servicesSnapshot = await getDocs(servicesCollectionRef);
                const servicesList = servicesSnapshot.docs.map(doc => ({ ...doc.data() }));
                setServices(servicesList);

                if (profileDoc.exists()) {
                    setProfileData(profileDoc.data());
                } else {
                    console.log("No such profile!");
                }
            } catch (error) {
                console.error("Error fetching profile: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileAndServices();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="h-screen bg-[url('../wallpaper.jpg')] text-white cursor-default">
            <Navbar /> 
            <div className="h-24"></div>
            {profileData ? (
                <div className="bg-white text-black p-7 mx-auto w-[50%] rounded-lg h-[80%]">
                    <div className="w-full flex">
                        {user ? (
                            user.profileImage && !imageError ? (
                                <img
                                    src={user.profileImage}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover ml-5 mr-3"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <IoPersonCircle className="ml-6 w-56 h-auto text-gray-400 mr-3" />
                            )
                        ) : null}
                        <h1 className="my-auto w-full text-center text-3xl">{profileData.name}</h1>
                    </div>
                    <table className="table-auto w-full text-center">
                        <tbody>
                            <tr className="h-4"> {/* Set the row height */}
                                <td className="font-bold align-middle w-[30%] p-10">Job Title</td>
                                <td className="align-middle">{profileData.jobTitle}</td>
                            </tr>
                            <tr className="h-4">
                                <td className="font-bold align-middle w-[30%] p-10">Location</td>
                                <td className="align-middle">
                                    {State.getStateByCodeAndCountry(profileData.state, profileData.country)?.name}, 
                                    {Country.getCountryByCode(profileData.country)?.name}
                                </td>
                            </tr>
                            <tr className="h-4">
                                <td className="font-bold align-middle w-[30%] p-10">Services</td>
                                <td className="align-middle">
                                    {services && services.map((service, index) => (
                                        <div key={index} className="flex text-start">
                                            <div>
                                                <span className="font-bold">Title: </span>{service.title}<br />
                                                <span className="font-bold">Description: </span>{service.description}<br />
                                                <span className="font-bold">Pricing: </span>{service.price}/hr <br />
                                            </div>
                                            <Button colorScheme='blue' w="50%" mx="auto" alignSelf="center" onClick={() => {navigate(`/booking/${id}/${index}`, {state: {pricePerHour: service.price}})}}>Hire this service</Button>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>
                    
                </div>
            ) : (
                <div>Profile not found</div>
            )}
            
        </div>
    );
}

export default ProfileDisplayPage;
