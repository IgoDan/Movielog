export const ratingToPercentage = (rating) => {
    return(rating * 10)?.toFixed(0);
}

export const averageRatingFormat = (rating) => {
    return(rating * 10)?.toFixed(0);
}

export const resolveRatingColor = (rating) => {
    if (rating >= 7) {
        return "green.400"
    } else if (rating >= 5) {
        return "orange.400"
    } else {
        return "red.400"
    }
}

export const generateYearOptions = (startYear = 1920) => {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let year = currentYear; year >= startYear; year--) {
        years.push(year);
    }

    return years;
};

export const createId = (id, type) => {
    return (type === "movie" ? "m" : "t") + id.toString();
}