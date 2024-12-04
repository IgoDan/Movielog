import { Box, Container, Flex } from "@chakra-ui/react"
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <Box py="4">
            <Container maxW={"container.xl"}>
                <Flex justifyContent={"space-between"}
                      alignItems={"center"}>
                    <Link to="/">
                        <Box fontSize={"2xl"} fontWeight={"bold"} color={"white"} letterSpacing={"widest"} fontFamily={"mono"} >
                            MOVIELOG
                        </Box>
                    </Link>
                    {/*Desktop*/}
                    <Flex gap="4" alignItems="center">
                        <Link to='/'>Home</Link>
                        <Link to='/movies'>Movies</Link>
                        <Link to='/shows'>Shows</Link>
                        <Link to='/watchlist'>Watchlist</Link>
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
};

export default Navbar;