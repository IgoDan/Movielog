import { Container, Grid, Heading, Skeleton, Flex, Select, Input } from "@chakra-ui/react"
import { act, useEffect, useState } from "react";
import { fetchMovies, searchMovies } from "../services/api";
import CardComponent from "../components/CardComponent";
import PagingComponent from "../components/PagingComponent";
import { generateYearOptions } from "../utils/helper";

const Movies = () => {

    const [movies, setMovies] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState("vote_average.desc&vote_count.gte=500");
    const [searchValue, setSearchValue] = useState("")

    const [releaseYear, setReleaseYear] = useState(0);

    const [isLoading, setIsLoading] = useState(true);

    const RefreshNonSearch = () => {
        setIsLoading(true);
        fetchMovies(activePage, sortBy, releaseYear).then((res) => {
            console.log(res, 'res')
            setMovies(res?.results);
            setTotalPages(res?.total_pages);
        })
        .catch((err) => console.log(err, 'err'))
        .finally(( () => setIsLoading(false)))
    }

    const RefreshWithSearch = () => {
        setIsLoading(true);
        searchMovies(searchValue, activePage, releaseYear).then((res) => {
            console.log(res, 'res')
            setMovies(res?.results);
            setTotalPages(res?.total_pages);
        }).catch((err) => {
            console.log(err, 'err')
        }).finally(() => setIsLoading(false))
    }

    const handleSearch = (event) => {
        event.preventDefault();
        if (searchValue === ""){
            RefreshNonSearch();
        }
        else{
            RefreshWithSearch();
        }
        setActivePage(1);
    }

    useEffect(() => {
        if (searchValue === ""){
            RefreshNonSearch()
        }
        else{
            RefreshWithSearch()
        }
        setActivePage(1);
    }, [activePage, sortBy, releaseYear])

    return (
        <Container maxW={"container.xl"}>
            <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
                <Heading as="h2" fontSize={"md"} textTransform={"uppercase"}>
                    Search Movies
                </Heading>
                <Select w={"130px"}
                        disabled={!!searchValue}
                        onChange={(event) => {
                    setActivePage(1);
                    setSortBy(event.target.value);
                }}>
                    <option value="vote_average.desc&vote_count.gte=500">Top rated</option>
                    <option value="popularity.desc">Popular</option>
                </Select>
                <Select
                    w={"130px"}
                    onChange={(event) => {
                        setActivePage(1);
                        setReleaseYear(Number(event.target.value));
                    }}>
                    <option value={0}>
                            All years
                    </option>
                    {generateYearOptions().map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </Select>
                <form onSubmit={handleSearch}>
                    <Input w={"160px"}
                           placeholder="Search movies..."
                           _placeholder={{color: "gray.300"}} 
                           value = {searchValue} 
                           onChange={(event) => setSearchValue(event.target.value)}></Input>
                </form>
            </Flex>

            {movies?.length === 0 && !isLoading && (
                <Heading textAlign={"center"} as="h3" fontSize={"sm"} mt="10">
                    No results found
                </Heading>
            )}

            <Grid templateColumns={{base: "1fr", 
                                    sm: "repeat(2, 1fr)", 
                                    md: "repeat(4, 1fr)", 
                                    lg: "repeat(5, 1fr)"}} 
                  gap={"4"}>
                {movies?.length > 0 && movies?.map((item, i) => (
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
            <PagingComponent activePage={activePage} totalPages={totalPages} setActivePage={setActivePage}></PagingComponent>
        </Container>
    );
};

export default Movies