import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, CircularProgress, CircularProgressLabel, Container, Flex, Heading, Img, Spinner, Text, Input, Divider, Badge, useToast } from "@chakra-ui/react"
import { fetchCredits, fetchDetails, imagePath, imagePathOriginal } from "../services/api";
import { CalendarIcon, SmallAddIcon, TimeIcon, CheckCircleIcon, RepeatClockIcon } from "@chakra-ui/icons";
import StarRating from "../widgets/StarRating";
import { ratingToPercentage, resolveRatingColor } from "../utils/helper";
import { useAuth } from "../context/useAuth";
import { useFirestore } from "../services/firestore";


const Details = () => {
    const router = useParams();
    const { type, id } = router;

    const toast = useToast();

    const { user } = useAuth();
    const { addToWatchlist, checkIfInWatchlist, removeFromWatchlist, updateWatchlist, fetchWatchlistElement } = useFirestore();

    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState({});
    const [cast, setCast] = useState({});
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);

    const [initialRating, setInitialRating] = useState(0);
    const [initialReview, setInitialReview] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [detailsData, creditsData] = await Promise.all([
                    fetchDetails(type, id),
                    fetchCredits(type, id),
                ]);

                setDetails(detailsData);
                setCast(creditsData?.cast?.slice(0, 10));

                console.log(details, 'details');
                console.log(cast, 'cast');
            } catch (error) {
                console.log(error, 'error');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [type, id]);

    useEffect (() => {
        if (!user) {
            setIsInWatchlist(false);
            return;
        } else {
            const dataId = createId(id, type);
            checkIfInWatchlist(user?.uid, dataId).then((data) => {
                setIsInWatchlist(data);
            });
            fetchWatchlistElement(user?.uid, dataId).then((watchlistElement) => {
                if (watchlistElement) {
                    setInitialRating(watchlistElement.user_rating);
                    setInitialReview(watchlistElement.user_review);
                    setRating(watchlistElement.user_rating);
                    setReview(watchlistElement.user_review);
                }
            });
        }
    }, [id, user])

    useEffect(() => {
        if (rating !== initialRating || review !== initialReview){
            setIsUpdated(true);
        }
    }, [review, rating]);

    const handleSaveToWatchlist = async () => {
        if (!user) {
            toast({
                title: "Login to add to watchlist",
                status: "error",
                isClosable: true
            });

            return;
        }

        const data = {
            id: details?.id,
            title: details?.title || details?.name,
            type: type,
            poster_path: details?.poster_path,
            release_date: details?.release_date || details?.first_air_date,
            overwiew: details?.overview,
            vote_average: details?.vote_average,
            user_rating: rating,
            user_review: review
        }

        const dataId = createId(details?.id, type);
        await addToWatchlist(user?.uid, dataId, data);

        const watchlistState = await checkIfInWatchlist(user?.uid, dataId);
        setIsInWatchlist(watchlistState);
    }

    const handleRemoveFromWatchlist = async () => {
        const dataId = createId(details?.id, type);
        await removeFromWatchlist(user?.uid, dataId);

        const watchlistState = await checkIfInWatchlist(user?.uid, dataId);
        setIsInWatchlist(watchlistState);

        setInitialRating(0);
        setInitialReview("");
        setRating(0);
        setReview("");
    }

    const handleUpdateWatchlist = async () => {
        const dataId = createId(details?.id, type);
    
        const updatedData = {
            user_rating: rating,
            user_review: review,
        };
    
        await updateWatchlist(user?.uid, dataId, updatedData);

        setInitialRating(rating);
        setInitialReview(review);
        setIsUpdated(false);
    };

    const createId = (id, type) => {
        return (type === "movie" ? "m" : "t") + id.toString();
    }

    const title = details?.title || details?.name;
    const releaseDate = type === "movie" ? details?.release_date : details?.first_air_date;

    if (loading){
        return(
            <Flex justify={"center"}>
                <Spinner size={"xl"} color={"white"}/>
            </Flex>
        )
    }

    return (
        <Box>
            <Box background={`linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.95)), url(${imagePathOriginal}/${details?.backdrop_path})`}
                 backgroundRepeat={"no-repeat"}
                 backgroundSize={"cover"}
                 backgroundPosition={"center"}
                 w={"100%"}
                 h={{base: "auto", md: "auto", lg: "600px"}}
                 py={"2"}
                 zIndex={"-1"}
                 display={"flex"}
                 alignItems={"center"}>
                <Container maxW={"container.xl"}>
                    <Flex alignItems={"center"} 
                          gap={"10"} 
                          flexDirection={{base: "column", lg: "row"}}>
                        <Img height={"450px"} 
                             borderRadius={"sm"} 
                             src={`${imagePath}/${details?.poster_path}`}/>
                        <Box>
                            <Heading fontSize={"3xl"}>
                                {title}
                                {" "}
                                <Text as="span"
                                      fontWeight={"normal"}
                                      color={"gray.400"}>
                                    {new Date(releaseDate).getFullYear()}
                                </Text>
                            </Heading>
                            <Flex alignItems={"center"} gap={"4"} my={1} mb={5}>
                                <Flex alignItems={"center"}>
                                    <CalendarIcon mr={2} 
                                                  color={"gray.400"}/>
                                    <Text fontSize={"sm"}>
                                    {new Date(releaseDate).toLocaleDateString("en-GB")}
                                    </Text>
                                </Flex>

                                {type === "movie" && (
                                <Flex alignItems={"center"}>
                                    <TimeIcon mr="2" color={"gray.400"} />
                                    <Text fontSize={"sm"}>
                                    {details?.runtime} min
                                    </Text>
                                </Flex>)}
                            </Flex>
                            <Flex alignItems={"center"} gap={"8"} flexDirection={"column"}>
                                <Flex flexDirection={"row"} gap={"10"}>
                                    <Flex alignItems={"center"} gap={"4"}>
                                        <CircularProgress value={ratingToPercentage(details?.vote_average)} 
                                                          bg={"gray.800"} 
                                                          borderRadius={"full"} p={"0.5"} 
                                                          size={"70px"} color={resolveRatingColor(details?.vote_average)} 
                                                          thickness={"6px"}>
                                            <CircularProgressLabel fontSize={"lg"}>
                                            {ratingToPercentage(details?.vote_average)}
                                            <Box as="span" 
                                                 fontSize={"10px"}>%</Box>
                                            </CircularProgressLabel>
                                        </CircularProgress>
                                        <Text fontWeight={"bold"}
                                              display={{base: "none", md: "initial"}}>
                                            TMDB score
                                        </Text>
                                    </Flex>
                                    <Flex alignItems={"center"} 
                                          gap={"4"}>
                                        <CircularProgress value={0} 
                                                          bg={"gray.800"} 
                                                          borderRadius={"full"} 
                                                          p={"0.5"} 
                                                          size={"70px"} 
                                                          color={resolveRatingColor(details?.vote_average)} 
                                                          thickness={"6px"}>
                                            <CircularProgressLabel fontSize={"lg"}>
                                            {0}
                                            <Box as="span" 
                                                 fontSize={"10px"}></Box>
                                            </CircularProgressLabel>
                                        </CircularProgress>
                                        <Text fontWeight={"bold"}
                                              display={{base: "none", md: "initial"}}>
                                            MOVIELOG score
                                        </Text>
                                    </Flex>
                                </Flex>
                                <Flex alignItems={"center"} 
                                      gap={"4"} 
                                      flexDirection={"row"}>
                                    <Text fontWeight={"bold"}>
                                        My score
                                    </Text>
                                    <StarRating rating={rating} 
                                                setRating={setRating} 
                                                count = {10}/>
                                    
                                </Flex>
                                <Input type="text"
                                       placeholder="Review"
                                       value={review}
                                       onChange={(event) => {setReview(event.target.value)}} />
                                {isInWatchlist && !isUpdated && (
                                    <Button leftIcon={<CheckCircleIcon/>}
                                            colorScheme="green"
                                            onClick={handleRemoveFromWatchlist}>
                                            In watchlist
                                    </Button>
                                )}
                                
                                {!isInWatchlist && (
                                    <Button leftIcon={<SmallAddIcon/>}
                                        variant={"outline"}
                                        onClick={handleSaveToWatchlist}>
                                        Add to watchlist
                                    </Button>
                                )}
                                {isInWatchlist && isUpdated && (
                                    <Button
                                        leftIcon={<RepeatClockIcon />}
                                        colorScheme="blue"
                                        variant={"outline"}
                                        onClick={handleUpdateWatchlist}>
                                        Update changes
                                    </Button>
                                )}
                            </Flex>
                        </Box>
                        <Box flexDirection={"column"}
                              marginLeft={"8px"}
                              alignItems={"left"}
                              width="400px">
                            <Heading color={"gray.400"}
                                     fontSize={"l"}
                                     mt={"3px"}
                                     fontWeight={"bold"}>
                                    Overwiew
                            </Heading>
                            <Text color={"gray.500"}
                                  fontSize={"md"}
                                  fontStyle={"italic"}
                                  my={"4"}>
                                    {details?.overview?.length > 250 
                                    ? `${details.overview.slice(0, 250)}...` 
                                    : details?.overview}
                            </Text>

                            <Divider orientation='horizontal' />

                            <Heading color={"gray.400"}
                                     fontSize={"l"}
                                     mt={"10px"}
                                     fontWeight={"bold"}>
                                    Language
                            </Heading>
                            <Text color={"gray.500"}
                                  fontSize={"md"}
                                  fontStyle={"italic"}
                                  my={"4"}>
                                    {details?.spoken_languages[0].english_name}
                            </Text>

                            <Divider orientation='horizontal' />

                            <Heading color={"gray.400"}
                                     fontSize={"l"}
                                     mt={"10px"}
                                     fontWeight={"bold"}>
                                Genres
                            </Heading>
                            <Flex mt={"6"} 
                                  gap={"2"}
                                  wrap={"wrap"}
                                  justifyContent={"flex-start"}>
                                {details?.genres?.map((genre) => (
                                    <Badge key={genre?.id} p={"1"}>{genre?.name}</Badge>
                                ))}
                            </Flex>
                        </Box>
                    </Flex>
                </Container>
            </Box>
            <Container maxWidth={"container.xl"} pb="10">
                <Heading as="h2"
                         fontSize={"md"}
                         textTransform={"uppercase"}
                         mt={"10"}>
                    Cast
                </Heading>
                <Flex mt={"5"}
                      mb={"10"}
                      overflowX={"auto"}
                      gap={"5"}>
                    {cast?.length === 0 && <Text>No cast found</Text>}
                    {cast && cast?.map((item) => (
                     <Box key={item?.id} minW={"230px"} maxW={"230px"}>
                        <Img src={`${imagePath}/${item?.profile_path}`} alt={"no-image"}></Img>
                        <Text align={"center"} my={"2"} fontSize={"sm"} fontWeight={"bold"}>{item?.original_name}</Text>
                        <Text align={"center"} my={"2"} fontSize={"sm"}>AS</Text>
                        <Text align={"center"} my={"2"} fontSize={"sm"} fontWeight={"bold"}>{item?.character}</Text>
                     </Box>   
                    ))}
                </Flex>
            </Container>
        </Box>
    );
};

export default Details