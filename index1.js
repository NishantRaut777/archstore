const fs = require("fs");
const axios = require("axios");

const apiURL = "https://catfact.ninja/breeds";
const outputFile = "cat_breeds.txt";

// Fetching data
const fetchData = async (url) => {
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        console.log("ERROR WHILE FETCHING DATA", error);
    }
};

// Getting number of pages
const getNumberOfPages = async (url) => {
    try {
        const res = await axios.get(url);
        console.log("Total Number of pages: \n" , res.data.last_page);

    } catch (error) {
        console.log(error);
    }
}

// Logging to file
const logToFile = async (res) => {
    try {
        await fs.writeFile(outputFile, JSON.stringify(res, null, 2), (err) => err && console.error(err));
        console.log("DATA Written");

    } catch (error) {
        console.log("ERROR WHILE WRITING DATA", error);
    }
};

// Getting all pages data
const getAllPagesData = async (url) => {
    try {
      const allData = [];
      let nextPageURL = url;

      do {
        const currentPageData = await fetchData(nextPageURL);
        allData.push(...currentPageData.data);
        nextPageURL = currentPageData.next_page_url;
      } while (nextPageURL);

      return allData;

    } catch (error) {
        console.log(error);
    }
    
};

// Grouping data by country
const catBreedsByCountry = async (data) => {
    const breedsByCountry = {};

    data.forEach((breed) => {
        const country = breed.country;

        if(!breedsByCountry[country]){
            breedsByCountry[country] = [];
        }

        breedsByCountry[country].push({
            breed: breed.breed,
            origin: breed.origin,
            coat: breed.coat,
            pattern: breed.pattern
        })
    });

    try {
        await fs.writeFile("cat_breeds_grouped.txt", JSON.stringify(breedsByCountry, null, 2), (err) => err && console.error(err));
    } catch (error) {
        console.log("ERROR WHILE WRITING GROUPED DATA" , error);
    }
}



const catBreeds = async () => {
    try {
        // Log the response to a text file
        const apiResponseData = await fetchData(apiURL);
        await logToFile(apiResponseData);

        // Get Total number of pages
        await getNumberOfPages(apiURL);

        // Get data from all pages
        const allData = await getAllPagesData(apiURL);

        // Group cat breeds by country
        await catBreedsByCountry(allData);

    } catch (error) {
        console.log(error);
    }
};


catBreeds();


