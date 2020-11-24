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
        function : 'TIME_SERIES_DAILY_ADJUSTED',
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
            $('#js-error-message').empty();
            displayStockResults(responseJson);
            $('#js-symbol-search').val('');
            return responseJson;
            
        })
        .catch(error => {
            $('#js-error-message').text(`Something went wrong: ${error.message}`);
            $('#js-stock-results').empty();
        });
    
}

//display stock symbol
function displayStockResults (responseJson) {
    // const stockSymbol = responseJson[metaData][symbol];
    // console.log(stockSymbol);
    $('#js-stock-results').append(
        `<h2>${stockSymbol(responseJson)}</h2>
        <table>
            <tr>
                <th>Open</th>
                <td>${dailyOpen(responseJson)}</td>
            </tr>
            <tr>
                <th>High</th>
                <td>${parseFloat(dailyHigh(responseJson))}</td>
            </tr>
            <tr>
                <th>Low</th>
                <td>${dailyLow(responseJson)}</td>
            </tr>
            <tr>
                <th>52wk High</th>
                <td>${parseFloat(fiftyTwoWeekHigh(responseJson))}</td>
            </tr>
            <tr>
                <th>52wk Low</th>
                <td>${parseFloat(fiftyTwoWeekLow(responseJson))}</td>
            </tr>
            <tr>
                <th>Volume</th>
                <td>${stockVolume(responseJson)}</td>
            </tr>
        </table>`
    )
}

//functoin to return stock Symbol
function stockSymbol (responseJson) {
    const metaData = 'Meta Data';
    const symbol = '2. Symbol'
    console.log(responseJson);
    return responseJson[metaData][symbol];
}

//function to return daily open
function dailyOpen (responseJson) {
    const dailyAdjusted = 'Time Series (Daily)';
    const keysDailyAdjusted = Object.keys(responseJson[dailyAdjusted]);
    const dailyStock = keysDailyAdjusted.slice(0,1);
    const openStock = '1. open';
    
    return responseJson[dailyAdjusted][dailyStock][openStock];
}

//function to return daily high
function dailyHigh (responseJson) {
    const dailyAdjusted = 'Time Series (Daily)';
    const keysDailyAdjusted = Object.keys(responseJson[dailyAdjusted]);
    const dailyStock = keysDailyAdjusted.slice(0,1);
    const highStock = '2. high';
    
    return responseJson[dailyAdjusted][dailyStock][highStock];
}

//function to return daily low
function dailyLow (responseJson) {
    const dailyAdjusted = 'Time Series (Daily)';
    const keysDailyAdjusted = Object.keys(responseJson[dailyAdjusted]);
    const dailyStock = keysDailyAdjusted.slice(0,1);
    const lowStock = '3. low';

    return responseJson[dailyAdjusted][dailyStock][lowStock];
}

//funtion to return 52wk high
function fiftyTwoWeekHigh (responseJson) {
    const weeklyAdjusted = 'Time Series (Daily)';
    const keysWeeklyAdjusted = Object.keys(responseJson[weeklyAdjusted]);
    const fiftyTwoWeeks = keysWeeklyAdjusted.slice(0,365);
    const highStock = '4. close';

    const stockArray = [];
    for (let i = 0; i < fiftyTwoWeeks.length; i++) {
        stockArray.push(responseJson[weeklyAdjusted][fiftyTwoWeeks[i]][highStock]);
    }
    
    stockArray.sort(function(a, b) { return a - b });
    return stockArray[stockArray.length - 1];
}

//function to return 52wk low
function fiftyTwoWeekLow (responseJson) {
    const weeklyAdjusted = 'Time Series (Daily)';
    const keysWeeklyAdjusted = Object.keys(responseJson[weeklyAdjusted]);
    const fiftyTwoWeeks = keysWeeklyAdjusted.slice(0,365);
    const lowStock = '3. low';

    const stockLow = [];

    for (let i = 0; i < fiftyTwoWeeks.length; i++) {
        stockLow.push(responseJson[weeklyAdjusted][fiftyTwoWeeks[i]][lowStock]);
    }
    
    stockLow.sort((a,b) => a-b);

    return stockLow[0];
}

//function to return the volume of the stock
function stockVolume (responseJson) {
    const dailyAdjusted = 'Time Series (Daily)';
    const keysDailyAdjusted = Object.keys(responseJson[dailyAdjusted]);
    const dailyStock = keysDailyAdjusted.slice(0,1);
    const volume = '6. volume';

    return responseJson[dailyAdjusted][dailyStock][volume];
}


//const symbol = 'aapl';
//function to get stock symbol
function stockForm() {
    $('form').submit( event => {
        event.preventDefault();
        const stock = $('#js-symbol-search').val();
        google.charts.load('current', {packages: ['corechart', 'line']});
        google.charts.setOnLoadCallback(drawLineColors(stock));
    });
}

    //copy and paste google function into function
    //Stock Chart


function drawLineColors (stock) {
    const stockURL = `https://www.alphavantage.co/query?`;
    
    //create parameters object
    const params = {
        function : 'TIME_SERIES_DAILY_ADJUSTED',
        symbol : stock,
        apikey : '2ROPO489EWWVNW2W'
    }
        //
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
            const dailyAdjusted = 'Time Series (Daily)';
            const weekObject = Object.keys(stockData[dailyAdjusted]);
            const stockClose = '4. close';
                //Current week array
            const chartDaily = weekObject.slice(0,30);
            const stockPriceArray = [];


            for (let i = 0; i < chartDaily.length; i++) {
                stockPriceArray.push(stockData[dailyAdjusted][chartDaily[i]][stockClose]);
            }


            for (i = 0; i < stockPriceArray.length; i++) {
                stockPriceArray[i] = parseFloat(stockPriceArray[i]);
            }
            const data = google.visualization.arrayToDataTable([
                ['Week', 'Stock'],
                [chartDaily[30],  stockPriceArray[30]],
                [chartDaily[29],  stockPriceArray[29]],
                [chartDaily[28],  stockPriceArray[28]],
                [chartDaily[27],  stockPriceArray[27]],
                [chartDaily[26],  stockPriceArray[26]],
                [chartDaily[25],  stockPriceArray[25]],
                [chartDaily[24],  stockPriceArray[24]],
                [chartDaily[23],  stockPriceArray[23]],
                [chartDaily[22],  stockPriceArray[22]],
                [chartDaily[21],  stockPriceArray[21]],
                [chartDaily[20],  stockPriceArray[20]],
                [chartDaily[19],  stockPriceArray[19]],
                [chartDaily[18],  stockPriceArray[18]],
                [chartDaily[17],  stockPriceArray[17]],
                [chartDaily[16],  stockPriceArray[16]],
                [chartDaily[15],  stockPriceArray[15]],
                [chartDaily[14],  stockPriceArray[14]],
                [chartDaily[13],  stockPriceArray[13]],
                [chartDaily[12],  stockPriceArray[12]],
                [chartDaily[11],  stockPriceArray[11]],
                [chartDaily[10],  stockPriceArray[10]],
                [chartDaily[9],   stockPriceArray[9]],
                [chartDaily[8],   stockPriceArray[8]],
                [chartDaily[7],   stockPriceArray[7]],
                [chartDaily[6],   stockPriceArray[6]],
                [chartDaily[5],   stockPriceArray[5]],
                [chartDaily[4],   stockPriceArray[4]],
                [chartDaily[3],   stockPriceArray[3]],
                [chartDaily[2],   stockPriceArray[2]],
                [chartDaily[1],   stockPriceArray[1]],
                [chartDaily[0],   stockPriceArray[0]]
            ]);
            const options = {
                title: `${stock}'s Stock Performance`,
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

function watchForm () {
    $('form').submit( event => {
        
        event.preventDefault();
        const searchSymbol = $('#js-symbol-search').val();
        getStockData(searchSymbol);
        getNewsArticles(searchSymbol);
        $('#results').removeClass('hidden');
    });
}

$(stockForm);
$(watchForm);
