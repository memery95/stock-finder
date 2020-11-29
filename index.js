//Global Variable
let currentValue = '';
let currentData;

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
            `<hr><li>
                <h3><a href='${newsArray[i].url}'>${newsArray[i].title}</a></h3>
                <p maxlength='100'>${newsArray[i].summary}</p>
            </li>`
        )
    }
}

//Stock API info

//Format stock symbol query 
function formatStockQueryParams (params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${params[key]}`);
    return queryItems.join('&');
}

//Get Stock symbol function
function getStockData (searchSymbol) {
    //fetch request for stock API
    console.log(currentData == null);
    if (searchSymbol != currentValue || currentData == null) {
        const params = {
            function : 'TIME_SERIES_DAILY_ADJUSTED',
            symbol : searchSymbol,
            apikey : '2ROPO489EWWVNW2W'
        }
        const stockURL = `https://www.alphavantage.co/query?`;
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
            $('#js-stock-results').empty();
            $('#js-error-message').empty();
            if (responseJson['Meta Data'] == null) {
                $('#js-error-message').text('Reached max number of request.')
            }
            currentData = responseJson;
            updateChart(responseJson);
            displayStockResults(responseJson);
            $('#js-symbol-search').val('');
            $('#js-footer').removeClass('hidden');
            $('#js-flex-home-page').css('margin-top','20px');
            
        })
        .catch(error => {
            $('#js-error-message').text(`Something went wrong: ${error.message}`);
            $('#js-stock-results').empty();
        });
        console.log(currentData);
        
    } else {
        updateChart(currentData);
    }
}

//display stock symbol
function displayStockResults (currentData) {
    $('#js-stock-results').append(
        `<h2>${stockSymbol(currentData)}</h2>
        <table class="stock-table">
            <tr>
                <th>Open</th>
                <td>${dailyOpen(currentData)}</td>
            </tr>
            <tr>
                <th>High</th>
                <td>${parseFloat(dailyHigh(currentData))}</td>
            </tr>
            <tr>
                <th>Low</th>
                <td>${dailyLow(currentData)}</td>
            </tr>
            <tr>
                <th>52wk High</th>
                <td>${parseFloat(fiftyTwoWeekHigh(currentData))}</td>
            </tr>
            <tr>
                <th>52wk Low</th>
                <td>${parseFloat(fiftyTwoWeekLow(currentData))}</td>
            </tr>
            <tr>
                <th>Volume</th>
                <td>${stockVolume(currentData)}</td>
            </tr>
        </table>`
    )
}

//functoin to return stock Symbol
function stockSymbol (currentData) {
    const metaData = 'Meta Data';
    const symbol = '2. Symbol';
    return currentData[metaData][symbol];
}

//function to return daily open
function dailyOpen (currentData) {
    const dailyAdjusted = 'Time Series (Daily)';
    const keysDailyAdjusted = Object.keys(currentData[dailyAdjusted]);
    const dailyStock = keysDailyAdjusted.slice(0,1);
    const openStock = '1. open';
    
    return currentData[dailyAdjusted][dailyStock][openStock];
}

//function to return daily high
function dailyHigh (currentData) {
    const dailyAdjusted = 'Time Series (Daily)';
    const keysDailyAdjusted = Object.keys(currentData[dailyAdjusted]);
    const dailyStock = keysDailyAdjusted.slice(0,1);
    const highStock = '2. high';
    
    return currentData[dailyAdjusted][dailyStock][highStock];
}

//function to return daily low
function dailyLow (currentData) {
    const dailyAdjusted = 'Time Series (Daily)';
    const keysDailyAdjusted = Object.keys(currentData[dailyAdjusted]);
    const dailyStock = keysDailyAdjusted.slice(0,1);
    const lowStock = '3. low';

    return currentData[dailyAdjusted][dailyStock][lowStock];
}

//funtion to return 52wk high
function fiftyTwoWeekHigh (currentData) {
    const weeklyAdjusted = 'Time Series (Daily)';
    const keysWeeklyAdjusted = Object.keys(currentData[weeklyAdjusted]);
    const fiftyTwoWeeks = keysWeeklyAdjusted.slice(0,365);
    const highStock = '4. close';

    const stockArray = [];
    for (let i = 0; i < fiftyTwoWeeks.length; i++) {
        stockArray.push(currentData[weeklyAdjusted][fiftyTwoWeeks[i]][highStock]);
    }
    
    stockArray.sort(function(a, b) { return a - b });
    return stockArray[stockArray.length - 1];
}

//function to return 52wk low
function fiftyTwoWeekLow (currentData) {
    const weeklyAdjusted = 'Time Series (Daily)';
    const keysWeeklyAdjusted = Object.keys(currentData[weeklyAdjusted]);
    const fiftyTwoWeeks = keysWeeklyAdjusted.slice(0,365);
    const lowStock = '3. low';
    const stockLow = [];

    for (let i = 0; i < fiftyTwoWeeks.length; i++) {
        stockLow.push(currentData[weeklyAdjusted][fiftyTwoWeeks[i]][lowStock]);
    }
    
    stockLow.sort((a,b) => a-b);
    return stockLow[0];
}

//function to return the volume of the stock
function stockVolume (currentData) {
    const dailyAdjusted = 'Time Series (Daily)';
    const keysDailyAdjusted = Object.keys(currentData[dailyAdjusted]);
    const dailyStock = keysDailyAdjusted.slice(0,1);
    const volume = '6. volume';

    return currentData[dailyAdjusted][dailyStock][volume];
}

function updateChart (currentData) {
    //stock symbol
    const metaData = 'Meta Data';
    const symbol = '2. Symbol';
    const symbolStock = currentData[metaData][symbol];    
    const dailyAdjusted = 'Time Series (Daily)';
    const weekObject = Object.keys(currentData[dailyAdjusted]);
    const stockClose = '4. close';
    //Current week array
    const chartDaily = weekObject.slice(0,30);
    const stockPriceArray = [];

    for (let i = 0; i < chartDaily.length; i++) {
        stockPriceArray.push(currentData[dailyAdjusted][chartDaily[i]][stockClose]);
    }

    for (i = 0; i < stockPriceArray.length; i++) {
        stockPriceArray[i] = parseFloat(stockPriceArray[i]);
    }

    const arrayHolder = [];
    arrayHolder.push(['Week','Stock']);
    for (i = 30; i >= 0; i--) {
        arrayHolder.push([chartDaily[i], stockPriceArray[i]]);
    }

    const data = google.visualization.arrayToDataTable(arrayHolder);

    const options = {
        title: `${symbolStock}'s 30 days stock performance`,
        backgroundColor: '#AEADAD',
        width: '100%',
        height: 400,
        curveType: 'function',
        legend: { position: 'bottom' }
    };
        
    const chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
        
    chart.draw(data, options);
}

//function to get stock symbol
function stockForm() {
    $('form').submit( event => {
        event.preventDefault();
        const stock = $('#js-symbol-search').val();
        getNewsArticles(stock);
        google.charts.load("current", {packages: ['corechart', 'line']});
        google.charts.setOnLoadCallback(getStockData(stock));
        $('#results').removeClass('hidden');
    });
}

$(stockForm);

$(window).resize(function() {
    const stock = $('#js-symbol-search').val();
    console.log(currentData);
    getStockData(stock);
});
