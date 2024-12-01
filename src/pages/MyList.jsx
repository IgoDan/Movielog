import { Container, Heading } from "@chakra-ui/react"

const MyList = () => {
    return (
        <Container maxW={"container.xl"}>
            <Heading as="h2" fontSize={"md"} textTransform={"uppercase"}>
                My List
            </Heading>
    </Container>
    )
};

export default MyList;