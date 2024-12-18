import { Container, Heading, Flex, Spinner, Grid } from "@chakra-ui/react"
import { useState, useEffect } from "react";
import { useFirestore } from "../services/firestore";
import { useAuth } from "../context/useAuth";
import WatchlistComponent from "../components/WatchlistComponent";

const Watchlist = () => {
    const { getWatchlist } = useFirestore();
    const { user } = useAuth();
    const [watchlist, setWatchlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user?.uid) {
            getWatchlist(user?.uid)
                .then((data) => {
                    setWatchlist(data);
                    console.log(data, "data");
                })
                .catch((err) => {
                    console.log(err, "error");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [user?.uid]);

    return (
        <Container maxW={"container.xl"}>
            <Flex alignItems={"baseline"}
                gap={"4"}
                my={"10"}>
                <Heading as="h2"
                    fontSize={"md"}
                    textTransform={"uppercase"}>
                    Watchlist
                </Heading>
            </Flex>
            {isLoading && (
                <Flex justify={"center"} mt={"10"}>
                    <Spinner size={"xl"} color="white" />
                </Flex>
            )}
            {!isLoading && watchlist?.length === 0 && (
                <Heading as={"h2"} fontSize={"md"} textTransform={"uppercase"}>
                    Nothing here! Add movies or shows to your watchlist
                </Heading>
            )}
            {!isLoading && watchlist?.length > 0 && (
                <Flex gap={"5"} justifyContent={"center"}>
                    <Grid templateColumns={{
                        base: "1fr",
                        sm: "repeat(1, 1fr)",
                        md: "repeat(1, 1fr)",
                        lg: "repeat(1, 5fr)",
                        xl: "repeat(2, 5fr)"
                    }}
                        gap={"30px"}>
                        {watchlist?.map((item) => (
                            <WatchlistComponent
                                key={item?.id}
                                item={item}
                                type={item?.type}
                                setWatchlist={setWatchlist}
                            />))}
                    </Grid>
                </Flex>
            )}
        </Container>
    );
};

export default Watchlist;