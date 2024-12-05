import { Container, Grid, Heading, Skeleton, Flex, Select } from "@chakra-ui/react"
import { act, useEffect, useState } from "react";
import { fetchMovies } from "../services/api";
import CardComponent from "../components/CardComponent";
import PagingComponent from "../components/PagingComponent";

const Movies = () => {

    const [movies, setMovies] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState("vote_average.desc&vote_count.gte=1000");

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetchMovies(activePage, sortBy).then((res) => {
            console.log(res, 'res')
            setMovies(res?.results);
            setActivePage(res?.page);
            setTotalPages(res?.total_pages);
        })
        .catch((err) => console.log(err, 'err'))
        .finally(( () => setIsLoading(false)))
    }, [activePage, sortBy])

    return (
        <Container maxW={"container.xl"}>
            <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
                <Heading as="h2" fontSize={"md"} textTransform={"uppercase"}>
                    Search Movies
                </Heading>
                <Select w={"130px"} onChange={(event) => {
                    setActivePage(1);
                    setSortBy(event.target.value);
                }}>
                    <option value="vote_average.desc&vote_count.gte=500">Top rated</option>
                    <option value="popularity.desc">Popular</option>
                </Select>
            </Flex>
            <Grid templateColumns={{base: "1fr", 
                                    sm: "repeat(2, 1fr)", 
                                    md: "repeat(4, 1fr)", 
                                    lg: "repeat(5, 1fr)"}} 
                  gap={"4"}>
                {movies && movies?.map((item, i) => (
                    isLoading ? (
                        <Skeleton height={"300"} 
                                  key={i}/>
                    ) : (
                        <CardComponent key={item?.id} 
                                       item={item} 
                                       type={"movie"}/>)
                    )

                )}
            </Grid>
            {/* Pages */}
            <PagingComponent activePage={activePage} totalPages={totalPages} setActivePage={setActivePage}>

            </PagingComponent>

        </Container>
    );
};

export default Movies