import { Avatar, Box, Container, Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
    const {user, signInWithGoogle, logOut} = useAuth();

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
            console.log("success")
        } catch (err) {
            console.log(err, "err")
        }
    }

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
                        {!user && (
                            <Avatar size={"sm"} bg={"gray.800"} as="button" onClick={handleGoogleLogin}/>
                        )}
                        {user && (
                            <Menu>
                                <MenuButton>
                                    <Avatar bg={"gray.500"} color={"white"} size={"sm"} name={user?.email}/>
                                </MenuButton>
                                <MenuList>
                                <Link to='/watchlist'>
                                    <MenuItem>Watchlist</MenuItem>
                                </Link>
                                <MenuItem onClick={logOut}>Logout</MenuItem>
                                </MenuList>
                            </Menu>
                        )}
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
};

export default Navbar;