import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Radio, RadioGroup, HStack, Box } from "@chakra-ui/react";

export default function StarRating({ rating, setRating, count, size }) {
  // count:  number of stars you want, pass as props
  // size: size of star that you want
  const [hover, setHover] = useState(null);

  return (
    <RadioGroup
      value={rating}
      onChange={(value) => setRating(Number(value))}
    >
      <HStack spacing={"1px"}>
        {[...Array(count || 5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <Box
              as="label"
              key={index}
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            >
              <Radio
                name="rating"
                value={ratingValue}
                display = "none"
              />
              <FaStar
                cursor={"pointer"}
                size={size || 25}
                transition="color 200ms"
              />
            </Box>
          );
        })}
      </HStack>
    </RadioGroup>
  );
}