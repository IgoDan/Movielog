import { Container, Grid, Heading, Skeleton, Flex, Select, Input } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { fetchShows, searchShows } from "../services/api";
import CardComponent from "../components/CardComponent";
import PagingComponent from "../components/PagingComponent";
import { generateYearOptions } from "../utils/helper";

const Shows = () => {

    const [shows, setShows] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState("vote_average.desc&vote_count.gte=500");
    const [searchValue, setSearchValue] = useState("")

    const [releaseYear, setReleaseYear] = useState(0);

    const [isLoading, setIsLoading] = useState(true);

    const RefreshNonSearch = () => {
        setIsLoading(true);
        fetchShows(activePage, sortBy, releaseYear).then((res) => {
            console.log(res, 'res')
            setShows(res?.results);
            setActivePage(res?.page);
            setTotalPages(res?.total_pages);
        })
        .catch((err) => console.log(err, 'err'))
        .finally(( () => setIsLoading(false)))
    }

    const RefreshWithSearch = () => {
        setIsLoading(true);
        searchShows(searchValue, activePage, releaseYear).then((res) => {
            console.log(res, 'res')
            setShows(res?.results);
            setActivePage(res?.page);
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
    }

    useEffect(() => {
        setIsLoading(true);
        if (searchValue === ""){
            RefreshNonSearch()
        }
        else{
            RefreshWithSearch()
        }
    }, [activePage, sortBy, releaseYear])

    return (
        <Container maxW={"container.xl"}>
            <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
                <Heading as="h2" fontSize={"md"} textTransform={"uppercase"}>
                    Search TV Shows
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
                           placeholder="Search TV shows..."
                           _placeholder={{color: "gray.300"}} 
                           value = {searchValue} 
                           onChange={(event) => setSearchValue(event.target.value)}></Input>
                </form>
            </Flex>

            {shows?.length === 0 && !isLoading && (
                <Heading textAlign={"center"} as="h3" fontSize={"sm"} mt="10">
                    No results found
                </Heading>
            )}

            <Grid templateColumns={{base: "1fr", 
                                    sm: "repeat(2, 1fr)", 
                                    md: "repeat(4, 1fr)", 
                                    lg: "repeat(5, 1fr)"}} 
                  gap={"4"}>
                {shows?.length > 0 && shows?.map((item, i) => (
                    isLoading ? (
                        <Skeleton height={"300"} 
                                  key={i}/>
                    ) : (
                        <CardComponent key={item?.id} 
                                       item={item} 
                                       type={"tv"}/>)
                    )
                )}
            </Grid>
            {/* Pages */}
            <PagingComponent activePage={activePage} totalPages={totalPages} setActivePage={setActivePage}></PagingComponent>
        </Container>
    );
};

export default Shows