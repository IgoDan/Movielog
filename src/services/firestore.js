import { db } from "../services/firebase";
import { collection, addDoc, doc, setDoc, getDoc, deleteDoc, updateDoc, getDocs, runTransaction  } from 'firebase/firestore'
import { useToast } from '@chakra-ui/react';
import { useCallback } from "react";

export const useFirestore = () => {

    const toast = useToast()

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
            await addRatingToAverage(dataId, data.user_rating);
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
            const watchlistRef = doc(db, "users", userId, "watchlist", dataId);
            const docSnap = await getDoc(watchlistRef);

            if (docSnap.exists()) {
                const userRating = docSnap.data().user_rating;
                await removeRatingFromAverage(dataId, userRating);
                await deleteDoc(watchlistRef);
            }
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
            const watchlistRef = doc(db, "users", userId, "watchlist", dataId);
            const docSnap = await getDoc(watchlistRef);

            if (docSnap.exists()) {
                const oldRating = docSnap.data().user_rating;
                const newRating = updatedData.user_rating;

                await updateRatingInAverage(dataId, oldRating, newRating);
                await updateDoc(watchlistRef, updatedData);
            }
    
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

    const getWatchlist = useCallback(async (userId) => {
        const querySnapshot = await getDocs(
          collection(db, "users", userId, "watchlist")
        );
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        return data;
    }, []);

    const addRatingToAverage = async (dataId, rating) => {
        const ratingsRef = doc(db, "ratings", dataId);
        const ratingsDoc = await getDoc(ratingsRef);

        let averageRating = 0;
        let totalRatings = 0;

        if (ratingsDoc.exists()) {
            averageRating = ratingsDoc.data().averageRating;
            totalRatings = ratingsDoc.data().totalRatings;
        }

        totalRatings += 1;
        averageRating = (averageRating * (totalRatings - 1) + rating) / totalRatings;

        await setDoc(ratingsRef, { averageRating, totalRatings }, { merge: true });
    };

    const removeRatingFromAverage = async (dataId, rating) => {
        const ratingsRef = doc(db, "ratings", dataId);
        const ratingsDoc = await getDoc(ratingsRef);

        let averageRating = 0;
        let totalRatings = 0;

        if (ratingsDoc.exists()) {
            averageRating = ratingsDoc.data().averageRating;
            totalRatings = ratingsDoc.data().totalRatings;
        }

        if (totalRatings > 1) {
            averageRating = (averageRating * totalRatings - rating) / (totalRatings - 1);
            totalRatings -= 1;
        } else {
            averageRating = 0;
            totalRatings = 0;
        }

        await setDoc(ratingsRef, { averageRating, totalRatings }, { merge: true });
    };

    const updateRatingInAverage = async (dataId, oldRating, newRating) => {
        const ratingsRef = doc(db, "ratings", dataId);
        const ratingsDoc = await getDoc(ratingsRef);

        let averageRating = 0;
        let totalRatings = 0;

        if (ratingsDoc.exists()) {
            averageRating = ratingsDoc.data().averageRating;
            totalRatings = ratingsDoc.data().totalRatings;
        }

        averageRating = (averageRating * totalRatings - oldRating + newRating) / totalRatings;

        await setDoc(ratingsRef, { averageRating, totalRatings }, { merge: true });
    };

    const fetchAverageRating = async (dataId) => {
        try {
            const docRef = doc(db, "ratings", dataId);
            const docSnapshot = await getDoc(docRef);
    
            if (docSnapshot.exists()) {
                return docSnapshot.data();
            } else {
                console.log("No document for this movie/show");
                return null;
            }
        } catch (error) {
            console.error("Error fetching average rating", error);
            toast({
                title: "Error",
                description: "Error while fetching average rating",
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
        fetchWatchlistElement,
        getWatchlist,
        fetchAverageRating
    };
};