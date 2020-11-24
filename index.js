function formatNewsQueryParams (params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${params[key]}`);
    return queryItems.join('&');
}

function getNewsArticles (searchSymbol) {
    const newsURL = 'https://yahoo-finance-low-latency.p.rapidapi.com/v2/finance/news?';
    const newsApiKey = '20c7cc0aefmsh61f334bc924a093p1f8f27jsn62d22eda0f66';
    

    const params = {
        symbols : searchSymbol
    }
    const queryString = formatNewsQueryParams(params);
    const newsQueryURL = `${newsURL}${queryString}`;

   

    const options = {
        headers: new Headers({
            'x-rapidapi-key' : newsApiKey
        })
    };

    fetch(newsQueryURL, options)
        .then(newsData => {
            if (newsData.ok) {
                return newsData.json();
            }
            $('#js-news-results').empty();
            throw new Error('Symbol not Found.');
        })
        .then(newsDataJson => {
            $('#js-news-results').empty();
            displayNewsResults(newsDataJson);
            
            //$('.error-message').empty();
        })
        .catch(error => {
            $('#js-news-error-message').text(`Something went wrong: ${error.message}`);
            $('js-news-results').empty();
        });
}

function displayNewsResults (newsDataJson) {
    
    const newsArray = newsDataJson['Content']['result'];

    for (let i = 0; i < newsArray.length; i++) {
        //console.log(newsArray[i].thumbnail);
        $('#js-news-results').append(
            `<a href='${newsArray[i].url}'><h3>${newsArray[i].title}</h3></a>
            <p>${newsArray[i].summary}</p>`
        )
    }
}

//Stock Stats 
//Open
//High
//Low
//52 wk High 
//52 wk low
//Volume
//Mkt Cap

//Stock API info

//Format stock symbol query 
function formatStockQueryParams (params) {
    
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${params[key]}`);
    
    return queryItems.join('&');
}


//Get Stock symbol function
function getStockData (searchSymbol) {
    const stockURL = `https://www.alphavantage.co/query?`;
    
    //create parameters object
    const params = {
        function : 'TIME_SERIES_WEEKLY_ADJUSTED',
        symbol : searchSymbol,
        apikey : '2ROPO489EWWVNW2W'
    }

    //connecting params object to the formatStockQueryParans function
    const queryString = formatStockQueryParams(params);
    
    //combining the url to the query params
    const stockQueryURL = `${stockURL}${queryString}`;

    //fetch request for stock API
    fetch(stockQueryURL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            $('#js-stock-results').empty();
            throw new Error('Symbol not Found.');
        })
        .then(responseJson => {
            $('#js-stock-results').empty();
            
            displayStockResults(responseJson);
            return responseJson;
            //displayStockResults(responseJson);
            //$('.error-message').empty();
            
        })
        .catch(error => {
            $('#js-error-message').text(`Something went wrong: ${error.message}`);
            $('#js-stock-results').empty();
        });
    
}

//display stock symbol
function displayStockResults (responseJson) {
    const metaData = 'Meta Data';
    const symbol = '2. Symbol'
    const stockSymbol = responseJson[metaData][symbol];
    $('#js-stock-results').append(
        `<h2>${stockSymbol}</h2>
        <p>52wk high : ${fiftyTwoWeekHigh(responseJson)}</p>
        <p>52wk low : ${fiftyTwoWeekLow(responseJson)}</p>`
    )
}

//52wk high
function fiftyTwoWeekHigh (responseJson) {
    const weeklyAdjusted = 'Weekly Adjusted Time Series';
    const keysWeeklyAdjusted = Object.keys(responseJson[weeklyAdjusted]);
    const fiftyTwoWeeks = keysWeeklyAdjusted.slice(0,52);
    const highStock = '2. high';

    const maxNum = 0;

    const stockArray = [];
    for (let i = 0; i < fiftyTwoWeeks.length; i++) {
        stockArray.push(responseJson[weeklyAdjusted][fiftyTwoWeeks[i]][highStock]);
    }
    
    stockArray.sort(function(a, b) { return a - b });
    return stockArray[stockArray.length - 1];
}

//52wk Low Function
function fiftyTwoWeekLow (responseJson) {
    const weeklyAdjusted = 'Weekly Adjusted Time Series';
    const keysWeeklyAdjusted = Object.keys(responseJson[weeklyAdjusted]);
    const fiftyTwoWeeks = keysWeeklyAdjusted.slice(0,52);
    const lowStock = '3. low';

    const stockLow = [];

    for (let i = 0; i < fiftyTwoWeeks.length; i++) {
        stockLow.push(responseJson[weeklyAdjusted][fiftyTwoWeeks[i]][lowStock]);
    }
    
    stockLow.sort((a,b) => a-b);
    
    const min = stockLow[0];

    return min;
}


//const symbol = 'aapl';
//function to get stock symbol
function stockForm() {
    $('form').submit( event => {
        event.preventDefault();
        const googleSymbol = $('#js-symbol-search').val();
        return googleSymbol;
    });

    //copy and paste google function into function
    //Stock Chart
    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawLineColors);

    function drawLineColors () {
        const stockURL = `https://www.alphavantage.co/query?`;
    
        //create parameters object
        const params = {
            function : 'TIME_SERIES_WEEKLY_ADJUSTED',
            symbol : stockForm(),
            apikey : '2ROPO489EWWVNW2W'
        }
        console.log(params);

        //connecting params object to the formatStockQueryParans function
        const queryString = formatStockQueryParams(params);
    
        //combining the url to the query params
        const stockQueryURL = `${stockURL}${queryString}`;
        fetch(stockQueryURL)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                $('#js-stock-results').empty();
                throw new Error('Symbol not Found.');
            })
            .then(responseJson => {
                //new array for X and Y values

                //collect the date  first 4 digits
                //collect the close data 

                // adammain

                const stockData = responseJson;
                console.log(stockData);

                const data = google.visualization.arrayToDataTable([
                    ['Year', 'Sales', 'Expenses'],
                    ['2004',  1000,      400],
                    ['2005',  1170,      460],
                    ['2006',  660,       1120],
                    ['2007',  1030,      540]
                ]);
                const options = {
                    title: 'Company Performance',
                    curveType: 'function',
                    legend: { position: 'bottom' }
                };
        
                const chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
        
                chart.draw(data, options);
            })
            .catch(error => {
                $('#js-error-message').text(`Something went wrong: ${error.message}`);
                $('#js-stock-results').empty();
            });
    }
}

function watchForm () {
    $('form').submit( event => {
        
        event.preventDefault();
        const searchSymbol = $('#js-symbol-search').val();
        getStockData(searchSymbol);
        getNewsArticles(searchSymbol);
        $('#results').removeClass('hidden');
    });
}

$(watchForm);
