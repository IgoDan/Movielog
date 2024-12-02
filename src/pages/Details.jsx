import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Heading } from "@chakra-ui/react"
import { fetchDetails } from "../services/api";

const Details = () => {
    const router = useParams();
    const { type, id } = router;

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDetails(type, id)
        .then((res) => {
            console.log(res, 'res');
       })
       .catch((err) => {
            console.log(err, 'err');
       })
       .finally(() => {
            setLoading(false);
       })
    }, [type, id])

    return (
        <Box>
            {type + id}
        </Box>
    );
};

export default Details