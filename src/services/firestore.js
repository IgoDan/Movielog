import { db } from "../services/firebase";
import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore'
import { useToast } from '@chakra-ui/react';

export const useFirestore = () => {

    const toast = useToast()

    // const addDocument = async (collectionName, data) => {
    //     const docRef = await addDoc(collection(db, collectionName), data);
    // };

    const addToWatchlist = async (userId, dataId, data) => {
        if (await checkIfInWatchlist(userId, dataId)){
            toast({
                title: "Info",
                description: "Already in watchlist",
                status: "info",
                duration: 9000,
                isClosable: true
            });

            return false;
        }
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

    const checkIfInWatchlist = async (userId, dataId) => {
        const docRef = doc(db, "users", userId?.toString(), "watchlist", dataId.toString());
    
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()){
            return true;
        } else {
            false;
        }
    }

    return {
        addToWatchlist,
        checkIfInWatchlist,
    };
};