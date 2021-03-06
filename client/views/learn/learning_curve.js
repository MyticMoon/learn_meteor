Template.learningCurve.onRendered(function(){
    $( document ).ready(function() {

        var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var randomScalingFactor = function() {
            return Math.round(Math.random() * 100 * (Math.random() > 0.5 ? -1 : 1));
        };
        var randomColorFactor = function() {
            return Math.round(Math.random() * 255);
        };
        var randomColor = function(opacity) {
            return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
        };

        var currentCardId = Session.get("currentCardId");
        var card = Cards.find({_id: currentCardId}).fetch()[0];
        var memoryPointHistory = card.memoryPointHistory;
        var labels = [];
        var data = [];
        $.each(memoryPointHistory, function(key,value){
            if(value.dateTime) {
                labels.push(moment(new Date(value.dateTime).toString()).format('MM/DD/YYYY h:mm a'));
                data.push(value.memoryPoint);
            }
        });

        var config = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Learning Curve",
                    //data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
                    data: data,
                    fill: false
                    //borderDash: [5, 5]
                }
                //    , {
                //    label: "My Second dataset",
                //    data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
                //    fill: false,
                //    borderDash: [5, 5],
                //}, {
                //    label: "My Third dataset - No bezier",
                //    data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
                //    lineTension: 0,
                //    fill: false,
                //}, {
                //    label: "My Fourth dataset",
                //    data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
                //    fill: false,
                //}
                ]
            },
            options: {
                responsive: true,
                legend: {
                    position: 'bottom'
                },
                hover: {
                    mode: 'label'
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'DateTime'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Memory Point'
                        }
                    }]
                },
                title: {
                    display: true,
                    text: 'Learning Curve'
                }
            }
        };
        $.each(config.data.datasets, function(i, dataset) {
            var background = randomColor(0.5);
            dataset.borderColor = background;
            dataset.backgroundColor = background;
            dataset.pointBorderColor = background;
            dataset.pointBackgroundColor = background;
            dataset.pointBorderWidth = 1;
        });

        var ctx = document.getElementById("canvas").getContext("2d");
        window.myLine = new Chart(ctx, config);

        $('#randomizeData').click(function() {
            $.each(config.data.datasets, function(i, dataset) {
                dataset.data = dataset.data.map(function() {
                    return randomScalingFactor();
                });
            });
            window.myLine.update();
        });
        $('#addDataset').click(function() {
            var background = randomColor(0.5);
            var newDataset = {
                label: 'Dataset ' + config.data.datasets.length,
                borderColor: background,
                backgroundColor: background,
                pointBorderColor: background,
                pointBackgroundColor: background,
                pointBorderWidth: 1,
                fill: false,
                data: []
            };
            for (var index = 0; index < config.data.labels.length; ++index) {
                newDataset.data.push(randomScalingFactor());
            }
            config.data.datasets.push(newDataset);
            window.myLine.update();
        });
        $('#addData').click(function() {
            if (config.data.datasets.length > 0) {
                var month = MONTHS[config.data.labels.length % MONTHS.length];
                config.data.labels.push(month);
                $.each(config.data.datasets, function(i, dataset) {
                    dataset.data.push(randomScalingFactor());
                });
                window.myLine.update();
            }
        });
        $('#removeDataset').click(function() {
            config.data.datasets.splice(0, 1);
            window.myLine.update();
        });
        $('#removeData').click(function() {
            config.data.labels.splice(-1, 1); // remove the label first
            config.data.datasets.forEach(function(dataset, datasetIndex) {
                dataset.data.pop();
            });
            window.myLine.update();
        });
    });
});