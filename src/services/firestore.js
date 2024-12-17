import { db } from "../services/firebase";
import { collection, addDoc, doc, setDoc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore'
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
        const docRef = doc(db, "users", userId?.toString(), "watchlist", dataId?.toString());
    
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()){
            return true;
        } else {
            false;
        }
    }

    const removeFromWatchlist = async (userId, dataId) => {
        try {
            await deleteDoc(doc(db, "users", userId?.toString(), "watchlist", dataId?.toString()))
            toast({
                title: "Success",
                description: "Removed from watchlist",
                status: "success",
                isClosable: true
            });
        } catch(error) {
            console.log(error, "error")
            toast({
                title: "Error",
                description: "Error while deleting from watchlist",
                status: "error",
                isClosable: true
            });
        }
    }

    const updateWatchlist = async (userId, dataId, updatedData) => {
        try {
            const docRef = doc(db, "users", userId, "watchlist", dataId);
            await updateDoc(docRef, updatedData);
    
            toast({
                title: "Success",
                description: "Updated item in watchlist",
                status: "success",
                isClosable: true,
            });
        } catch (error) {
            console.error("error", error);
    
            toast({
                title: "Error",
                description: "Error while updating item in watchlist",
                status: "error",
                isClosable: true,
            });
        }
    };

    const fetchWatchlistElement = async (userId, dataId) => {
        try {
            const docRef = doc(db, "users", userId, "watchlist", dataId);
            const docSnapshot = await getDoc(docRef);
    
            if (docSnapshot.exists()) {
                return docSnapshot.data();
            } else {
                console.log("No document for this movie/show");
                return null;
            }
        } catch (error) {
            console.error("Error fetching review and rating", error);
            toast({
                title: "Error",
                description: "Error while fetching item data",
                status: "error",
                isClosable: true,
            });
        }
    };

    return {
        addToWatchlist,
        checkIfInWatchlist,
        removeFromWatchlist,
        updateWatchlist,
        fetchWatchlistElement
    };
};