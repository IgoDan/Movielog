import { Container, Heading } from "@chakra-ui/react"

const Games = () => {
    return (
        <Container maxW={"container.xl"}>
            <Heading as="h2" fontSize={"md"} textTransform={"uppercase"}>
                All Games
            </Heading>
        </Container>
    );
};

export default Games