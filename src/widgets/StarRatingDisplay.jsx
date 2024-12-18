import React from "react";
import { FaStar } from "react-icons/fa";
import { HStack, Box } from "@chakra-ui/react";

export default function StarRatingDisplay({ rating, count, size }) {

  return (
    <HStack spacing={"1px"}>
      {[...Array(count || 5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <Box
            key={index}
            color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"} // Kolor gwiazdek
          >
            <FaStar size={size || 25} />
          </Box>
        );
      })}
    </HStack>
  );
}