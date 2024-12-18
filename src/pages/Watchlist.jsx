import { Container, Heading, Flex } from "@chakra-ui/react"
import { useState, useEffect } from "react";
import { useFirestore } from "../services/firestore";
import { useAuth } from "../context/useAuth";

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
        </Container>
    );
};

export default Watchlist;