import { db } from "../services/firebase";
import { collection, addDoc, doc, setDoc } from 'firebase/firestore'
import { useToast } from '@chakra-ui/react';

export const useFirestore = () => {

    const toast = useToast()

    // const addDocument = async (collectionName, data) => {
    //     const docRef = await addDoc(collection(db, collectionName), data);
    // };

    const addToWatchlist = async (userId, dataId, data) => {
        try{
            await setDoc(doc(db, "users", userId, "watchlist", dataId), data);
            toast({
                title: "Success",
                description: "Added to watchlist",
                status: "success",
                isClosable: true
            });
        } catch (error) {
            console.log(error, "error")
            toast({
                title: "Error",
                description: "Error while adding to watchlist",
                status: "error",
                isClosable: true
            });
        }
    };

    return {
        addToWatchlist,
    };
};

const checkIfInWatchlist = async (userId, dataId) => {

}