import { Container, Grid, Heading, Skeleton, Flex, Select } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { fetchShows } from "../services/api";
import CardComponent from "../components/CardComponent";
import PagingComponent from "../components/PagingComponent";
import { generateYearOptions } from "../utils/helper";

const Shows = () => {

    const [shows, setShows] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState("vote_average.desc&vote_count.gte=500");

    const [releaseYear, setReleaseYear] = useState(0);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetchShows(activePage, sortBy, releaseYear).then((res) => {
            console.log(res, 'res')
            setShows(res?.results);
            setActivePage(res?.page);
            setTotalPages(res?.total_pages);
        })
        .catch((err) => console.log(err, 'err'))
        .finally(( () => setIsLoading(false)))
    }, [activePage, sortBy, releaseYear])

    return (
        <Container maxW={"container.xl"}>
            <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
                <Heading as="h2" fontSize={"md"} textTransform={"uppercase"}>
                    Search TV Shows
                </Heading>
                <Select w={"130px"} onChange={(event) => {
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
            </Flex>
            <Grid templateColumns={{base: "1fr", 
                                    sm: "repeat(2, 1fr)", 
                                    md: "repeat(4, 1fr)", 
                                    lg: "repeat(5, 1fr)"}} 
                  gap={"4"}>
                {shows && shows?.map((item, i) => (
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
            <PagingComponent activePage={activePage} totalPages={totalPages} setActivePage={setActivePage}>

            </PagingComponent>

        </Container>
    );
};

export default Shows