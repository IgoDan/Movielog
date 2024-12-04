import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, CircularProgress, CircularProgressLabel, Container, Flex, Heading, Img, Spinner, Text, Input, Divider, Badge } from "@chakra-ui/react"
import { fetchCredits, fetchDetails, imagePath, imagePathOriginal } from "../services/api";
import { CalendarIcon, CheckCircleIcon, SmallAddIcon } from "@chakra-ui/icons";
import StarRating from "../widgets/StarRating";
import { ratingToPercentage, resolveRatingColor } from "../utils/helper";

const Details = () => {
    const router = useParams();
    const { type, id } = router;

    const [loading, setLoading] = useState(true);

    const [details, setDetails] = useState({});
    const [cast, setCast] = useState({});

    const [rating, setRating] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [detailsData, creditsData] = await Promise.all([
                    fetchDetails(type, id),
                    fetchCredits(type, id),
                ])

                setDetails(detailsData)
                setCast(creditsData)
            } catch (error) {
                console.log(error, 'error')
            } finally {
                setLoading(false);
            }
        }

        fetchData()
    }, [type, id]);

    console.log(details, 'details')
    console.log(cast, 'cast')

    if (loading){
        return(
            <Flex justify={"center"}>
                <Spinner size={"xl"} color={"white"}/>
            </Flex>
        )
    }

    const title = details?.title || details?.name;
    const releaseDate = type === "movie" ? details?.release_date : details?.first_air_date;

    return (
        <Box>
            <Box background={`linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.95)), url(${imagePathOriginal}/${details?.backdrop_path})`}
                 backgroundRepeat={"no-repeat"}
                 backgroundSize={"cover"}
                 backgroundPosition={"center"}
                 w={"100%"}
                 h={{base: "auto", md: "auto", lg: "450px"}}
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
                                {/* <Button leftIcon={<CheckCircleIcon/>}
                                        colorScheme="green"
                                        variant={"outline"}
                                        onClick={() => console.log("click")}>
                                        In watchlist
                                </Button> */}
                                <Input placeholder='Review' />
                                <Button leftIcon={<SmallAddIcon/>}
                                        variant={"outline"}
                                        onClick={() => console.log("click")}>
                                        Add to watchlist
                                </Button>
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
                                    {details?.overview?.length > 200 
                                    ? `${details.overview.slice(0, 200)}...` 
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
                                  wrap={"wrap"} // Umożliwia zawijanie elementów do nowych wierszy
                                  justifyContent={"flex-start"}>
                                {details?.genres?.map((genre) => (
                                    <Badge key={genre?.id} p={"1"}>{genre?.name}</Badge>
                                ))}
                            </Flex>
                        </Box>
                    </Flex>
                </Container>
            </Box>
        </Box>
    );
};

export default Details