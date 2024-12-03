import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, CircularProgressLabel, Container, Flex, Heading, Img, Spinner, Text } from "@chakra-ui/react"
import { fetchDetails, imagePath, imagePathOriginal } from "../services/api";
import { CalendarIcon } from "@chakra-ui/icons";
import StarRating from "../widgets/StarRating";
import { ratingToPercentage, resolveRatingColor } from "../utils/helper";

const Details = () => {
    const router = useParams();
    const { type, id } = router;

    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState({});

    const [rating, setRating] = useState(0);

    useEffect(() => {
        fetchDetails(type, id)
        .then((res) => {
            console.log(res, 'res');
            setDetails(res);
       })
       .catch((err) => {
            console.log(err, 'err');
       })
       .finally(() => {
            setLoading(false);
       })
    }, [type, id]);

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
                 h={{base: "auto", md: "500px"}}
                 py={"2"}
                 zIndex={"-1"}
                 display={"flex"}
                 alignItems={"center"}>
                <Container maxW={"container.xl"}>
                    <Flex alignItems={"center"} 
                          gap={"10"} 
                          flexDirection={{base: "column", md: "row"}}>
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
                        </Box>
                    </Flex>
                </Container>
            </Box>
        </Box>
    );
};

export default Details