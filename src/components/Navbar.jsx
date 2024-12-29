import { Avatar, Box, Container, Flex, Menu, MenuButton, MenuItem, MenuList, IconButton, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Button, Text } from "@chakra-ui/react"
import { HamburgerIcon, useToast } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
    const { user, signInWithGoogle, logOut } = useAuth();
    const { onOpen, isOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const toast = useToast()

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
            console.log("success")
        } catch (err) {
            console.log(err, "err")
        }
    }

    const handleGoogleLogout = async () => {
        try {
            await logOut();
            console.log("success")
            toast({
                title: "Success",
                description: "User logged out",
                status: "success",
                isClosable: true
            });
            navigate("/");
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
                    <Flex gap="4" alignItems="center" display={{ base: "none", md: "flex" }}>
                        <Link to='/'>Home</Link>
                        <Link to='/movies'>Movies</Link>
                        <Link to='/shows'>Shows</Link>
                        {!user && (
                            <Avatar size={"sm"} bg={"gray.800"} as="button" onClick={handleGoogleLogin} />
                        )}
                        {user && (
                            <Menu>
                                <MenuButton>
                                    <Avatar bg={"gray.500"} color={"white"} size={"sm"} name={user?.displayName || user?.email} />
                                </MenuButton>
                                <MenuList>
                                    <Link to='/watchlist'>
                                        <MenuItem>Watchlist</MenuItem>
                                    </Link>
                                    <MenuItem onClick={handleGoogleLogout}>Logout</MenuItem>
                                </MenuList>
                            </Menu>)}
                    </Flex>

                    {/* Mobile */}
                    <Flex
                        display={{ base: "flex", md: "none" }}
                        alignItems={"center"}
                        gap="4">
                        <IconButton onClick={onOpen} icon={<HamburgerIcon />} />
                        <Drawer isOpen={isOpen} placement="center" onClose={onClose}>
                            <DrawerOverlay />
                            <DrawerContent bg={"black"}>
                                <DrawerCloseButton />
                                <DrawerHeader>
                                    {user ? (
                                        <Flex alignItems="center" gap="2" justifyContent={"center"}>
                                            <Avatar bg="gray.500" size={"sm"} name={user?.displayName || user?.email}/>
                                            <Text fontSize={"sm"} onClick={handleGoogleLogin}>{user?.displayName || user?.email}</Text>
                                        </Flex>) :
                                        (<Flex alignItems="center" gap="2" justifyContent={"center"}>
                                            <Avatar bg="gray.800" size={"sm"} onClick={handleGoogleLogin}/>
                                            <Text fontSize={"sm"} onClick={handleGoogleLogin}>Click to login</Text>
                                        </Flex>)}
                                </DrawerHeader>

                                <DrawerBody>
                                    <Flex flexDirection={"column"} alignItems={"center"} justifyContent={"center"} gap={"4"} onClick={onClose}>
                                        <Link to="/">Home</Link>
                                        <Link to="/movies">Movies</Link>
                                        <Link to="/shows">Shows</Link>
                                        {user && (<>
                                                <Link to="/watchlist">Watchlist</Link>
                                                <Button variant={"outline"}
                                                        colorScheme="red"
                                                        onClick={handleGoogleLogout}>
                                                    Logout
                                                </Button>
                                            </>)}
                                    </Flex>
                                </DrawerBody>
                            </DrawerContent>
                        </Drawer>
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
};

export default Navbar;