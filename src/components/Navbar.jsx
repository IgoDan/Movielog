import { Box, Container, Flex } from "@chakra-ui/react"
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <Box py="4" mb="2">
            <Container maxW={"container.xl"}>
                <Flex justifyContent={"space-between"}>
                    <Link to="/">
                        <Box fontSize={"2xl"} fontWeight={"bold"} color={"white"} letterSpacing={"widest"} fontFamily={"mono"} >
                            GAMELOG
                        </Box>
                    </Link>
                    {/*Desktop*/}
                    <Flex gap="4" alignItems="center">
                        <Link to='/'>Home</Link>
                        <Link to='/games'>All Games</Link>
                        <Link to='/mylist'>My List</Link>
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
};

export default Navbar;