$(document).ready(function(){
    // initial render
    renderCharts();

    // update every 30 secs
    setInterval(function(){
        renderCharts();
    }, 30000);

    function renderCharts(){
        $.ajax({
            method: 'GET',
            url: $('#app_context').val() + '/api/monitoring/' + $('#conn_name').val(),
            data: {}
        })
        .done(function(result){
            var scrollLocation = $(window).scrollTop();
            // clear chart canvas
            clearCharts();

            // show the db data
            if(result.dataRetrieved === true){
                $('#chartsWrapper').removeClass('hidden');
                $('#monitorPid').text(result.pid);
                $('#monitorVersion').text(result.version);
                $('#monitorUptime').text(result.uptime);
            }else{
                $('#chartsMessage').html("<p class='text-danger'>There was an error retrieving the monitoring data. Please ensure you are authenticated with a user who has 'admin' role assigned to the server.</p>");
                $('#chartsMessage').removeClass('hidden');
            }

            // data
            var connectionsChartData = {
                datasets: [
                    {
                        label: 'Current Connections',
                        borderColor: '#c9302c',
                        pointBorderColor: '#fff',
                        fill: false,
                        data: result.data.connectionsCurrent
                    },
                    {
                        label: 'Connections Available',
                        borderColor: '#5cb85c',
                        pointBorderColor: '#fff',
                        fill: false,
                        data: result.data.connectionsAvailable
                    },
                    {
                        label: 'Connections Total created',
                        borderColor: '#ec971f',
                        pointBorderColor: '#fff',
                        fill: false,
                        data: result.data.connectionsTotalCreated
                    }
                ]
            };

            var clientsChartData = {
                datasets: [
                    {
                        label: 'Total clients',
                        borderColor: '#c9302c',
                        pointBorderColor: '#fff',
                        fill: false,
                        data: result.data.clientsTotal
                    },
                    {
                        label: 'Total readers',
                        borderColor: '#5cb85c',
                        pointBorderColor: '#fff',
                        fill: false,
                        data: result.data.clientsReaders
                    },
                    {
                        label: 'Total writers',
                        borderColor: '#ec971f',
                        pointBorderColor: '#fff',
                        fill: false,
                        data: result.data.clientsWriters
                    }
                ]
            };

            var memoryChartData = {
                datasets: [
                    {
                        label: 'Allocated',
                        borderColor: '#c9302c',
                        pointBorderColor: '#fff',
                        fill: false,
                        data: result.data.memoryVirtual
                    },
                    {
                        label: 'Mapped',
                        borderColor: '#5cb85c',
                        pointBorderColor: '#fff',
                        fill: false,
                        data: result.data.memoryMapped
                    },
                    {
                        label: 'Currently used',
                        borderColor: '#ec971f',
                        pointBorderColor: '#fff',
                        fill: false,
                        data: result.data.memoryCurrent
                    }
                ]
            };

            var docsChartData = {
                datasets: [
                    {
                        label: 'Documents queried',
                        borderColor: '#c9302c',
                        pointBorderColor: '#fff',
                        fill: false,
                        data: result.data.docsQueried
                    },
                    {
                        label: 'Documents inserted',
                        borderColor: '#5cb85c',
                        pointBorderColor: '#fff',
                        fill: false,
                        data: result.data.docsInserted
                    },
                    {
                        label: 'Documents deleted',
                        borderColor: '#ec971f',
                        pointBorderColor: '#fff',
                        fill: false,
                        data: result.data.docsDeleted
                    },
                    {
                        label: 'Documents updated',
                        borderColor: '#31b0d5',
                        pointBorderColor: '#fff',
                        fill: false,
                        data: result.data.docsUpdated
                    }
                ]
            };
            // data

            // charts
            var ctx = document.getElementById('connectionsChart');
            var connectionsChart = new Chart(ctx, {
                type: 'line',
                data: connectionsChartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            type: 'time',
                            display: true,
                            time: {
                                displayFormats: {
                                    quarter: 'MMM YYYY'
                                }
                            }
                        }],
                        yAxes: [{
                            type: 'linear'
                        }]
                    }
                }
            });

            var ctx = document.getElementById('clientsChart');
            var clientsChart = new Chart(ctx, {
                type: 'line',
                data: clientsChartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            type: 'time',
                            display: true,
                            time: {
                                displayFormats: {
                                    quarter: 'MMM YYYY'
                                },
                                unitStepSize: 20
                            }
                        }],
                        yAxes: [{
                            type: 'linear'
                        }]
                    }
                }
            });

            var ctx = document.getElementById('memoryChart');
            var memoryChart = new Chart(ctx, {
                type: 'line',
                data: memoryChartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            type: 'time',
                            display: true,
                            time: {
                                displayFormats: {
                                    quarter: 'MMM YYYY'
                                },
                                unitStepSize: 20
                            }
                        }],
                        yAxes: [{
                            type: 'linear'
                        }]
                    }
                }
            });

            var ctx = document.getElementById('docsChart');
            var docsChart = new Chart(ctx, {
                type: 'line',
                data: docsChartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            type: 'time',
                            display: true,
                            time: {
                                displayFormats: {
                                    quarter: 'MMM YYYY'
                                },
                                unitStepSize: 20
                            }
                        }],
                        yAxes: [{
                            type: 'linear'
                        }]
                    }
                }
            });
            // charts
            $(window).scrollTop(scrollLocation);
        })
        .fail(function(data){
            $('#chartsMessage').html("<p class='text-danger'>There was an error retrieving the monitoring data. Please ensure you are authenticated with a user who has 'admin' role assigned to the server.</p>");
            $('#chartsMessage').removeClass('hidden');
        });
    }

    function clearCharts(){
        $('#memoryChart').replaceWith('<canvas id="memoryChart" height="200"></canvas>');
        $('#connectionsChart').replaceWith('<canvas id="connectionsChart" height="200"></canvas>');
        $('#clientsChart').replaceWith('<canvas id="clientsChart" height="200"></canvas>');
        $('#docsChart').replaceWith('<canvas id="docsChart" height="200"></canvas>');
    }
});
